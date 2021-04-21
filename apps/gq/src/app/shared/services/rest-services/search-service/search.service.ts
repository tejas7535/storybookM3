import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { DataService, GetOptions } from '@schaeffler/http';

import { SalesOrg } from '../../../../core/store/reducers/create-case/models';
import { QuotationIdentifier } from '../../../../core/store/reducers/process-case/models';
import { Customer } from '../../../models/customer';
import { AutocompleteSearch, IdValue } from '../../../models/search';
import { PriceService } from '../../price-service/price.service';
import { AutocompleteResponse } from './models/autocomplete-response.model';

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

    return this.dataService
      .getAll<Customer>(`${this.PATH_CUSTOMERS}/${customerNumber}/${salesOrg}`)
      .pipe(
        map((customer: Customer) => ({
          ...customer,
          marginDetail: {
            ...customer.marginDetail,
            currentGpi: PriceService.roundToTwoDecimals(
              customer.marginDetail?.currentGpi
            ),
            currentNetSales: PriceService.roundToTwoDecimals(
              customer.marginDetail?.currentNetSales
            ),
            gpiLastYear: PriceService.roundToTwoDecimals(
              customer.marginDetail?.gpiLastYear
            ),
            netSalesLastYear: PriceService.roundToTwoDecimals(
              customer.marginDetail?.netSalesLastYear
            ),
          },
        }))
      );
  }
}
