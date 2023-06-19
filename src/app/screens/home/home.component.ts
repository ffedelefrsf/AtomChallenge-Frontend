import { Component, OnDestroy, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

import { CreateOrEditTaskComponent } from './components/create-or-edit-task/create-or-edit-task.component';
import { HomeTabs } from 'src/app/screens/home/model/home-tabs.enum';
import { TaskDTO } from './model/task.dto';
import { TaskStatus } from './model/task-status.enum';
import { ResolverResponseDTO } from './model/resolver-response.dto';
import { TaskService } from './services/task.service';
import { showErrorSnackbar, showSnackbar } from 'src/app/utils/showSnackbar';

type HomeTab = { tabName: HomeTabs; set: TaskDTO[] };

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  host: {
    class: 'home-container',
  },
})
export class HomeComponent implements OnDestroy {
  private readonly dialog: MatDialog = inject(MatDialog);
  private readonly activatedRoute: ActivatedRoute = inject(ActivatedRoute);
  private readonly taskService: TaskService = inject(TaskService);
  private readonly resolverDataSubscription: Subscription;
  private readonly snackBar: MatSnackBar = inject(MatSnackBar);

  private pendingTasks: TaskDTO[] = [];
  private completedTasks: TaskDTO[] = [];

  loading: boolean = false;

  constructor() {
    this.resolverDataSubscription = this.activatedRoute.data.subscribe(
      (response) => {
        const {
          tasksResponse: { data: tasks },
        } = response as ResolverResponseDTO;
        if (tasks) {
          tasks.forEach((task) => {
            if (task.status == TaskStatus.PENDING) {
              this.pendingTasks.push(task);
            } else {
              this.completedTasks.push(task);
            }
          });
        }
      }
    );
  }

  ngOnDestroy(): void {
    this.resolverDataSubscription.unsubscribe();
  }

  tabs: HomeTab[] = [
    {
      tabName: HomeTabs.PENDING,
      set: this.pendingTasks,
    },
    {
      tabName: HomeTabs.COMPLETED,
      set: this.completedTasks,
    },
  ];

  private selectedTab: HomeTab = this.tabs[0];

  tabChanged(tabChangeEvent: MatTabChangeEvent) {
    this.selectedTab = this.tabs[tabChangeEvent.index];
  }

  add() {
    const dialogRef = this.dialog.open(CreateOrEditTaskComponent, {
      width: '40vw',
    });

    dialogRef.afterClosed().subscribe({
      next: (result: TaskDTO | undefined) => {
        if (result) {
          const tabToUse = this.tabs.find(
            (tab) => (tab.tabName as string) === result.status
          );
          showSnackbar(this.snackBar, 'Saved successfully.');
          tabToUse?.set.push(result);
        }
      },
      error: (_error) => {
        showErrorSnackbar(this.snackBar);
      },
    });
  }

  toggleTask(task: TaskDTO) {
    // CHANGE VALUE
    this.loading = true;
    const isCompleted = task.status === TaskStatus.COMPLETED;
    let resultingStatus;
    if (isCompleted) {
      resultingStatus = TaskStatus.PENDING;
    } else {
      resultingStatus = TaskStatus.COMPLETED;
    }
    const newEntity = { ...task, status: resultingStatus };
    this.taskService.edit(task.id as string, newEntity).subscribe({
      next: (response) => {
        const { data: newTask } = response;
        task = newTask as TaskDTO;
        this.changeTaskTab(task);
        showSnackbar(this.snackBar, 'Changed successfully.');
        this.loading = false;
      },
      error: (error) => {
        showErrorSnackbar(this.snackBar, error?.error?.extraMessage);
        this.loading = false;
      },
    });
  }

  private changeTaskTab = (task: TaskDTO) => {
    if (task.status === TaskStatus.PENDING) {
      this.tabs[0].set = [...this.tabs[0].set, task];
      this.tabs[1].set = this.tabs[1].set.filter(
        (_task) => _task.id !== task.id
      );
    } else {
      this.tabs[1].set = [...this.tabs[1].set, task];
      this.tabs[0].set = this.tabs[0].set.filter(
        (_task) => _task.id !== task.id
      );
    }
  };

  editTask(task: TaskDTO) {
    const dialogRef = this.dialog.open(CreateOrEditTaskComponent, {
      data: task,
      width: '40vw',
    });

    dialogRef.afterClosed().subscribe({
      next: (result: TaskDTO | undefined) => {
        if (result) {
          if (task.status !== result.status) {
            this.changeTaskTab(result);
          }
          showSnackbar(this.snackBar, 'Saved successfully.');
          const index = this.selectedTab.set.findIndex(
            (_task) => task.id === _task.id
          );
          this.selectedTab.set.splice(index, 1, { ...result });
        }
      },
      error: (_error) => {
        showErrorSnackbar(this.snackBar);
      },
    });
  }

  deleteTask(task: TaskDTO) {
    this.loading = true;
    this.taskService.delete(task.id as string).subscribe({
      next: (_response) => {
        showSnackbar(this.snackBar, 'Deleted successfully.');
        this.selectedTab.set = this.selectedTab.set.filter(
          (_task) => _task.id !== task.id
        );
        this.loading = false;
      },
      error: (error) => {
        showErrorSnackbar(this.snackBar, error?.error?.extraMessage);
        this.loading = false;
      },
    });
  }
}
