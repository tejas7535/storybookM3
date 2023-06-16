import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class GreetingService {
  constructor(private readonly httpClient: HttpClient) {}
  private static handleError(e: HttpErrorResponse): Observable<string> {
    let message = 'Server is currently unavailable! 🤬';

    if (e.status === 403) {
      message = 'Unfortunately, you are not allowed to listen! 😔';
    }

    return of(message);
  }

  greetPublic(): Observable<string> {
    return this.getGreetingFromAPI(`/public/api/hello`);
  }

  greetAuthorized(): Observable<string> {
    return this.getGreetingFromAPI(`/api/hello`);
  }

  greetUsers(): Observable<string> {
    return this.getGreetingFromAPI(`/api/user-hello`);
  }

  greetAdmins(): Observable<string> {
    return this.getGreetingFromAPI(`/admin/api/hello`);
  }

  greetDotNetPublic(): Observable<string> {
    return this.getGreetingFromAPI(`/dotnet/api/hello`);
  }

  greetDotNetAuthorized(): Observable<string> {
    return this.getGreetingFromAPI(`/dotnet/api/hello/auth`);
  }

  greetDotNetUsers(): Observable<string> {
    return this.getGreetingFromAPI(`/dotnet/api/hello/user`);
  }

  greetDotNetAdmins(): Observable<string> {
    return this.getGreetingFromAPI(`/dotnet/api/hello/admin`);
  }

  private getGreetingFromAPI(endpoint: string): Observable<string> {
    return this.httpClient.get<{ greeting: string }>(endpoint).pipe(
      map((response) => response.greeting),
      catchError((e) => GreetingService.handleError(e))
    );
  }
}
