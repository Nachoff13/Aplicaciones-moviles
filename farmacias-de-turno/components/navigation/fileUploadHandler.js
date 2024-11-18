import axios from 'axios';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import XLSX from 'xlsx';

import { collection, addDoc } from 'firebase/firestore';
import { db } from '@/database/firebase';

const API_KEY = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY;

const validatePharmacyData = (pharmacy) => {
  const { name, address, phone, turnDate } = pharmacy;
  return !!(name && address && phone && turnDate);
};

const convertExcelDateToJSDate = (excelDate) => {
  if (typeof excelDate === 'number') {
    const jsDate = new Date((excelDate - (25567 + 2)) * 86400 * 1000);
    const year = jsDate.getFullYear();
    const month = String(jsDate.getMonth() + 1).padStart(2, '0');
    const day = String(jsDate.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  } else if (typeof excelDate === 'string') {
    return excelDate;
  } else {
    console.error('Fecha de Excel no válida:', excelDate);
    return null;
  }
};

const normalizeString = (str) => {
  return str.trim().toLowerCase().replace(/\s+/g, ' ');
};

const fetchPharmacyCoordinates = async (address) => {
  console.log('Buscando coordenadas para:', address);
  const url = `https://maps.googleapis.com/maps/api/place/textsearch/json`;
  try {
    const response = await axios.get(url, {
      params: {
        query: address,
        key: API_KEY,
      },
    });
    console.log('Respuesta de la API de Google Maps:', response.data);
    const result = response.data.results[0];
    if (result) {
      const { geometry } = result;
      return {
        lat: geometry.location.lat,
        lng: geometry.location.lng,
      };
    } else {
      console.warn(`No se encontraron coordenadas para la dirección: "${address}"`);
      return null;
    }
  } catch (error) {
    console.error(`Error al obtener coordenadas para la dirección "${address}":`, error);
    return null;
  }
};

export const handleFileUpload = async (setPharmacies, existingPharmacies) => {
  try {
    // Selección de archivo
    const res = await DocumentPicker.getDocumentAsync({
      type: ['text/csv', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'],
      copyToCacheDirectory: true,
    });

    if (res.canceled || !res.assets || res.assets.length === 0) {
      console.log('El usuario canceló la selección del archivo o no se seleccionó ningún archivo');
      return [];
    }

    const fileUri = res.assets[0].uri;

    if (!fileUri) {
      throw new Error('No se pudo obtener la URI del archivo');
    }

    // Leer el contenido del archivo
    const fileData = await FileSystem.readAsStringAsync(fileUri, {
      encoding: FileSystem.EncodingType.Base64,
    });

    // Parsear archivo Excel
    const workbook = XLSX.read(fileData, { type: 'base64' });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const jsonData = XLSX.utils.sheet_to_json(sheet);

    // Validar y filtrar farmacias
    const pharmacies = jsonData
      .map((item) => ({
        turnDate: convertExcelDateToJSDate(item.turnDate),
        name: item.name,
        address: item.address,
        phone: item.phone,
      }))
      .filter(validatePharmacyData);

    if (pharmacies.length === 0) {
      console.error('No se encontraron datos válidos en el archivo');
      return [];
    }

    // Enriquecer farmacias con coordenadas
    const enrichedPharmacies = await Promise.all(
      pharmacies.map(async (pharmacy) => {
        console.log('Procesando farmacia:', pharmacy.name);
        const coordinates = await fetchPharmacyCoordinates(pharmacy.address);
        console.log('Coordenadas obtenidas para farmacia:', pharmacy.name, coordinates);
        if (!coordinates) {
          console.warn(`Farmacia sin coordenadas: ${pharmacy.name}`);
        }
        return {
          ...pharmacy,
          coordinates,
        };
      })
    );

    // Pasar las farmacias enriquecidas a GoogleMapView
    console.log('Farmacias enriquecidas:', enrichedPharmacies);
    setPharmacies(enrichedPharmacies);

    // Filtrar farmacias nuevas para evitar duplicados
    const newPharmacies = pharmacies.filter((pharmacy) => {
      return !existingPharmacies.some((existingPharmacy) => {
        return (
          normalizeString(existingPharmacy.name) === normalizeString(pharmacy.name) &&
          normalizeString(existingPharmacy.address) === normalizeString(pharmacy.address) &&
          normalizeString(existingPharmacy.phone) === normalizeString(pharmacy.phone) &&
          existingPharmacy.turnDate === pharmacy.turnDate
        );
      });
    });

    // Guardar nuevas farmacias en Firestore (solo si no son duplicadas)
    try {
      const pharmaciesCollection = collection(db, 'pharmacies');
      for (const pharmacy of newPharmacies) {
        await addDoc(pharmaciesCollection, pharmacy);
      }
      console.log('Nuevas farmacias guardadas exitosamente en Firestore');
    } catch (e) {
      console.error('Error al guardar las farmacias en Firestore: ', e);
    }

    return enrichedPharmacies;
  } catch (err) {
    console.error('Error al procesar el archivo: ', err);
    return [];
  }
};

// Hook que solo obtiene las farmacias de Firebase al montar el componente
export const usePharmacies = () => {
  const [pharmacies, setPharmacies] = useState([]);
  const [existingPharmacies, setExistingPharmacies] = useState([]);

  // Cargar farmacias desde Firebase solo cuando se sube un archivo
  useEffect(() => {
    const fetchPharmaciesFromFirebase = async () => {
      try {
        const pharmaciesCollection = collection(db, 'pharmacies');
        const snapshot = await getDocs(pharmaciesCollection);
        const loadedPharmacies = snapshot.docs.map((doc) => doc.data());
        setExistingPharmacies(loadedPharmacies);
      } catch (e) {
        console.error('Error al obtener farmacias de Firebase: ', e);
      }
    };

    fetchPharmaciesFromFirebase();
  }, []);

  return { pharmacies, setPharmacies, existingPharmacies };
};
