import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { endpoints } from '../constants';

export interface CreateBoardInterface {
  title: string;
  owner: string;
  users: Array<string>;
}

@Injectable({
  providedIn: 'root',
})
export class CreateBoardService {
  url = endpoints.boards;
  constructor(private http: HttpClient) {}

  createBoard(
    token: string,
    title: string,
    userId: string
  ): Observable<CreateBoardInterface> {
    return this.http
      .post<CreateBoardInterface>(
        `${this.url}`,
        {
          title,
          owner: userId,
          users: [userId],
        },
        {
          headers: new HttpHeaders({
            Authorization: `${token}`,
          }),
        }
      )
      .pipe(tap());
  }
}
