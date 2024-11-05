import React from 'react';
import { TextInput, StyleSheet, TextInputProps } from 'react-native';

interface SearchBarProps extends TextInputProps {
  searchText: string;
  onSearch: (text: string) => void;
  inputStyle: object;
  placeholderTextColor: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ searchText, onSearch, inputStyle, placeholderTextColor }) => {
  return (
    <TextInput
      style={[styles.searchInput, inputStyle]}
      placeholder="Buscar hábito"
      value={searchText}
      onChangeText={onSearch}
      placeholderTextColor={placeholderTextColor}
    />
  );
};

const styles = StyleSheet.create({
  searchInput: { 
    padding: 10, 
    borderRadius: 5, 
    borderWidth: 1, 
    marginBottom: 10, 
    width: '90%', 
    alignSelf: 'center' 
  },
});

export default SearchBar;