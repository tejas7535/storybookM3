import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ApiVersion } from '../../../models';
import { AutocompleteSearch, IdValue } from '../../../models/search';
import { AutocompleteResponse } from './models/autocomplete-response.model';
import { PLsSeriesRequest } from './models/pls-series-request.model';
import { PLsSeriesResponse } from './models/pls-series-response.model';
import { SearchPaths } from './models/search-paths.enum';

@Injectable({
  providedIn: 'root',
})
export class SearchService {
  private readonly PARAM_SEARCH_FOR = 'search_for';
  private readonly PARAM_LIMIT = 'limit';

  constructor(private readonly http: HttpClient) {}

  public autocomplete(
    autocompleteSearch: AutocompleteSearch
  ): Observable<IdValue[]> {
    const httpParams = new HttpParams()
      .set(this.PARAM_SEARCH_FOR, autocompleteSearch.searchFor)
      .append(this.PARAM_LIMIT, autocompleteSearch?.limit || 100);

    return this.http
      .get<AutocompleteResponse>(
        `${ApiVersion.V1}/${SearchPaths.PATH_AUTO_COMPLETE}/${autocompleteSearch.filter}`,
        {
          params: httpParams,
        }
      )
      .pipe(
        map((res: AutocompleteResponse) =>
          res.items.map((opt: IdValue) => ({
            ...opt,
            selected: false,
          }))
        )
      );
  }

  public getPlsAndSeries(
    requestPayload: PLsSeriesRequest
  ): Observable<PLsSeriesResponse[]> {
    return this.http.post<PLsSeriesResponse[]>(
      `${ApiVersion.V1}/${SearchPaths.PATH_PLS_AND_SERIES}`,
      requestPayload
    );
  }
}
