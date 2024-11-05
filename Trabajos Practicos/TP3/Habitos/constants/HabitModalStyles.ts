import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: 24,
    marginBottom: 20,
  },
  cardContainer: {
    width: '100%',
    paddingHorizontal: 20,
  },
  card: {
    padding: 20,
    marginVertical: 10,
    borderRadius: 10,
    elevation: 3, // Sombra en Android
    shadowColor: '#000', // Sombra en iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  cardText: {
    fontSize: 18,
    textAlign: 'center',
  },

  // Estilos del HabitModal
  modalContainer: { 
    flex: 1, 
    padding: 20 
  },
  modalTitle: { 
    fontSize: 20, 
    fontWeight: 'bold', 
    marginBottom: 16, 
    textAlign: 'center' 
  },
  label: { 
    fontSize: 16, 
    marginBottom: 8, 
    fontWeight: 'bold' 
  },
  input: { 
    padding: 10, 
    borderRadius: 5, 
    borderColor: '#ddd', 
    borderWidth: 1, 
    marginBottom: 10 
  },
  picker: { 
    height: 50, 
    width: '100%' 
  },
  checkboxContainer: { 
    marginBottom: 15 
  },
  timePicker: { 
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    borderColor: '#C3C3C3',
    borderWidth: 1,
    marginBottom: 15,
  },
  timeText: { 
    fontSize: 16 
  },
  modalButtons: { 
    flexDirection: 'row', 
    justifyContent: 'space-around', 
    marginBottom: 30 
  },
  modalButton: { 
    backgroundColor: '#007bff', 
    padding: 10, 
    borderRadius: 5, 
    alignItems: 'center', 
    width: '40%' 
  },
  btnText: { 
    color: '#fff', 
    fontSize: 16 
  },
  cancelButton: { 
    backgroundColor: '#ff4d4d' 
  },
  saveButton: {
    backgroundColor: '#28a745', // Color verde para el botón de guardar
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    width: '40%',
  },

  // Estilos claros y oscuros
  lightBackground: {
    backgroundColor: '#f7f7f7',
  },
  darkBackground: {
    backgroundColor: '#1c1c1c',
  },
  darkText: {
    color: '#ffffff',
  },
  lightText: {
    color: '#000',
  },
  darkInput: {
    padding: 10,
    borderRadius: 5,
    borderColor: '#666',
    borderWidth: 1,
    marginBottom: 10,
    backgroundColor: '#E0E0E0',
    color: '#000',
  },
  lightInput: {
    padding: 10,
    borderRadius: 5,
    borderColor: '#ddd',
    borderWidth: 1,
    marginBottom: 10,
  },
  pickerContainer: {
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    overflow: 'hidden',
  },
});

const light = {
  container: { backgroundColor: '#fff' },
  text: { color: '#000' },
  card: { backgroundColor: '#f0f0f0' },
};

const dark = {
  container: { backgroundColor: '#121212' },
  text: { color: '#ffffff' },
  card: { backgroundColor: '#1F1F1F' },
};

export { styles, light, dark };