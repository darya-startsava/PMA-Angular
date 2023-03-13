import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';

import { Observable } from 'rxjs';

export interface SignUpInterface {
  "name"?: string | null,
  "login"?: string | null,
  "password"?: string | null
}

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
  })
};

@Injectable({
  providedIn: 'root'
})

export class SignUpService {

  url = 'http://localhost:3000/auth/signup';

  constructor(private http: HttpClient) { }

  signUp(user: SignUpInterface): Observable<SignUpInterface> {
    return this.http.post<SignUpInterface>(
      this.url, user, httpOptions);
  }
}
