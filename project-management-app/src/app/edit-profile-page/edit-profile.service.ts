import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { endpoints } from '../constants';

export interface EditProfileRequestInterface {
  name?: string | null;
  login?: string | null;
  password?: string | null;
}


@Injectable({
  providedIn: 'root',
})
export class EditProfileService {
  url = endpoints.users;
  login = '';
  name = '';

  constructor(private http: HttpClient) {}

  updateUser(
    token: string,
    user: EditProfileRequestInterface,
    userId:string
  ): Observable<EditProfileRequestInterface> {
    return this.http
      .put<EditProfileRequestInterface>(`${this.url}/${userId}`, user, {
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

  deleteProfile(token: string, userId:string): Observable<unknown> {
    return this.http
      .delete(`${this.url}/${userId}`, {
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
