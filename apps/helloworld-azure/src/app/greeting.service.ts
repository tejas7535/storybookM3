import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class GreetingService {
  private static handleError(e: HttpErrorResponse): Observable<string> {
    let message = 'Server is currently unavailable! 🤬';

    if (e.status === 403) {
      message = 'Unfortunately, you are not allowed to listen! 😔';
    }

    return of(message);
  }

  constructor(private readonly httpClient: HttpClient) {}

  public greetPublic(): Observable<string> {
    return this.getGreetingFromAPI(`/public/api/hello`);
  }

  public greetAuthorized(): Observable<string> {
    return this.getGreetingFromAPI(`/api/hello`);
  }

  public greetUsers(): Observable<string> {
    return this.getGreetingFromAPI(`/api/user-hello`);
  }

  public greetAdmins(): Observable<string> {
    return this.getGreetingFromAPI(`/admin/api/hello`);
  }

  public greetDotNetPublic(): Observable<string> {
    return this.getGreetingFromAPI(`/dotnet/api/hello`);
  }

  public greetDotNetAuthorized(): Observable<string> {
    return this.getGreetingFromAPI(`/dotnet/api/hello/auth`);
  }

  public greetDotNetUsers(): Observable<string> {
    return this.getGreetingFromAPI(`/dotnet/api/hello/user`);
  }

  public greetDotNetAdmins(): Observable<string> {
    return this.getGreetingFromAPI(`/dotnet/api/hello/admin`);
  }

  private getGreetingFromAPI(endpoint: string): Observable<string> {
    return this.httpClient.get<{ greeting: string }>(endpoint).pipe(
      map((response) => response.greeting),
      catchError((e) => GreetingService.handleError(e))
    );
  }
}
