import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { withCache } from '@ngneat/cashew';

import { ApiVersion } from '../shared/models';
import { InitialFiltersResponse } from './models/initial-filters-response.model';

@Injectable({
  providedIn: 'root',
})
export class FilterService {
  readonly INITIAL_FILTERS = 'initial-filters';

  constructor(private readonly http: HttpClient) {}

  getInitialFilters(): Observable<InitialFiltersResponse> {
    return this.http.get<InitialFiltersResponse>(
      `${ApiVersion.V1}/${this.INITIAL_FILTERS}`,
      {
        context: withCache(),
      }
    );
  }
}
