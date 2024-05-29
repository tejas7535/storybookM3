import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { map, Observable } from 'rxjs';

import { QuotationIdentifier } from '@gq/core/store/active-case/models';
import { ApiVersion } from '@gq/shared/models';
import { Customer } from '@gq/shared/models/customer';
import { SectorGpsd } from '@gq/shared/models/sector-gpsd.interface';
import { roundToTwoDecimals } from '@gq/shared/utils/pricing.utils';

import { SearchPaths } from '../search/models/search-paths.enum';
import { CustomerPaths } from './models/customer-paths.enum';
import { CustomerSalesOrgsCurrenciesResponse } from './models/customer-sales-orgs-currencies-response.model';

@Injectable({
  providedIn: 'root',
})
export class CustomerService {
  constructor(private readonly http: HttpClient) {}

  getSalesOrgsAndCurrenciesByCustomer(
    customerId: string
  ): Observable<CustomerSalesOrgsCurrenciesResponse> {
    return this.http.get<CustomerSalesOrgsCurrenciesResponse>(
      `${ApiVersion.V1}/${CustomerPaths.PATH_CUSTOMER}/${customerId}/${CustomerPaths.PATH_SALES_ORGS_CURRENCIES}`
    );
  }

  getCustomer(quotationIdentifier: QuotationIdentifier): Observable<Customer> {
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
            currentGpi: roundToTwoDecimals(customer.marginDetail?.currentGpi),
            currentNetSales: roundToTwoDecimals(
              customer.marginDetail?.currentNetSales
            ),
            gpiLastYear: roundToTwoDecimals(customer.marginDetail?.gpiLastYear),
            netSalesLastYear: roundToTwoDecimals(
              customer.marginDetail?.netSalesLastYear
            ),
          },
        }))
      );
  }

  getSectorGpsdsByCustomerAndSalesOrg(
    customerId: string,
    salesOrg: string
  ): Observable<SectorGpsd[]> {
    return this.http
      .get<any>(
        `${ApiVersion.V1}/${CustomerPaths.PATH_CUSTOMER}/${customerId}/${salesOrg}/${CustomerPaths.PATH_END_CUSTOMERS_OR_SECTORS}`
      )
      .pipe(map((data) => data.results));
  }
}
