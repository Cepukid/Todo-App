import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../../../constants/colors';

export const EmptyState: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>No Tasks Yet</Text>
      <Text style={styles.description}>
        Tap the + button to add your first task
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    color: colors.secondary,
    textAlign: 'center',
  },
});
