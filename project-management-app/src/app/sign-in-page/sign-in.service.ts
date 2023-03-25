import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpHeaders } from '@angular/common/http';
import { Observable, tap, Subject } from 'rxjs';
import { endpoints } from '../constants';

export interface SignInInterface {
  login?: string | null;
  password?: string | null;
}

export interface SignInResponseInterface {
  token?: string | null;
}

export interface UserResponseInterface {
  _id?: string | null;
  name?: string | null;
  login?: string | null;
}

export interface UserLoginIdInterface {
  login?: string | null;
  userId?: string | null;
}

@Injectable({
  providedIn: 'root',
})
export class SignInService {
  url = endpoints.signIn;
  urlUsers = endpoints.users;
  token = '';
  login = '';
  tokenChange: Subject<string> = new Subject<string>();
  _id = '';
  name = '';
  users: Array<UserLoginIdInterface> = [];

  constructor(private http: HttpClient) {}

  changeToken(token: string) {
    this.tokenChange.next(token);
  }

  signIn(
    user: SignInInterface
  ): Observable<HttpResponse<SignInResponseInterface>> {
    return this.http
      .post<SignInResponseInterface>(this.url, user, {
        observe: 'response',
      })
      .pipe(
        tap({
          // Succeeds when there is a response; ignore other events
          next: (event) => {
            this.token = event.body?.token ? `Bearer ${event.body.token}` : '';
            this.login = user.login || '';
            this.changeToken(this.token);
          },
          // Operation failed; error is an HttpErrorResponse
          error: () => {
            this.token = '';
            this.login = '';
            this.changeToken(this.token);
          },
        })
      );
  }

  getUserByLogin(): Observable<Array<UserResponseInterface>> {
    return this.http
      .get<any>(this.urlUsers, {
        headers: new HttpHeaders({
          Authorization: `${this.token}`,
        }),
      })
      .pipe(
        tap({
          next: (response) => {
            this.users = response
              .map((i) => {
                return { login: i.login || '', userId: i._id };
              })
              .sort((a, b) =>
                a.login > b.login ? 1 : b.login > a.login ? -1 : 0
              );
            const user = response.filter((i) => i.login === this.login);
            this.login = user[0].login || '';
            this._id = user[0]._id || '';
            this.name = user[0].name || '';
          },
        })
      );
  }

  signOut() {
    this.token = '';
    this.changeToken(this.token);
  }
}
