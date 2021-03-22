import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { DataService, GetOptions } from '@schaeffler/http';

import {
  AutocompleteResponse,
  AutocompleteSearch,
  Customer,
  IdValue,
  QuotationIdentifier,
  SalesOrg,
} from '../../../../core/store/models';

@Injectable({
  providedIn: 'root',
})
export class SearchService {
  private readonly PARAM_SEARCH_FOR = 'search_for';
  private readonly PARAM_CUSTOMER_ID = 'customer_id';

  private readonly PATH_AUTO_COMPLETE = 'auto-complete';
  private readonly PATH_GET_SALES_ORGS = 'sales-orgs';
  private readonly PATH_CUSTOMERS = 'customers';

  constructor(private readonly dataService: DataService) {}

  public autocomplete(
    autocompleteSearch: AutocompleteSearch
  ): Observable<IdValue[]> {
    const httpParams = new HttpParams().set(
      this.PARAM_SEARCH_FOR,
      autocompleteSearch.searchFor
    );
    const options: GetOptions = {
      params: httpParams,
    };
    const filter = autocompleteSearch.filter.toLowerCase();

    return this.dataService
      .getAll<AutocompleteResponse>(
        `${this.PATH_AUTO_COMPLETE}/${filter}`,
        options
      )
      .pipe(
        map((res: AutocompleteResponse) => {
          return res.items.map((opt: IdValue) => ({
            ...opt,
            selected: false,
          }));
        })
      );
  }
  public getSalesOrgs(customerId: string): Observable<SalesOrg[]> {
    const httpParams = new HttpParams().set(this.PARAM_CUSTOMER_ID, customerId);
    const options: GetOptions = {
      params: httpParams,
    };

    return this.dataService
      .getAll<string[]>(`${this.PATH_GET_SALES_ORGS}`, options)
      .pipe(
        map((res: string[]) =>
          res.map((el, index) => ({ id: el, selected: index === 0 }))
        )
      );
  }
  public getCustomer(
    quotationIdentifier: QuotationIdentifier
  ): Observable<Customer> {
    const { customerNumber, salesOrg } = quotationIdentifier;

    return this.dataService.getAll<Customer>(
      `${this.PATH_CUSTOMERS}/${customerNumber}/${salesOrg}`
    );
  }
}
