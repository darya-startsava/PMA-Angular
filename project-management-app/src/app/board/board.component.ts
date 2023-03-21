import { Component } from '@angular/core';
import { TranslocoService } from '@ngneat/transloco';
import { take } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

import { SignInService } from '../sign-in-page/sign-in.service';
import { BoardService, GetAllColumnsByBoardIdInterface } from './board.service';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss'],
})
export class BoardComponent {
  token = '';
  columns: Array<GetAllColumnsByBoardIdInterface> = [];
  boardId = '';

  constructor(
    private translocoService: TranslocoService,
    public signInService: SignInService,
    private boardService: BoardService,
    private route: ActivatedRoute
  ) {}
  ngOnInit() {
    this.boardId = this.route.snapshot.params['id'];
    console.log(this.boardId);
    this.token = this.signInService.token;
    this.getAllColumnsByBorderId();
  }

  getAllColumnsByBorderId() {
    this.boardService
      .getAllColumnsByBoardId(this.token, this.boardId)
      .pipe(take(1))
      .subscribe({ next: () => (this.columns = this.boardService.columns) });
  }
  onOpenCreateColumnModal() {}

  onOpenConfirmationDeleteColumn(columnId: string) {}
}
