import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable, tap, Subject } from 'rxjs';
import { endpoints } from '../constants';

export interface SignInInterface {
  "login"?: string | null,
  "password"?: string | null
}

export interface SignInResponseInterface {
  "token"?: string | null,
}

@Injectable({
  providedIn: 'root'
})
export class SignInService {

  url = endpoints.signIn;
  token = '';
  login = ''
  tokenChange: Subject<string> = new Subject<string>();

  constructor(private http: HttpClient) {
  }

  changeToken(token: string) {
    this.tokenChange.next(token);
  }

  signIn(user: SignInInterface): Observable<HttpResponse<SignInResponseInterface>> {
    return this.http.post<SignInResponseInterface>(
      this.url, user, {
      observe: 'response'
    }).pipe(
      tap({
        // Succeeds when there is a response; ignore other events
        next: (event) => {
          this.token = event.body?.token ? `Bearer ${event.body.token}` : ''; this.login = user.login || '';
          this.changeToken(this.token);
        },
        // Operation failed; error is an HttpErrorResponse
        error: () => { this.token = ''; this.login = ''; this.changeToken(this.token); }
      }));
  }

  signOut() {
    this.token = '';
    this.changeToken(this.token);
  }
}
