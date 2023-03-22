import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { endpoints } from '../constants';

export interface GetAllColumnsByBoardIdInterface {
  _id: string;
  title: string;
  order: number;
  boardId: string;
}

@Injectable({
  providedIn: 'root',
})
export class BoardService {
  url = endpoints.boards;
  columns: Array<GetAllColumnsByBoardIdInterface> = [];
  constructor(private http: HttpClient) {}

  getAllColumnsByBoardId(
    token: string,
    boardId: string
  ): Observable<Array<GetAllColumnsByBoardIdInterface>> {
    return this.http
      .get<any>(`${this.url}/${boardId}/columns`, {
        headers: new HttpHeaders({
          Authorization: `${token}`,
        }),
      })
      .pipe(
        tap({
          next: (response) => {
            this.columns = response;
          },
        })
      );
  }

  deleteColumnById(
    token: string,
    boardId: string,
    columnId: string
  ): Observable<unknown> {
    return this.http
      .delete(`${this.url}/${boardId}/columns/${columnId}`, {
        headers: new HttpHeaders({
          Authorization: `${token}`,
        }),
      })
      .pipe(tap());
  }
}
