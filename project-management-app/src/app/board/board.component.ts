import { Component, OnInit } from '@angular/core';
import { TranslocoService } from '@ngneat/transloco';
import { take } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';

import { SignInService } from '../sign-in-page/sign-in.service';
import { BoardService, GetAllColumnsByBoardIdInterface } from './board.service';
import { DialogComponent } from '../dialog/dialog.component';
import { ConfirmationComponent } from '../confirmation/confirmation.component';
import { CreateColumnComponent } from '../create-column/create-column.component';
import { CreateColumnService } from '../create-column/create-column.service';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss'],
})
export class BoardComponent implements OnInit {
  token = '';
  columns: Array<GetAllColumnsByBoardIdInterface> = [];
  boardId = '';
  currentColumnId = '';
  message = '';
  messageToConfirmColumnDeletion = this.translocoService.translate(
    'confirmDeletionColumn'
  );
  title = '';
  order = 0;

  constructor(
    private translocoService: TranslocoService,
    public signInService: SignInService,
    private boardService: BoardService,
    private createColumnService: CreateColumnService,
    private route: ActivatedRoute,
    private router: Router,
    public dialog: MatDialog,
    public confirmation: MatDialog
  ) {}

  ngOnInit() {
    this.boardId = this.route.snapshot.params['id'];
    this.token = this.signInService.token;
    this.getAllColumnsByBorderId();
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

  onOpenConfirmationDeleteColumn(columnId: string): void {
    this.currentColumnId = columnId;
    const confirmationRef = this.confirmation.open(ConfirmationComponent, {
      data: {
        message: this.messageToConfirmColumnDeletion,
      },
    });

    confirmationRef.afterClosed().subscribe((result) => {
      if (result) {
        this.onDeleteColumn();
      } else {
        this.currentColumnId = '';
      }
    });
  }

  onDeleteColumn() {
    this.boardService
      .deleteColumnById(this.token, this.boardId, this.currentColumnId)
      .pipe(take(1))
      .subscribe({
        next: () => {
          this.currentColumnId = '';
          this.getAllColumnsByBorderId();
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
