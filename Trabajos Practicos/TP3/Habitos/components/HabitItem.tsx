import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

const HabitItem = ({ habit, onEdit, onDelete }) => {
  return (
    <View style={styles.habitContainer}>
      <Text style={styles.subTitle}>{habit.name}</Text>
      <Text style={styles.subTitle}>Importancia: {habit.importance}</Text>
      <View style={styles.actionButtons}>
        <TouchableOpacity onPress={() => onEdit(habit)}>
          <FontAwesome name="edit" size={24} color="blue" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => onDelete(habit.id)}>
          <FontAwesome name="trash" size={24} color="red" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  habitContainer: { marginBottom: 16, padding: 16, backgroundColor: '#fff', borderRadius: 8, elevation: 2 },
  subTitle: { fontSize: 18 },
  actionButtons: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },
});

export default HabitItem;