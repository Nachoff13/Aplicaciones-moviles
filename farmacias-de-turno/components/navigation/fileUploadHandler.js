import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import XLSX from 'xlsx';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '@/database/firebase';

const validatePharmacyData = (pharmacy) => {
  const { name, address, phone, turnDate } = pharmacy;
  if (!name || !address || !phone || !turnDate) {
    return false;
  }
  // Puedes agregar más validaciones aquí si es necesario
  return true;
};

const convertExcelDateToJSDate = (excelDate) => {
  const jsDate = new Date((excelDate - (25567 + 2)) * 86400 * 1000);
  const year = jsDate.getFullYear();
  const month = String(jsDate.getMonth() + 1).padStart(2, '0');
  const day = String(jsDate.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const handleFileUpload = async () => {
  try {
    const res = await DocumentPicker.getDocumentAsync({
      type: ['text/csv', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'],
      copyToCacheDirectory: true,
    });

    console.log('Resultado completo de DocumentPicker:', res);

    if (res.canceled || !res.assets || res.assets.length === 0) {
      console.log('El usuario canceló la selección del archivo o no se seleccionó ningún archivo');
      return [];
    }

    // Obtenemos la URI correcta del archivo
    const fileUri = res.assets[0].uri; // Accedemos a la URI desde "assets"
    console.log('File URI:', fileUri);

    if (!fileUri) {
      throw new Error('No se pudo obtener la URI del archivo');
    }

    // Leer y procesar el archivo
    const fileData = await FileSystem.readAsStringAsync(fileUri, {
      encoding: FileSystem.EncodingType.Base64,
    });

    const workbook = XLSX.read(fileData, { type: 'base64' });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const jsonData = XLSX.utils.sheet_to_json(sheet);

    console.log('Datos del Excel:', jsonData);

    const pharmacies = jsonData
      .map((item) => ({
        turnDate: convertExcelDateToJSDate(item.turnDate),
        name: item.name,
        address: item.address,
        phone: item.phone,
      }))
      .filter(validatePharmacyData);

    console.log('Datos parseados antes de la validación:', pharmacies);

    if (pharmacies.length === 0) {
      console.error('No se encontraron datos válidos en el archivo');
      return [];
    }

    // Guarda las farmacias en Firebase
    try {
      const pharmaciesCollection = collection(db, 'pharmacies');
      for (const pharmacy of pharmacies) {
        console.log('Guardando farmacia:', pharmacy);
        await addDoc(pharmaciesCollection, pharmacy);
        console.log('Colección de Farmacias:', pharmaciesCollection);
      }
      console.log('Farmacias guardadas exitosamente en Firestore');
    } catch (e) {
      console.error('Error al guardar las farmacias en Firestore: ', e);
    }

    return pharmacies;
  } catch (err) {
    console.error('Error al seleccionar el archivo: ', err);
    return [];
  }
};