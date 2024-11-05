import { StyleSheet } from 'react-native';

const lightStyles = StyleSheet.create({
  habitContainer: {
    marginBottom: 16,
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    elevation: 2,
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'baseline',
  },
  subTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  content: {
    fontSize: 16,
    marginLeft: 0,
    color: '#000',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 13,
  },
});

const darkStyles = StyleSheet.create({
  habitContainer: {
    marginBottom: 16,
    padding: 16,
    backgroundColor: '#1F1F1F',
    borderRadius: 8,
    elevation: 2,
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'baseline',
  },
  subTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#E0E0E0',
  },
  content: {
    fontSize: 16,
    marginLeft: 0,
    color: '#E0E0E0',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 13,
  },
});

export { lightStyles, darkStyles };