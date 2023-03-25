import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { TranslocoService } from '@ngneat/transloco';
import { MatDialog } from '@angular/material/dialog';
import { take } from 'rxjs';
import { Router } from '@angular/router';

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
})
export class ColumnComponent implements OnInit {
  @Input() column!: GetAllColumnsByBoardIdInterface;
  @Output() afterColumnDeletion = new EventEmitter();
  messageToConfirmColumnDeletion = this.translocoService.translate(
    'confirmDeletionColumn'
  );
  token = '';
  message = '';
  tasks: Array<GetAllTasksByColumnIdInterface> = [];

  constructor(
    private translocoService: TranslocoService,
    private columnService: ColumnService,
    public signInService: SignInService,
    private boardService: BoardService,
    public confirmation: MatDialog,
    public dialog: MatDialog,
    private router: Router
  ) {}

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
    const { _id, boardId } = this.column;
    this.boardService
      .deleteColumnById(this.token, boardId, _id)
      .pipe(take(1))
      .subscribe({
        next: () => {
          this.afterColumnDeletion.emit();
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
}
