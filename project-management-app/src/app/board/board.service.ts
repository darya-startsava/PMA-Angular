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
            if (
              response.length !== 0 &&
              response.find((column, index) => column.order !== index)
            ) {
              this.putInOrderColumns(response, token);
            } else {
              this.columns = response;
              this.changeColumnsList(response);
            }
          },
        })
      );
  }

  putInOrderColumns(
    columns: Array<GetAllColumnsByBoardIdInterface>,
    token: string
  ): any {
    const columnsSetForHttp = columns.map((column, index) => {
      return {
        _id: column._id,
        order: index,
      };
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
}
