import { format, parseISO, isToday, isYesterday, isTomorrow } from 'date-fns';
import { Task, TaskSection } from '../types/task';
export const formatSectionDate = (date: string): string => {
  const parsedDate = parseISO(date);

  if (isToday(parsedDate)) {
    return 'Today';
  }
  if (isYesterday(parsedDate)) {
    return 'Yesterday';
  }
  if (isTomorrow(parsedDate)) {
    return 'Tomorrow';
  }

  return format(parsedDate, 'dd MMMM yyyy');
};
export const groupTasksByDate = (tasks: Task[]): TaskSection[] => {
  const sortedTasks = [...tasks].sort((a, b) => {
    return parseISO(a.date).getTime() - parseISO(b.date).getTime();
  });
  const groupedTasks = sortedTasks.reduce<{ [key: string]: Task[] }>((acc, task) => {
    const dateStr = task.date.split('T')[0];
    if (!acc[dateStr]) {
      acc[dateStr] = [];
    }
    acc[dateStr].push(task);
    return acc;
  }, {});
  const sections = Object.entries(groupedTasks).map(([date, data]) => ({
    title: formatSectionDate(date),
    date,
    data: data.sort((a, b) => {
      if (a.isDone !== b.isDone) {
        return a.isDone ? 1 : -1;
      }
      if (a.time && b.time) {
        return a.time.localeCompare(b.time);
      }
      return 0;
    }),
  }));

  return sections;
};
export const calculateSectionStats = (tasks: Task[]) => {
  const total = tasks.length;
  const completed = tasks.filter(task => task.isDone).length;
  const percentage = total ? Math.round((completed / total) * 100) : 0;

  return {
    total,
    completed,
    percentage,
  };
};
