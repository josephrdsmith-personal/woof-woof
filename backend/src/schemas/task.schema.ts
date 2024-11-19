import * as yup from 'yup';
import { TaskStatus } from '../types/task';

export const TaskSchema = yup.object({
  title: yup.string()
    .required('Title is required')
    .min(1, 'Title cannot be empty')
    .max(100, 'Title must be less than 100 characters'),
  
  description: yup.string()
    .optional(),
  
  userId: yup.string()
    .required('User ID is required'),
  
  status: yup.string()
    .oneOf(Object.values(TaskStatus), 'Invalid status')
    .default(TaskStatus.TODO),
  
  dueDate: yup.date()
    .optional()
    .min(new Date(), 'Due date cannot be in the past')
}); 