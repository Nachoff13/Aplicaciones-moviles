import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  light: {
    container: { backgroundColor: '#f7f7f7' },
    text: { color: '#000' },
    input: { backgroundColor: '#fff', borderColor: '#ddd' },
    button: { backgroundColor: '#4285f4' },
    checkboxContainer: { backgroundColor: '#f7f7f7', borderColor: '#f7f7f7' },
  },
  dark: {
    container: { backgroundColor: '#000' },
    text: { color: '#fff' },
    input: { backgroundColor: '#333', borderColor: '#555' },
    button: { backgroundColor: '#4285f4' },
    checkboxContainer: { backgroundColor: '#000', borderColor: '#000' },
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    alignSelf: 'center',
  },
  input: { 
    padding: 10, 
    borderRadius: 5, 
    borderWidth: 1, 
    marginBottom: 10,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  pickerContaineriOS: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },
  pickerContainerAndroid: {
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 20,
  },
  picker: {
    height: 50,
    width: '100%',
    borderRadius: 5,
    backgroundColor: '#fff',
  },
  button: {
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 5,
    marginBottom: 25,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  buttonHour: {
    borderRadius: 10,
    padding: 15,
    borderColor: '#C3C3C3',
    borderWidth: 1,
    marginBottom: 15,
  },
  buttonTextHour: {
    fontSize: 15,
    fontWeight: 'bold',
  },
});

export default styles;