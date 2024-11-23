import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Header } from '../../../components/common/Header';
import { useNavigation } from '@react-navigation/native';

export const TaskListHeader = () => {
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <Header
        title="My Tasks"
        showAddButton
        onAddPress={() => navigation.navigate('AddTaskScreen')}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
  },
});
