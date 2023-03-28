import { Component } from '@angular/core';
import { TranslocoService } from '@ngneat/transloco';
import { take } from 'rxjs';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';

import { SignInService } from '../sign-in-page/sign-in.service';
import { CreateBoardService } from '../create-board/create-board.service';
import { CreateBoardComponent } from '../create-board/create-board.component';
import { DialogComponent } from '../dialog/dialog.component';
import { BoardsService } from '../main-page/boards.service';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  _subscription: any;
  token = '';
  title = '';
  userId = '';
  message = '';

  constructor(
    private translocoService: TranslocoService,
    public signInService: SignInService,
    private createBoardService: CreateBoardService,
    private boardsService: BoardsService,
    private router: Router,
    public dialog: MatDialog
  ) {
    this._subscription = signInService.tokenChange.subscribe(
      (value) => (this.token = value)
    );
  }

  change(lang: string) {
    this.translocoService.setActiveLang(lang);
  }

  goToWelcomePage() {
    this.router.navigate(['']);
  }

  openDialog(): void {
    this.dialog.open(DialogComponent, {
      data: { message: this.message },
    });
  }

  onSignOut() {
    this.signInService.signOut();
    this.goToWelcomePage();
  }

  onOpenCreateBoard(): void {
    this.title = '';
    const createBoardRef = this.dialog.open(CreateBoardComponent, {
      data: { title: this.title },
    });

    createBoardRef.afterClosed().subscribe((result) => {
      if (result) {
        this.title = result;
        this.userId = this.signInService._id;
        this.createBoardService
          .createBoard(this.token, this.title, this.userId)
          .pipe(take(1))
          .subscribe({
            next: () => {
              this.router.navigate(['main']);
              this.boardsService.getAllBoards(this.token).pipe(take(1)).subscribe({});
              this.message = this.translocoService.translate(
                'boardCreatedMessage'
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
    });
  }
}
