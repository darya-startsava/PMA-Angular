import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { endpoints } from '../constants';

export interface CreateColumnInterface {
  title: string;
  order: number;
  boardId: string;
  _id: string;
}

@Injectable({
  providedIn: 'root',
})
export class CreateColumnService {
  url = endpoints.boards;
  constructor(private http: HttpClient) {}

  createColumn(
    token: string,
    boardId: string,
    title: string,
    order: number
  ): Observable<CreateColumnInterface> {
    return this.http
      .post<CreateColumnInterface>(
        `${this.url}/${boardId}/columns`,
        {
          title,
          order,
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
