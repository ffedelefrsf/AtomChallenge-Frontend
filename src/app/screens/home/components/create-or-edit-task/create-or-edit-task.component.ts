import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { take } from 'rxjs';

import { TaskDTO } from '../../model/task.dto';
import { TaskStatus } from '../../model/task-status.enum';
import { TaskService } from '../../services/task.service';
import { showErrorSnackbar } from 'src/app/utils/showSnackbar';

@Component({
  imports: [
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    CommonModule,
  ],
  providers: [TaskService],
  standalone: true,
  selector: 'app-create-or-edit-task',
  templateUrl: './create-or-edit-task.component.html',
  styleUrls: ['./create-or-edit-task.component.scss'],
})
export class CreateOrEditTaskComponent {
  private readonly formBuilder: FormBuilder = inject(FormBuilder);
  private readonly dialogRef: MatDialogRef<CreateOrEditTaskComponent> = inject(
    MatDialogRef<CreateOrEditTaskComponent>
  );
  private readonly data: TaskDTO = inject(MAT_DIALOG_DATA);
  private readonly taskService: TaskService = inject(TaskService);
  private readonly snackBar: MatSnackBar = inject(MatSnackBar);

  form: FormGroup;

  loading: boolean = false;

  title: string = 'Create';

  constructor() {
    if (this.data?.id) {
      this.title = 'Edit';
    }
    const defaultValues = {
      id: this.data?.id || '',
      title: this.data?.title || '',
      description: this.data?.description || '',
      completed: this.data?.status === TaskStatus.COMPLETED,
    };
    const { id, title, description, completed } = defaultValues;
    this.form = this.formBuilder.group({
      id: this.formBuilder.control({ value: id, disabled: true }),
      title: this.formBuilder.control(title, [
        Validators.required,
        Validators.maxLength(100),
      ]),
      description: this.formBuilder.control(description, [
        Validators.maxLength(100),
      ]),
      completed: this.formBuilder.control(completed),
    });
  }

  get controls() {
    return this.form.controls;
  }

  onSubmit() {
    if (this.form.valid) {
      this.loading = true;
      this.dialogRef.disableClose = true;
      const {
        id: { value: id },
        title: { value: title },
        description: { value: description },
        completed: { value: completed },
      } = this.controls;
      const newTaskObject: TaskDTO = {
        id,
        title,
        description,
        status: completed ? TaskStatus.COMPLETED : TaskStatus.PENDING,
      };
      let observableToRun;
      if (id) {
        // EDIT
        observableToRun = this.taskService.edit(id, newTaskObject);
      } else {
        // CREATE
        delete newTaskObject.id;
        observableToRun = this.taskService.create(newTaskObject);
      }
      observableToRun.pipe(take(1)).subscribe({
        next: (response) => {
          const { data: newTask } = response;
          this.loading = false;
          this.dialogRef.disableClose = false;
          this.dialogRef.close(newTask);
        },
        error: (error) => {
          this.loading = false;
          this.dialogRef.disableClose = false;
          showErrorSnackbar(this.snackBar, error?.error?.extraMessage);
        },
      });
    }
  }

  dismiss(): void {
    this.dialogRef.close();
  }
}
