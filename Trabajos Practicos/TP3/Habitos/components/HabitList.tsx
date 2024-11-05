import { FlatList } from 'react-native';
import HabitItem from './HabitItem';



const HabitList = ({isDarkMode, habits, onEdit, onDelete }) => {
  return (
    <FlatList
      data={habits}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
        <HabitItem isDarkMode={isDarkMode} habit={item} onEdit={onEdit} onDelete={onDelete} />
      )}
    />
  );
};

export default HabitList;