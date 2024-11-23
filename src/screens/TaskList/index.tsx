import React, { useCallback, useEffect, useMemo } from 'react';
import {
  View,
  StyleSheet,
  SectionList,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import { doneTask, loadTasks, setTasks } from '../../store/slices/taskSlice';
import { calculateSectionStats, groupTasksByDate } from '../../utils/taskUtils';
import { SectionHeader } from './components/SectionHeader';
import TaskItem from './components/TaskItem';
import { EmptyState } from './components/EmptyState';
import { TaskListHeader } from './components/TaskListHeader';

const TaskListScreen: React.FC = () => {
  const dispatch = useDispatch();
  const { tasks } = useSelector((state: RootState) => state.tasks);
  useEffect(() => {
    const loadSavedTasks = async () => {
      const savedTasks = await loadTasks();
      dispatch(setTasks(savedTasks));
    };
    loadSavedTasks();
  }, [dispatch]);
  const renderSectionHeader = useCallback(({ section }) => {
    const stats = calculateSectionStats(section.data);
    return (
      <SectionHeader
        title={section.title}
        stats={stats}
      />
    );
  }, []);

  const handleDone = useCallback((id: string) => {
    dispatch(doneTask(id));
  }, [dispatch]);
  const renderItem = useCallback(({ item }) => {

    return (
      <TaskItem
        task={item}
        onToggle={()=> handleDone(item.id)}
      />
    );
  }, [handleDone]);

  const keyExtractor = useCallback((item) => item.id, []);
  const sections = useMemo(() => {
    return groupTasksByDate(tasks);
  }, [tasks]);
  return (
    <View style={styles.container}>
      <TaskListHeader />
      <SectionList
        contentContainerStyle={styles.listContent}
        sections={sections}
        renderItem={renderItem}
        renderSectionHeader={renderSectionHeader}
        stickySectionHeadersEnabled={true}
        keyExtractor={keyExtractor}
        ListEmptyComponent={<EmptyState/>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  listContent: {
    paddingTop: 8,
  },
  sectionHeader: {
    backgroundColor: '#f8f8f8',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  taskItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  taskContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  taskTitle: {
    fontSize: 16,
  },
  taskDone: {
    textDecorationLine: 'line-through',
    color: '#888',
  },
  taskTime: {
    color: '#666',
    fontSize: 14,
  },
  addButton: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#6200ee',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
  },
});

export default TaskListScreen;
