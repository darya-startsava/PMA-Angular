import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { url } from '../constants';
import { Observable, tap } from 'rxjs';

interface WakeUpServerInterface {
  statusCode: number;
  message: string;
}

@Injectable({
  providedIn: 'root',
})
export class WelcomePageService {
  constructor(private http: HttpClient) {}

  wakeUpServer(): Observable<HttpResponse<WakeUpServerInterface>> {
    return this.http.get<HttpResponse<WakeUpServerInterface>>(url).pipe(
      tap({
        error: () => console.log('Server is spun up now.'),
      })
    );
  }
}
