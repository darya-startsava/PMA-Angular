import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { TranslocoService } from '@ngneat/transloco';
import { MatDialog } from '@angular/material/dialog';
import { take } from 'rxjs';
import { Router } from '@angular/router';

import {
  SignInService,
  UserLoginIdInterface,
} from '../sign-in-page/sign-in.service';
import {
  ColumnService,
  GetAllTasksByColumnIdInterface,
} from '../column/column.service';
import {
  BoardService,
  GetAllColumnsByBoardIdInterface,
} from '../board/board.service';
import { EditTaskService } from '../edit-task/edit-task.service';
import { DialogComponent } from '../dialog/dialog.component';
import { ConfirmationComponent } from '../confirmation/confirmation.component';
import { EditTaskComponent } from '../edit-task/edit-task.component';

interface ColumnsIdTitle {
  columnId: string;
  title: string;
}

export interface EditTaskDataInterface {
  title?: string;
  description?: string;
  selectedColumnId?: string;
  columns?: Array<ColumnsIdTitle>;
  userId?: string;
  users?: Array<UserLoginIdInterface>;
  selectedUsers?: Array<string>;
}

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.scss'],
})
export class TaskComponent implements OnInit {
  @Input() task!: GetAllTasksByColumnIdInterface;
  @Output() afterTaskDeletion = new EventEmitter();
  token = '';
  message = '';
  messageToConfirmTaskDeletion = this.translocoService.translate(
    'confirmDeletionTask'
  );
  users: Array<UserLoginIdInterface> = [];
  userLoginsInString = '';
  dataToEditTask: EditTaskDataInterface = {};
  columns: Array<GetAllColumnsByBoardIdInterface> = [];

  constructor(
    private translocoService: TranslocoService,
    public signInService: SignInService,
    private columnService: ColumnService,
    private boardService: BoardService,
    private editTaskService: EditTaskService,
    public confirmation: MatDialog,
    public dialog: MatDialog,
    private router: Router
  ) {}

  ngOnInit() {
    this.token = this.signInService.token;
    this.users = this.signInService.users;
    this.userLoginsInString = this.users
      .filter((item) => this.task.users.find((i) => i === item.userId))
      .map((i) => i.login)
      .join(', ');
    this.columns = this.boardService.columns;
  }

  goToWelcomePage(): void {
    this.router.navigate(['']);
  }

  openDialog(): void {
    this.dialog.open(DialogComponent, {
      data: { message: this.message },
    });
  }

  onOpenConfirmationDeleteTask(): void {
    event?.stopPropagation();
    const confirmationRef = this.confirmation.open(ConfirmationComponent, {
      data: {
        message: this.messageToConfirmTaskDeletion,
      },
    });

    confirmationRef.afterClosed().subscribe((result) => {
      if (result) {
        this.onDeleteTask();
      }
    });
  }

  onDeleteTask() {
    const { _id, columnId, boardId, order } = this.task;
    this.columnService
      .deleteTaskById(this.token, boardId, columnId, _id)
      .pipe(take(1))
      .subscribe({
        next: () => {
          this.afterTaskDeletion.emit({
            event: event,
            order: order,
          });
          this.message = this.translocoService.translate('taskDeletionMessage');
          this.openDialog();
        },
        error: (error) => {
          switch (error.status) {
            case 403:
              this.signInService.signOut();
              this.goToWelcomePage();
              break;
            default:
              this.message =
                this.translocoService.translate('commonErrorMessage');
              this.openDialog();
          }
        },
      });
  }

  onOpenEditTaskModal(): void {
    this.dataToEditTask.title = this.task.title;
    this.dataToEditTask.description = this.task.description;
    this.dataToEditTask.selectedColumnId = this.task.columnId;
    this.dataToEditTask.columns = this.columns.map((column) => {
      return { columnId: column._id, title: column.title };
    });
    const editTaskRef = this.dialog.open(EditTaskComponent, {
      data: {
        title: this.dataToEditTask.title,
        description: this.dataToEditTask.description,
        selectedColumnId: this.dataToEditTask.selectedColumnId,
        columns: this.dataToEditTask.columns,
        users: this.users,
        selectedUsers: this.task.users,
      },
    });

    editTaskRef.afterClosed().subscribe((result) => {
      if (result) {
        const taskTitle = result.title;
        const columnId = result.column;
        const description = result.description;
        const attachedToTaskUsers = result.users;
        this.editTaskService
          .editTask(
            this.token,
            this.task.boardId,
            columnId,
            this.task._id,
            taskTitle,
            this.task.order,
            description,
            this.task.userId,
            attachedToTaskUsers
          )
          .pipe(take(1))
          .subscribe({
            next: () => {
              this.message =
                this.translocoService.translate('taskEditedMessage');
              this.openDialog();
              // check if needs to be changed
              this.getAllColumnsByBorderId();
            },
            error: (error) => {
              switch (error.status) {
                case 403:
                  this.signInService.signOut();
                  this.goToWelcomePage();
                  break;
                default:
                  this.message =
                    this.translocoService.translate('commonErrorMessage');
                  this.openDialog();
              }
            },
          });
      }
    });
  }

  getAllColumnsByBorderId() {
    this.boardService
      .getAllColumnsByBoardId(this.token, this.task.boardId)
      .pipe(take(1))
      .subscribe({
        next: () => (this.columns = this.boardService.columns),
        error: (error) => {
          switch (error.status) {
            case 403:
              this.signInService.signOut();
              this.goToWelcomePage();
              break;
          }
        },
      });
  }
}
