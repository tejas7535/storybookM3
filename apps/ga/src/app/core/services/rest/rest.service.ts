import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { DataService } from '@schaeffler/http';

@Injectable({
  providedIn: 'root',
})
export class RestService {
  public constructor(private readonly dataService: DataService) {}

  public getBearingSearch(searchQuery: string): Observable<string[]> {
    return this.dataService.getAll<string[]>(`bearings/search`, {
      params: {
        pattern: searchQuery,
      },
    });
  }
}
