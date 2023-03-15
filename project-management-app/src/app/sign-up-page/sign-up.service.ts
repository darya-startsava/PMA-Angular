import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';

import { Observable, tap } from 'rxjs';

export interface SignUpInterface {
  "name"?: string | null,
  "login"?: string | null,
  "password"?: string | null
}

export interface SignUpResponseInterface {
  "name"?: string | null,
  "login"?: string | null,
  "id"?: string | null
}

@Injectable({
  providedIn: 'root'
})

export class SignUpService {

  url = 'http://localhost:3000/auth/signup';
  status!: number;
  login = '';

  constructor(private http: HttpClient) { }

  signUp(user: SignUpInterface): Observable<HttpResponse<SignUpResponseInterface>> {
    return this.http.post<SignUpInterface>(
      this.url, user, {
      observe: 'response'
    }).pipe(
      tap({
        // Succeeds when there is a response; ignore other events
        next: (event) => { console.log(event); this.status = event.status, this.login = event?.body?.login || '' },
        // Operation failed; error is an HttpErrorResponse
        error: (error) => { console.log(error); this.status = error.status }
      }));
  }
}

