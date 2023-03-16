import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';

import { Observable, tap } from 'rxjs';

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

  url = 'http://localhost:3000/auth/signin';
  token = ""

  constructor(private http: HttpClient) { }

  signIn(user: SignInInterface): Observable<HttpResponse<SignInResponseInterface>> {
    return this.http.post<SignInResponseInterface>(
      this.url, user, {
      observe: 'response'
    }).pipe(
      tap({
        // Succeeds when there is a response; ignore other events
        next: (event) => { console.log(event); this.token = event?.body?.token || '' },
        // Operation failed; error is an HttpErrorResponse
        error: (error) => { console.log(error); this.token = '' }
      }));
  }
}
