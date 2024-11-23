import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { MMKV } from 'react-native-mmkv';
import { Task } from '../../types/task';
interface TaskState {
  tasks: Task[];
  loading: boolean;
  error: string | null;
}

const initialState: TaskState = {
  tasks: [],
  loading: false,
  error: null,
};

const taskSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    setTasks: (state, action: PayloadAction<Task[]>) => {
      state.tasks = action.payload;
    },
    addTask: (state, action: PayloadAction<Task>) => {
      state.tasks.push(action.payload);
      persistTasks(state.tasks);
    },
    updateTask: (state, action: PayloadAction<String>) => {
      const index = state.tasks.findIndex(task => task.id === action.payload);
      if (index !== -1) {
        state.tasks[index].isDone = true;
        persistTasks(state.tasks);
      }
    },
    doneTask: (state, action: PayloadAction<string>) => {
      const index = state.tasks.findIndex(task => task.id === action.payload);
      if (index !== -1) {
        state.tasks[index].isDone = !state.tasks[index].isDone;
        persistTasks(state.tasks);
      }
    },
    deleteTask: (state, action: PayloadAction<string>) => {
      state.tasks = state.tasks.filter(task => task.id !== action.payload);
      persistTasks(state.tasks);
    },
    moveTask: (state, action: PayloadAction<{ taskId: string; newDate: string }>) => {
      const task = state.tasks.find(t => t.id === action.payload.taskId);
      if (task) {
        task.date = action.payload.newDate;
        persistTasks(state.tasks);
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

const TASKS_STORAGE_ID = 'tasks';
const TASKS_STORAGE_KEY = '@todo_app_tasks';

export const storage = new MMKV({
  id: TASKS_STORAGE_ID,
  encryptionKey: TASKS_STORAGE_KEY,
});
export const persistTasks = async (tasks: Task[]) => {
  try {
    storage.set(TASKS_STORAGE_ID, JSON.stringify(tasks));
  } catch (error) {
    console.error('Error saving tasks:', error);
  }
};

export const loadTasks = async (): Promise<Task[]> => {
  try {
    const tasksJson = storage.getString(TASKS_STORAGE_ID);
    return tasksJson ? JSON.parse(tasksJson) : [];
  } catch (error) {
    console.error('Error loading tasks:', error);
    return [];
  }
};

export const { setTasks, addTask, updateTask, deleteTask, moveTask, setLoading, setError, doneTask } =
  taskSlice.actions;

export default taskSlice.reducer;
