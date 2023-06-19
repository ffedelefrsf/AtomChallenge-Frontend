import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from 'src/environments/environment';
import { CommonResponseDTO } from 'src/app/model/common-response.dto';
import { TaskDTO } from '../model/task.dto';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private readonly http: HttpClient = inject(HttpClient);

  private readonly prefix = 'tasks';

  getAll(): Observable<CommonResponseDTO<TaskDTO[]>> {
    return this.http.get<CommonResponseDTO<TaskDTO[]>>(
      `${environment.apiUrl}/${this.prefix}`
    );
  }

  create(newTask: TaskDTO): Observable<CommonResponseDTO<TaskDTO>> {
    return this.http.post<CommonResponseDTO<TaskDTO>>(
      `${environment.apiUrl}/${this.prefix}`,
      newTask
    );
  }

  edit(
    taskId: string,
    newTask: TaskDTO
  ): Observable<CommonResponseDTO<TaskDTO>> {
    return this.http.put<CommonResponseDTO<TaskDTO>>(
      `${environment.apiUrl}/${this.prefix}/${taskId}`,
      newTask
    );
  }

  delete(taskId: string): Observable<CommonResponseDTO<TaskDTO>> {
    return this.http.delete<CommonResponseDTO<TaskDTO>>(
      `${environment.apiUrl}/${this.prefix}/${taskId}`
    );
  }
}
