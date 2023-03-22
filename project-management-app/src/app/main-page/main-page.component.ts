import { Component, OnInit } from '@angular/core';
import { take } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { TranslocoService } from '@ngneat/transloco';
import { Router } from '@angular/router';

import { SignInService } from '../sign-in-page/sign-in.service';
import { BoardsService, GetAllBoardsInterface } from './boards.service';
import { DialogComponent } from '../dialog/dialog.component';
import { ConfirmationComponent } from '../confirmation/confirmation.component';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss'],
})
export class MainPageComponent implements OnInit {
  token = '';
  boards: Array<GetAllBoardsInterface> = [];
  messageToConfirm = this.translocoService.translate('confirmDeletionBoard');
  currentBoardId = '';
  message = '';

  constructor(
    public signInService: SignInService,
    private boardsService: BoardsService,
    public confirmation: MatDialog,
    private translocoService: TranslocoService,
    private router: Router,
    public dialog: MatDialog
  ) {}

  ngOnInit() {
    this.token = this.signInService.token;
    this.getAllBoards();
  }

  goToWelcomePage(): void {
    this.router.navigate(['']);
  }

  openDialog(): void {
    this.dialog.open(DialogComponent, {
      data: { message: this.message },
    });
  }

  getAllBoards() {
    this.boardsService
      .getAllBoards(this.token)
      .pipe(take(1))
      .subscribe({ next: (boards) => (this.boards = boards) });
  }

  onOpenConfirmation(boardId: string): void {
    event?.stopPropagation();
    this.currentBoardId = boardId;
    const confirmationRef = this.confirmation.open(ConfirmationComponent, {
      data: {
        message: this.messageToConfirm,
      },
    });

    confirmationRef.afterClosed().subscribe((result) => {
      if (result) {
        this.onDeleteBoard();
      } else {
        this.currentBoardId = '';
      }
    });
  }

  onDeleteBoard() {
    this.boardsService
      .deleteBoard(this.token, this.currentBoardId)
      .pipe(take(1))
      .subscribe({
        next: () => {
          this.currentBoardId = '';
          this.getAllBoards();
          this.message = this.translocoService.translate(
            'boardDeletionMessage'
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

  redirect(id: string) {
    this.router.navigate(['board', id]);
  }
}
