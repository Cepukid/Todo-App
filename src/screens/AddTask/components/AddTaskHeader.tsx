import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Header } from '../../../components/common/Header';

export const AddTaskHeader = () => {
  return (
    <View style={styles.container}>
      <Header
        title="Add New Task"
        showBackButton
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
  },
});
