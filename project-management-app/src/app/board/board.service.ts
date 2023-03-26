import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, tap, Subject, take } from 'rxjs';
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
  urlForPutInOrder = endpoints.columnsSet;
  columns: Array<GetAllColumnsByBoardIdInterface> = [];
  columnsListChange: Subject<Array<GetAllColumnsByBoardIdInterface>> =
    new Subject<Array<GetAllColumnsByBoardIdInterface>>();
  constructor(private http: HttpClient) {}

  changeColumnsList(columns: Array<GetAllColumnsByBoardIdInterface>) {
    this.columnsListChange.next(columns);
  }

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
            this.columns = response.sort((a, b) => a.order - b.order);
            this.changeColumnsList(response.sort((a, b) => a.order - b.order));
          },
        })
      );
  }

  putInOrderColumnsAfterDeletionColumn(
    columns: Array<GetAllColumnsByBoardIdInterface>,
    token: string,
    deletedColumnOrder: number
  ): any {
    const columnsSetForHttp = columns.map((column) => {
      if (column.order < deletedColumnOrder) {
        return {
          _id: column._id,
          order: column.order,
        };
      } else {
        return {
          _id: column._id,
          order: column.order - 1,
        };
      }
    });
    return this.http
      .patch<Array<GetAllColumnsByBoardIdInterface>>(
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
            this.columns = response;
            this.changeColumnsList(response);
          },
        })
      )
      .pipe(take(1))
      .subscribe();
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

  putInOrderColumnsAfterDragNDrop(
    columns: Array<GetAllColumnsByBoardIdInterface>,
    token: string,
    previousIndex: number,
    currentIndex: number
  ): any {
    const columnsSetForHttp = columns
      .map((column) => {
        if (previousIndex > currentIndex) {
          if (column.order < currentIndex || column.order > previousIndex) {
            return {
              _id: column._id,
              order: column.order,
            };
          } else if (column.order === previousIndex) {
            return {
              _id: column._id,
              order: currentIndex,
            };
          } else {
            return {
              _id: column._id,
              order: column.order + 1,
            };
          }
        } else {
          if (column.order < previousIndex || column.order > currentIndex) {
            return {
              _id: column._id,
              order: column.order,
            };
          } else if (column.order === previousIndex) {
            return {
              _id: column._id,
              order: currentIndex,
            };
          } else {
            return {
              _id: column._id,
              order: column.order - 1,
            };
          }
        }
      })
      .sort((a, b) => a.order - b.order);
    return this.http
      .patch<Array<GetAllColumnsByBoardIdInterface>>(
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
            this.columns = response;
            this.changeColumnsList(response);
          },
        })
      )
      .pipe(take(1))
      .subscribe();
  }
}
