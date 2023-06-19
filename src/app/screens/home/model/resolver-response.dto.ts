import { CommonResponseDTO } from 'src/app/model/common-response.dto';
import { TaskDTO } from './task.dto';

export interface ResolverResponseDTO {
  tasksResponse: CommonResponseDTO<TaskDTO[]>;
}
