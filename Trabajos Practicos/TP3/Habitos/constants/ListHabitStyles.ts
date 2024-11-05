import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  light: {
    container: { backgroundColor: '#f7f7f7' },
    text: { color: '#000' },
    habitContainer: { backgroundColor: '#fff' },
    button: { backgroundColor: '#ff4d4d' },
    subTitle: { color: '#000' },
    content: { color: '#000' },
  },
  dark: {
    container: { backgroundColor: '#000' },
    text: { color: '#fff' },
    habitContainer: { backgroundColor: '#333' },
    button: { backgroundColor: '#ff4d4d' },
    subTitle: { color: '#fff' },
    content: { color: '#fff' },
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
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
  row: { 
    flexDirection: 'row', 
    flexWrap: 'wrap', 
    alignItems: 'baseline' 
  },
  subTitle: { 
    fontSize: 18, 
    fontWeight: 'bold' 
  },
  content: { 
    fontSize: 16, 
    marginLeft: 0 
  },
  deleteBtn: {
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginVertical: 10,
    width: '90%',
    alignSelf: 'center',
  },
  btn: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  btnText: {
    color: '#fff',
    fontSize: 16,
  },
  toggleButtonContainer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
  },
});

export default styles;