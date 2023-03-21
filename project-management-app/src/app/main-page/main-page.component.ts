import { Component, OnInit } from '@angular/core';
import { take } from 'rxjs';
import { SignInService } from '../sign-in-page/sign-in.service';
import { BoardsService, GetAllBoardsInterface } from './boards.service';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss'],
})
export class MainPageComponent implements OnInit {
  token = '';
  boards: Array<GetAllBoardsInterface> = [];

  constructor(
    public signInService: SignInService,
    private boardsService: BoardsService
  ) {}

  ngOnInit() {
    this.token = this.signInService.token;
    this.boardsService
      .getAllBoards(this.token)
      .pipe(take(1))
      .subscribe({ next: (boards) => (this.boards = boards) });
  }
  
  onOpenConfirmation() {}
}
