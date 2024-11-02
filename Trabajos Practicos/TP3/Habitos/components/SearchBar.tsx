import React from 'react';
import { TextInput, StyleSheet } from 'react-native';

const SearchBar = ({ searchText, onSearch }) => {
  return (
    <TextInput
      style={styles.searchInput}
      placeholder="Buscar hábito"
      value={searchText}
      onChangeText={onSearch}
    />
  );
};

const styles = StyleSheet.create({
  searchInput: { padding: 10, borderRadius: 5, borderColor: '#ddd', borderWidth: 1, marginBottom: 10, width: '90%', alignSelf: 'center' },
});

export default SearchBar;