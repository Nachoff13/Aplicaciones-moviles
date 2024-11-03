import React from 'react';
import { FlatList } from 'react-native';
import HabitItem from './HabitItem';

const HabitList = ({ habits, onEdit, onDelete }) => {
  return (
    <FlatList
      data={habits}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
        <HabitItem habit={item} onEdit={onEdit} onDelete={onDelete} />
      )}
    />
  );
};

export default HabitList;