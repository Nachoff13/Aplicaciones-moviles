import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
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
  subTitleSwitch: {
    fontSize: 18,
    fontWeight: 'bold',
    alignSelf: 'center',
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
  progressBtn: {
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    marginVertical: 15,
    alignItems: 'center',
  },
});
const light= {
  container: { backgroundColor: '#f7f7f7' },
  text: { color: '#000' },
  habitContainer: { backgroundColor: '#fff' },
  button: { backgroundColor: '#ff4d4d' },
  subTitle: { color: '#000' },
  content: { color: '#000' },
  progressBtn: { backgroundColor: '#4CAF50' },
  
};
const dark= {
  container: { backgroundColor: '#000' },
  text: { color: '#fff' },
  habitContainer: { backgroundColor: '#333' },
  button: { backgroundColor: '#ff4d4d' },
  subTitle: { color: '#fff' },
  content: { color: '#fff' },
  progressBtn: { backgroundColor: '#4CAF50' },

};
export { styles, light, dark };