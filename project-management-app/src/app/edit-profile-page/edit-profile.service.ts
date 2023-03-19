import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';
import { endpoints } from '../constants';

export interface EditProfileRequestInterface {
  name?: string | null;
  login?: string | null;
  password?: string | null;
}

export interface UserResponseInterface {
  _id?: string | null;
  name?: string | null;
  login?: string | null;
}

@Injectable({
  providedIn: 'root',
})
export class EditProfileService {
  url = endpoints.users;
  login = '';
  _id = '';
  name = '';

  constructor(private http: HttpClient) {}

  getUserByLogin(
    token: string,
    login: string
  ): Observable<Array<UserResponseInterface>> {
    return this.http
      .get<any>(this.url, {
        headers: new HttpHeaders({
          Authorization: `${token}`,
        }),
      })
      .pipe(
        tap({
          next: (response) => {
            const user = response.filter((i) => i.login === login);
            this.login = user[0].login || '';
            this._id = user[0]._id || '';
            this.name = user[0].name || '';
          },
        })
      );
  }

  updateUser(
    token: string,
    user: EditProfileRequestInterface
  ): Observable<EditProfileRequestInterface> {
    return this.http
      .put<EditProfileRequestInterface>(`${this.url}/${this._id}`, user, {
        headers: new HttpHeaders({
          Authorization: `${token}`,
        }),
      })
      .pipe(
        tap({
          next: (response) => {
            if (response.login && response.name) {
              this.login = response.login;
              this.name = response.name;
            }
          },
        })
      );
  }

  deleteProfile(token: string): Observable<unknown> {
    return this.http
      .delete(`${this.url}/${this._id}`, {
        headers: new HttpHeaders({
          Authorization: `${token}`,
        }),
      })
      .pipe(
        tap({
          next: () => {
            this.login = '';
            this.name = '';
          },
        })
      );
  }
}
