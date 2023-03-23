import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { endpoints } from '../constants';

export interface CreateTaskInterface {
  _id: string;
  title: string;
  order: number;
  boardId: string;
  columnId: string;
  description: string;
  userId: string;
  users: Array<string>;
}

@Injectable({
  providedIn: 'root',
})
export class CreateTaskService {
  url = endpoints.boards;
  constructor(private http: HttpClient) {}

  createTask(
    token: string,
    boardId: string,
    columnId: string,
    title: string,
    order: number,
    description: string,
    userId: string,
    users: Array<string>
  ): Observable<CreateTaskInterface> {
    return this.http
      .post<CreateTaskInterface>(
        `${this.url}/${boardId}/columns/${columnId}/tasks`,
        {
          title,
          order,
          description,
          userId,
          users,
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
