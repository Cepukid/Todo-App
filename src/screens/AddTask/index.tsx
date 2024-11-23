import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Animated,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useDispatch } from 'react-redux';
import { addTask } from '../../store/slices/taskSlice';
import uuid from 'react-native-uuid';
import { useNavigation } from '@react-navigation/native';
import { AddTaskHeader } from './components/AddTaskHeader';
import { CustomDateTimePicker } from '../../components/common/DateTimePicker';
import { format } from 'date-fns';

const AddTaskScreen: React.FC = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState<Date | null>(null);
  const [time, setTime] = useState<Date | null>(null);
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const highlightToday = (text: string) => {
    if (text.toLowerCase().includes('today')) {
      setDate(new Date());
      return text.replace(/today/i, (match) => `<highlight>${match}</highlight>`);
    }
    return text;
  };

  const handleTitleChange = (text: string) => {
    setTitle(text);
    highlightToday(text);
  };

  const handleSave = useCallback(() => {
    if (!title.trim() || !description.trim() || !date) {
      Alert.alert('Error', 'Please fill all required fields');
      return;
    }
    dispatch(addTask({
      id: uuid.v4(),
      title,
      description,
      date: date.toISOString(),
      time: time ? format(time, 'HH:mm') : undefined,
      isDone: false,
    }));
    Animated.sequence([
      Animated.timing(new Animated.Value(0), {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      navigation.goBack();
    });
  }, [title, description, date, dispatch, time, navigation]);
  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <AddTaskHeader />
      <ScrollView style={styles.container}>
        <View style={styles.form}>
          <Text style={styles.label}>Title *</Text>
          <TextInput
            style={styles.input}
            value={title}
            onChangeText={handleTitleChange}
            placeholder="Enter task title"
          />

          <Text style={styles.label}>Description *</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={description}
            onChangeText={setDescription}
            placeholder="Enter task description"
            multiline
            numberOfLines={4}
          />
          <CustomDateTimePicker
            label="Due Date"
            value={date}
            onChange={setDate}
            mode="date"
            minimumDate={new Date()}
            required
          />
          <CustomDateTimePicker
            label="Time"
            value={time}
            onChange={setTime}
            mode="time"
          />

          <TouchableOpacity
            style={styles.saveButton}
            onPress={handleSave}
          >
            <Text style={styles.saveButtonText}>Save Task</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
   container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    padding: 16,
  },
  form: {
    padding: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    padding: 10,
    fontSize: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  dateButton: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    padding: 10,
    marginBottom: 10,
  },
  saveButton: {
    backgroundColor: '#6200ee',
    padding: 15,
    borderRadius: 4,
    marginTop: 20,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default AddTaskScreen;
