export interface TaskDetails {
  name: string;
  user: string;
  description: string;
  priority: string;
}

export interface UpdateTaskDetails extends Omit<TaskDetails, 'user'> {}
