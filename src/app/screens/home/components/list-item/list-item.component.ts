import {
  AfterViewChecked,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  Output,
  inject,
} from '@angular/core';

import { TaskDTO } from '../../model/task.dto';
import { TaskStatus } from '../../model/task-status.enum';

@Component({
  selector: 'app-list-item',
  templateUrl: './list-item.component.html',
  styleUrls: ['./list-item.component.scss'],
})
export class ListItemComponent implements AfterViewChecked {
  @Input('task') task: TaskDTO;
  @Output() delete: EventEmitter<TaskDTO> = new EventEmitter();
  @Output() edit: EventEmitter<TaskDTO> = new EventEmitter();
  @Output() toggle: EventEmitter<TaskDTO> = new EventEmitter();

  private readonly changeDetectorRef: ChangeDetectorRef =
    inject(ChangeDetectorRef);

  isCompleted: boolean;

  ngAfterViewChecked(): void {
    this.isCompleted = this.task.status === TaskStatus.COMPLETED;
    this.changeDetectorRef.detectChanges();
  }
}
