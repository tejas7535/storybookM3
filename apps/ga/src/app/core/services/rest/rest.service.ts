import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RestService {
  private readonly baseUrl =
    'https://caeonlinecalculation-d.schaeffler.com/BearinxWebApi/v1.1/greaseservice';

  public constructor(private readonly httpClient: HttpClient) {}

  public getBearingSearch(query: string): Observable<string[]> {
    return this.httpClient.get<string[]>(`${this.baseUrl}/bearings/search`, {
      params: {
        pattern: query,
      },
    });
  }
}
