import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { TranslocoService } from '@ngneat/transloco';
import { MatDialog } from '@angular/material/dialog';
import { take } from 'rxjs';
import { Router } from '@angular/router';
import { FormControl, Validators } from '@angular/forms';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

import {
  BoardService,
  GetAllColumnsByBoardIdInterface,
} from '../board/board.service';
import { SignInService } from '../sign-in-page/sign-in.service';
import { DialogComponent } from '../dialog/dialog.component';
import { ConfirmationComponent } from '../confirmation/confirmation.component';
import {
  ColumnService,
  GetAllTasksByColumnIdInterface,
} from './column.service';

@Component({
  selector: 'app-column',
  templateUrl: './column.component.html',
  styleUrls: ['./column.component.scss'],
  providers: [ColumnService],
})
export class ColumnComponent implements OnInit {
  @Input() column!: GetAllColumnsByBoardIdInterface;
  @Output() afterColumnDeletionOrEditing = new EventEmitter();
  messageToConfirmColumnDeletion = this.translocoService.translate(
    'confirmDeletionColumn'
  );
  token = '';
  message = '';
  tasks: Array<GetAllTasksByColumnIdInterface> = [];
  _subscription: any;
  showTitle = true;
  title: any;

  constructor(
    private translocoService: TranslocoService,
    private columnService: ColumnService,
    public signInService: SignInService,
    private boardService: BoardService,
    public confirmation: MatDialog,
    public dialog: MatDialog,
    private router: Router
  ) {
    this._subscription = columnService.tasksListChange.subscribe(
      (value) => (this.tasks = value)
    );
  }

  ngOnInit() {
    this.token = this.signInService.token;
    this.getAllTasksByColumnId();
  }

  getAllTasksByColumnId() {
    const { _id, boardId } = this.column;
    this.columnService
      .getAllTasksByColumnId(this.token, boardId, _id)
      .pipe(take(1))
      .subscribe({ next: () => (this.tasks = this.columnService.tasks) });
  }

  putInOrderTasksAfterDeletionTask($event: any) {
    const { _id, boardId } = this.column;
    this.columnService
      .getAllTasksByColumnId(this.token, boardId, _id)
      .pipe(take(1))
      .subscribe({
        next: () => {
          this.tasks = this.columnService.tasks;
          this.columnService.putInOrderTasksAfterDeletionTask(
            this.tasks,
            this.token,
            $event.order
          );
        },
      });
  }

  goToWelcomePage(): void {
    this.router.navigate(['']);
  }

  openDialog(): void {
    this.dialog.open(DialogComponent, {
      data: { message: this.message },
    });
  }

  onOpenConfirmationDeleteColumn(): void {
    const confirmationRef = this.confirmation.open(ConfirmationComponent, {
      data: {
        message: this.messageToConfirmColumnDeletion,
      },
    });

    confirmationRef.afterClosed().subscribe((result) => {
      if (result) {
        this.onDeleteColumn();
      }
    });
  }

  onDeleteColumn() {
    const { _id, boardId, order } = this.column;
    this.boardService
      .deleteColumnById(this.token, boardId, _id)
      .pipe(take(1))
      .subscribe({
        next: () => {
          this.afterColumnDeletionOrEditing.emit({
            event: event,
            order: order,
          });
          this.message = this.translocoService.translate(
            'columnDeletionMessage'
          );
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

  onEditTitle() {
    this.showTitle = false;
    this.title = new FormControl(this.column.title, Validators.required);
  }

  onSaveNewTitle() {
    this.showTitle = true;
    this.columnService
      .updateTaskTitle(
        this.token,
        this.column.boardId,
        this.column._id,
        this.title.value,
        this.column.order
      )
      .pipe(take(1))
      .subscribe({
        next: () => this.afterColumnDeletionOrEditing.emit(),
      });
  }

  onNoClick() {
    this.showTitle = true;
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.tasks, event.previousIndex, event.currentIndex);
    if (event.previousIndex !== event.currentIndex) {
      this.columnService.putInOrderTasksAfterDragNDrop(
        this.tasks,
        this.token,
        event.previousIndex,
        event.currentIndex
      );
    }
  }
}
