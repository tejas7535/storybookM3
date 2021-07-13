import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { withCache } from '@ngneat/cashew';

import { DataService } from '@schaeffler/http';

import { InitialFiltersResponse } from '../shared/models';

@Injectable({
  providedIn: 'root',
})
export class FilterService {
  readonly INITIAL_FILTERS = 'initial-filters';

  constructor(private readonly dataService: DataService) {}

  getInitialFilters(): Observable<InitialFiltersResponse> {
    return this.dataService.getAll<InitialFiltersResponse>(
      this.INITIAL_FILTERS,
      { context: withCache() }
    );
  }
}
