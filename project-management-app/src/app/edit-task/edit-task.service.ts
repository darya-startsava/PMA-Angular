import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { endpoints } from '../constants';

export interface EditTaskInterface {
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
export class EditTaskService {
  url = endpoints.boards;
  constructor(private http: HttpClient) {}

  editTask(
    token: string,
    boardId: string,
    columnId: string,
    taskId: string,
    title: string,
    order: number,
    description: string,
    userId: string,
    users: Array<string>
  ): Observable<EditTaskInterface> {
    return this.http
      .put<EditTaskInterface>(
        `${this.url}/${boardId}/columns/${columnId}/tasks/${taskId}`,
        {
          title,
          order,
          description,
          columnId,
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
