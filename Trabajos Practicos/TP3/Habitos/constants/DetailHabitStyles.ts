import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 16 
  },

  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    alignSelf: 'center',
  },
  habitContainer: { 
    marginBottom: 16, 
    padding: 16, 
    backgroundColor: '#fff', 
    borderRadius: 8, 
    elevation: 2 
  },
  subTitle: { 
    fontSize: 18 
  },
  deleteBtn: { 
    padding: 10, 
    borderRadius: 5, 
    alignItems: 'center', 
    marginVertical: 10, 
    width: '90%', 
    alignSelf: 'center' 
  },
  btnText: { 
    color: '#fff', 
    fontSize: 16 
  },
  searchInput: { 
    padding: 10, 
    borderRadius: 5, 
    borderWidth: 1, 
    marginBottom: 10, 
    width: '90%', 
    alignSelf: 'center' 
  },
  actionButtons: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    marginTop: 10 
  },
  modalContainer: { 
    flex: 1, 
    justifyContent: 'center', 
    padding: 20, 
    backgroundColor: '#fff' 
  },
  modalTitle: { 
    fontSize: 20, 
    fontWeight: 'bold', 
    marginBottom: 16, 
    textAlign: 'center' 
  },
  input: { 
    padding: 10, 
    borderRadius: 5, 
    borderColor: '#ddd', 
    borderWidth: 1, 
    marginBottom: 10 
  },
  modalButtons: { 
    flexDirection: 'row', 
    justifyContent: 'space-around' 
  },
  modalButton: { 
    backgroundColor: '#007bff', 
    padding: 10, 
    borderRadius: 5, 
    alignItems: 'center', 
    width: '40%' 
  },
  cancelButton: { 
    backgroundColor: '#ff4d4d' 
  },
});
const light= {
  container: { backgroundColor: '#fff' },
  text: { color: '#000' },
  button: { backgroundColor: '#ff4d4d' },
  searchInput: { backgroundColor: '#f0f0f0', borderColor: '#ddd', color: '#000' },
  searchLabel: { color: '#000' },
};
const dark= {
  container: { backgroundColor: '#100' },
  text: { color: '#fff' },
  button: { backgroundColor: '#ff4d4d' },
  searchInput: { backgroundColor: '#555', borderColor: '#fff', color: '#ccc' },
  searchLabel: { color: '#ccc' },
};

export { styles, light, dark };