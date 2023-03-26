import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, tap, Subject, take } from 'rxjs';
import { endpoints } from '../constants';

export interface GetAllTasksByColumnIdInterface {
  _id: string;
  title: string;
  order: number;
  boardId: string;
  columnId: string;
  description: string;
  userId: string;
  users: Array<string>;
}

@Injectable()
export class ColumnService {
  url = endpoints.boards;
  urlForPutInOrder = endpoints.tasksSet;
  tasks: Array<GetAllTasksByColumnIdInterface> = [];
  tasksListChange: Subject<Array<GetAllTasksByColumnIdInterface>> = new Subject<
    Array<GetAllTasksByColumnIdInterface>
  >();

  constructor(private http: HttpClient) {}
  changeTasksList(tasks: Array<GetAllTasksByColumnIdInterface>) {
    this.tasksListChange.next(tasks);
  }

  getAllTasksByColumnId(
    token: string,
    boardId: string,
    columnId: string
  ): Observable<Array<GetAllTasksByColumnIdInterface>> {
    return this.http
      .get<any>(`${this.url}/${boardId}/columns/${columnId}/tasks`, {
        headers: new HttpHeaders({
          Authorization: `${token}`,
        }),
      })
      .pipe(
        tap({
          next: (response) => {
            if (
              response.length !== 0 &&
              response.find((task, index) => task.order !== index)
            ) {
              this.putInOrderTasks(response, token);
            } else {
              this.tasks = response;
              this.changeTasksList(response);
            }
          },
        })
      );
  }

  putInOrderTasks(
    tasks: Array<GetAllTasksByColumnIdInterface>,
    token: string
  ): any {
    const tasksSetForHttp = tasks.map((task, index) => {
      return {
        _id: task._id,
        order: index,
        columnId: task.columnId,
      };
    });
    return this.http
      .patch<Array<GetAllTasksByColumnIdInterface>>(
        this.urlForPutInOrder,
        tasksSetForHttp,
        {
          headers: new HttpHeaders({
            Authorization: `${token}`,
          }),
        }
      )
      .pipe(
        tap({
          next: (response) => {
            this.tasks = response;
            this.changeTasksList(response);
          },
        })
      )
      .pipe(take(1))
      .subscribe();
  }

  deleteTaskById(
    token: string,
    boardId: string,
    columnId: string,
    taskId: string
  ): Observable<unknown> {
    return this.http
      .delete(`${this.url}/${boardId}/columns/${columnId}/tasks/${taskId}`, {
        headers: new HttpHeaders({
          Authorization: `${token}`,
        }),
      })
      .pipe(tap());
  }
}
