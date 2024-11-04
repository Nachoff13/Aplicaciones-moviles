import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

const HabitItem = ({ habit, onEdit, onDelete }) => {
  return (
    <View style={styles.habitContainer}>
      <View style={styles.row}>
        <Text style={styles.subTitle}>Nombre: </Text>
        <Text style={styles.content}>{habit.name}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.subTitle}>Importancia: </Text>
        <Text style={styles.content}>{habit.importance}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.subTitle}>Descripción: </Text>
        <Text style={styles.content}>{habit.description}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.subTitle}>Días: </Text>
        <Text style={styles.content}>{habit.days}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.subTitle}>Horario de Inicio: </Text>
        <Text style={styles.content}>{habit.start_time}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.subTitle}>Horario de Fin: </Text>
        <Text style={styles.content}>{habit.end_time}</Text>
      </View>
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
  row: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'baseline' },
  subTitle: { fontSize: 18, fontWeight: 'bold' },
  content: { fontSize: 16, marginLeft: 0 },
  actionButtons: { flexDirection: 'row', justifyContent: 'space-around', marginTop: 13 },
});

export default HabitItem;