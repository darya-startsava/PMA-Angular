import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { endpoints } from '../constants';

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

  url = endpoints.signUp;
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
        next: (event) => { this.status = event.status, this.login = event?.body?.login || '' },
        // Operation failed; error is an HttpErrorResponse
        error: (error) => this.status = error.status
      }));
  }
}

