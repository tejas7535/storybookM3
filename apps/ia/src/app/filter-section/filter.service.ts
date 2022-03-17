import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { map, Observable } from 'rxjs';

import { withCache } from '@ngneat/cashew';

import { ParamsCreatorService } from '../shared/http/params-creator.service';
import { ApiVersion, IdValue } from '../shared/models';
import { AutoCompleteResponse } from './models/auto-complete-response.model';

@Injectable({
  providedIn: 'root',
})
export class FilterService {
  readonly FILTER_BASE_PATH = 'filters';
  readonly AUTOCOMPLETE_ORG_UNITS = 'org-units';

  constructor(
    private readonly http: HttpClient,
    private readonly paramsCreator: ParamsCreatorService
  ) {}

  getOrgUnits(searchFor: string, timeRange: string): Observable<IdValue[]> {
    const params = this.paramsCreator.createHttpParamsForAutoCompleteOrgUnits(
      searchFor,
      timeRange
    );

    return this.http
      .get<AutoCompleteResponse>(
        `${ApiVersion.V1}/${this.FILTER_BASE_PATH}/${this.AUTOCOMPLETE_ORG_UNITS}`,
        { params, context: withCache() }
      )
      .pipe(map((result) => result.items));
  }
}
