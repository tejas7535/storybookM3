import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { DataService, GetOptions } from '@schaeffler/http';

import {
  AutocompleteQuotationResponse,
  AutocompleteResponse,
  AutocompleteSearch,
  IdValue,
  SapQuotation,
} from '../../../core/store/models';
import { FilterNames } from '../../../shared/autocomplete-input/filter-names.enum';

/**
 *  Auto-complete service
 */

@Injectable({
  providedIn: 'root',
})
export class AutocompleteService {
  private readonly PARAM_SEARCH_FOR = 'search_for';
  private readonly AUTO_COMPLETE = 'auto-complete';

  constructor(private readonly dataService: DataService) {}

  public autocomplete(
    autocompleteSearch: AutocompleteSearch
  ): Observable<IdValue[] | SapQuotation[]> {
    const httpParams = new HttpParams().set(
      this.PARAM_SEARCH_FOR,
      autocompleteSearch.searchFor
    );
    const options: GetOptions = {
      params: httpParams,
    };
    const filter = autocompleteSearch.filter.toLowerCase();
    const filterPath =
      filter === FilterNames.QUOTATION ? 'sap-quotation' : filter;

    return this.dataService
      .getAll<AutocompleteResponse>(
        `${this.AUTO_COMPLETE}/${filterPath}`,
        options
      )
      .pipe(
        map((res: AutocompleteResponse) => {
          if (filter === FilterNames.QUOTATION) {
            return (res.items as AutocompleteQuotationResponse[]).map((el) => ({
              id: el.sapId,
              value: el.sapId,
              selected: false,
              customerId: el.customerId,
              customerName: el.customerName,
              gqImportedUser: el.gqImportUser,
              imported: el.imported,
            })) as SapQuotation[];
          }

          return (res.items as IdValue[]).map((opt: IdValue) => ({
            ...opt,
            selected: false,
          }));
        })
      );
  }
}
