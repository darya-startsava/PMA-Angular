import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { endpoints } from '../constants';

export interface GetAllBoardsInterface {
  _id: string;
  title: string;
  owner: string;
  users: Array<string>;
}

@Injectable({
  providedIn: 'root',
})
export class BoardsService {
  url = endpoints.boards;
  boards: Array<GetAllBoardsInterface> = [];

  constructor(private http: HttpClient) {}

  getAllBoards(token: string): Observable<Array<GetAllBoardsInterface>> {
    return this.http
      .get<any>(this.url, {
        headers: new HttpHeaders({
          Authorization: `${token}`,
        }),
      })
      .pipe(
        tap({
          next: (response) => (this.boards = response),
        })
      );
  }

  deleteBoard(token: string, boardId: string): Observable<unknown> {
    return this.http
      .delete(`${this.url}/${boardId}`, {
        headers: new HttpHeaders({
          Authorization: `${token}`,
        }),
      })
      .pipe(tap());
  }
}
