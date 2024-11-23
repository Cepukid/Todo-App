import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../../../constants/colors';

interface SectionHeaderProps {
  title: string;
  stats: {
    total: number;
    completed: number;
    percentage: number;
  };
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({ title, stats }) => {
  return (
    <View style={styles.header}>
      <View>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>
          {stats.completed}/{stats.total} tasks completed ({stats.percentage}%)
        </Text>
      </View>
      <View style={[
        styles.progressBar,
        { width: `${stats.percentage}%`},
      ]} />
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    padding: 16,
    backgroundColor: colors.background,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
  },
  subtitle: {
    fontSize: 14,
    color: colors.secondary,
    marginTop: 4,
  },
  progressBar: {
    height: 2,
    backgroundColor: colors.primary,
    marginTop: 8,
  },
});
