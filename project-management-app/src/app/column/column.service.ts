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

export interface UpdateColumnTitleInterface {
  title: string;
  order: number;
  boardId: string;
  columnId: string;
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
            this.tasks = response.sort((a, b) => a.order - b.order);
            this.changeTasksList(response.sort((a, b) => a.order - b.order));
          },
        })
      );
  }

  putInOrderTasksAfterDeletionTask(
    tasks: Array<GetAllTasksByColumnIdInterface>,
    token: string,
    deletedTaskOrder: number
  ): any {
    const tasksSetForHttp = tasks.map((task) => {
      if (task.order < deletedTaskOrder) {
        return {
          _id: task._id,
          order: task.order,
          columnId: task.columnId,
        };
      } else {
        return {
          _id: task._id,
          order: task.order - 1,
          columnId: task.columnId,
        };
      }
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
            this.tasks = response.sort((a, b) => a.order - b.order);
            this.changeTasksList(response.sort((a, b) => a.order - b.order));
          },
        })
      )
      .pipe(take(1))
      .subscribe();
  }

  putInOrderTasksAfterDragNDrop(
    tasks: Array<GetAllTasksByColumnIdInterface>,
    token: string,
    previousIndex: number,
    currentIndex: number
  ): any {
    const columnsSetForHttp = tasks
      .map((task) => {
        if (previousIndex > currentIndex) {
          if (task.order < currentIndex || task.order > previousIndex) {
            return {
              _id: task._id,
              order: task.order,
              columnId: task.columnId,
            };
          } else if (task.order === previousIndex) {
            return {
              _id: task._id,
              order: currentIndex,
              columnId: task.columnId,
            };
          } else {
            return {
              _id: task._id,
              order: task.order + 1,
              columnId: task.columnId,
            };
          }
        } else {
          if (task.order < previousIndex || task.order > currentIndex) {
            return {
              _id: task._id,
              order: task.order,
              columnId: task.columnId,
            };
          } else if (task.order === previousIndex) {
            return {
              _id: task._id,
              order: currentIndex,
              columnId: task.columnId,
            };
          } else {
            return {
              _id: task._id,
              order: task.order - 1,
              columnId: task.columnId,
            };
          }
        }
      })
      .sort((a, b) => a.order - b.order);
    return this.http
      .patch<Array<GetAllTasksByColumnIdInterface>>(
        this.urlForPutInOrder,
        columnsSetForHttp,
        {
          headers: new HttpHeaders({
            Authorization: `${token}`,
          }),
        }
      )
      .pipe(
        tap({
          next: (response) => {
            this.tasks = response.sort((a, b) => a.order - b.order);
            this.changeTasksList(response.sort((a, b) => a.order - b.order));
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

  updateTaskTitle(
    token: string,
    boardId: string,
    columnId: string,
    title: string,
    order: number
  ): Observable<UpdateColumnTitleInterface> {
    return this.http
      .put<UpdateColumnTitleInterface>(
        `${this.url}/${boardId}/columns/${columnId}`,
        { title, order },
        {
          headers: new HttpHeaders({
            Authorization: `${token}`,
          }),
        }
      )
      .pipe(tap());
  }
}
