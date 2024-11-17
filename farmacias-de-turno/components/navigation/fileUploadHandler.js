import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import XLSX from 'xlsx';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '@/database/firebase'; // Asegúrate de que la ruta sea correcta

const validatePharmacyData = (pharmacy) => {
  const { name, address, phone, day, month, year } = pharmacy;
  if (!name || !address || !phone || !day || !month || !year) {
    return false;
  }
  // Puedes agregar más validaciones aquí si es necesario
  return true;
};

export const handleFileUpload = async () => {
  try {
    // Selecciona el archivo
    const res = await DocumentPicker.getDocumentAsync({
      type: ['text/csv', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'],
    });

    if (res.type === 'cancel') {
      console.log('El usuario canceló la selección del archivo');
      return;
    }

    // Verifica que la URI del archivo no sea nula
    const fileUri = res.uri;
    console.log('File URI:', fileUri); // Agregar console.log para verificar la URI
    if (!fileUri) {
      throw new Error('No se pudo obtener la URI del archivo');
    }

    // Lee el archivo y conviértelo a JSON
    const fileData = await FileSystem.readAsStringAsync(fileUri, {
      encoding: FileSystem.EncodingType.Base64,
    });

    const workbook = XLSX.read(fileData, { type: 'base64' });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const jsonData = XLSX.utils.sheet_to_json(sheet);

    console.log('Excel parsed:', jsonData);

    // Convierte cada farmacia a la estructura que Firebase espera y valida los datos
    const pharmacies = jsonData.map(item => ({
      year: item.año,
      month: item.mes,
      day: item.dia,
      name: item.nombre,
      address: item.direccion,
      phone: item.telefono,
    })).filter(validatePharmacyData);

    if (pharmacies.length === 0) {
      console.error('No se encontraron datos válidos en el archivo');
      return;
    }

    // Guarda las farmacias en Firebase
    try {
      const pharmaciesCollection = collection(db, 'pharmacies');
      for (const pharmacy of pharmacies) {
        await addDoc(pharmaciesCollection, pharmacy);
      }
      console.log('Farmacias guardadas exitosamente en Firestore');
    } catch (e) {
      console.error('Error al guardar las farmacias en Firestore: ', e);
    }
  } catch (err) {
    console.error('Error al seleccionar el archivo: ', err);
  }
};