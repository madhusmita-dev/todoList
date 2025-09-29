export type Task = {
  id: number;
  title: string;
  description: string;
  date: string;
  status: 'In Progress' | 'Pending' | 'Completed';
};