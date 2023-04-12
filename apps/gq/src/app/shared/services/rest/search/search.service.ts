import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { QuotationIdentifier, SalesOrg } from '@gq/core/store/reducers/models';

import { ApiVersion } from '../../../models';
import { Customer } from '../../../models/customer';
import { AutocompleteSearch, IdValue } from '../../../models/search';
import { PriceService } from '../../price/price.service';
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
  private readonly PARAM_CUSTOMER_ID = 'customer_id';

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
  public getSalesOrgs(customerId: string): Observable<SalesOrg[]> {
    const httpParams = new HttpParams().set(this.PARAM_CUSTOMER_ID, customerId);

    return this.http
      .get<string[]>(`${ApiVersion.V1}/${SearchPaths.PATH_GET_SALES_ORGS}`, {
        params: httpParams,
      })
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

    return this.http
      .get<Customer>(
        `${ApiVersion.V1}/${SearchPaths.PATH_CUSTOMERS}/${customerNumber}/${salesOrg}`
      )
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

  public getPlsAndSeries(
    requestPayload: PLsSeriesRequest
  ): Observable<PLsSeriesResponse[]> {
    return this.http.post<PLsSeriesResponse[]>(
      `${ApiVersion.V1}/${SearchPaths.PATH_PLS_AND_SERIES}`,
      requestPayload
    );
  }
}
