import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { DataService } from '@schaeffler/http';

import { InitialFiltersResponse } from '../models';

@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  private readonly INITIAL_FILTERS = 'initial-filters';

  public constructor(private readonly dataService: DataService) {}

  public getInitialFilters(): Observable<InitialFiltersResponse> {
    return this.dataService.getAll<InitialFiltersResponse>(
      this.INITIAL_FILTERS
    );
  }
}
