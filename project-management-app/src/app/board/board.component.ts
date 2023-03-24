import { Component, OnInit } from '@angular/core';
import { TranslocoService } from '@ngneat/transloco';
import { take } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';

import { SignInService } from '../sign-in-page/sign-in.service';
import { BoardService, GetAllColumnsByBoardIdInterface } from './board.service';
import { DialogComponent } from '../dialog/dialog.component';
import { CreateColumnComponent } from '../create-column/create-column.component';
import { CreateTaskComponent } from '../create-task/create-task.component';
import { CreateColumnService } from '../create-column/create-column.service';
import { CreateTaskService } from '../create-task/create-task.service';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss'],
})
export class BoardComponent implements OnInit {
  token = '';
  columns: Array<GetAllColumnsByBoardIdInterface> = [];
  boardId = '';
  message = '';
  title = '';
  order = 0;
  _subscription: any;
  description = '';
  taskTitle = '';
  taskOrder = 0;
  attachedToTaskUsers: Array<string> = [];
  columnId = '';
  userId = '';

  constructor(
    private translocoService: TranslocoService,
    public signInService: SignInService,
    private boardService: BoardService,
    private createColumnService: CreateColumnService,
    private createTaskService: CreateTaskService,
    private route: ActivatedRoute,
    private router: Router,
    public dialog: MatDialog,
    public confirmation: MatDialog
  ) {
    this._subscription = boardService.columnsListChange.subscribe(
      (value) => (this.columns = value)
    );
  }

  ngOnInit() {
    this.boardId = this.route.snapshot.params['id'];
    this.token = this.signInService.token;
    this.getAllColumnsByBorderId();
    this.userId = this.signInService._id;
  }

  getAllColumnsByBorderId() {
    this.boardService
      .getAllColumnsByBoardId(this.token, this.boardId)
      .pipe(take(1))
      .subscribe({ next: () => (this.columns = this.boardService.columns) });
  }

  goToWelcomePage(): void {
    this.router.navigate(['']);
  }

  openDialog(): void {
    this.dialog.open(DialogComponent, {
      data: { message: this.message },
    });
  }

  onOpenCreateColumnModal(): void {
    this.title = '';
    const createColumnRef = this.dialog.open(CreateColumnComponent, {
      data: { title: this.title },
    });

    createColumnRef.afterClosed().subscribe((result) => {
      if (result) {
        this.title = result;
        this.order = this.boardService.columns.length;
        this.createColumnService
          .createColumn(this.token, this.boardId, this.title, this.order)
          .pipe(take(1))
          .subscribe({
            next: () => {
              this.message = this.translocoService.translate(
                'columnCreatedMessage'
              );
              this.openDialog();
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

  onOpenCreateTaskModal(): void {
    this.title = '';
    const createTaskRef = this.dialog.open(CreateTaskComponent, {
      data: { title: this.title },
    });

    createTaskRef.afterClosed().subscribe((result) => {
      if (result) {
        console.log(result);
        this.taskTitle = result.title;
        this.columnId = '6419da83a29eef133574a54f';
        this.taskOrder = 0;
        this.description = 'task description';
        this.attachedToTaskUsers = ['640e5c2c463bef5098f72be2'];
        this.createTaskService
          .createTask(
            this.token,
            this.boardId,
            this.columnId,
            this.taskTitle,
            this.taskOrder,
            this.description,
            this.userId,
            this.attachedToTaskUsers
          )
          .pipe(take(1))
          .subscribe({
            next: () => {
              this.message = this.translocoService.translate(
                'columnCreatedMessage'
              );
              this.openDialog();
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
}
