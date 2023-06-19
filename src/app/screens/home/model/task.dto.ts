import { TaskStatus } from './task-status.enum';

export interface TaskDTO {
  id?: string;
  title: string;
  description?: string;
  status?: TaskStatus;
}
