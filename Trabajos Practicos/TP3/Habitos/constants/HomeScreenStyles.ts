import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  light: {
    container: { backgroundColor: '#fff' },
    text: { color: '#000' },
    card: { backgroundColor: '#f0f0f0' },
  },
  dark: {
    container: { backgroundColor: '#000' },
    text: { color: '#fff' },
    card: { backgroundColor: '#333' },
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
});

export default styles;