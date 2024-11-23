export interface Task {
  id: string;
  title: string;
  description: string;
  date: string;
  time?: string;
  isDone: boolean;
}

export interface TaskSection {
  title: string;
  data: Task[];
}
