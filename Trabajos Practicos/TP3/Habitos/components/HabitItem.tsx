import { View, Text, TouchableOpacity } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { lightStyles, darkStyles } from '../constants/HabitItemStyles';

const HabitItem = ({ isDarkMode, habit, onEdit, onDelete }) => {
  const styles = isDarkMode ? darkStyles : lightStyles;

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

export default HabitItem;