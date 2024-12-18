import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { CustomerInfo, SalesPlanResponse } from './model';

@Injectable({
  providedIn: 'root',
})
export class SalesPlanningService {
  private readonly SALES_PLANNING_CUSTOMER_INFO_API: string =
    'api/sales-planning/customer-info';

  private readonly SALES_PLANNING_CUSTOMER_SALES_PLAN_API: string =
    'api/sales-planning/customer-sales-plan';

  private readonly http: HttpClient = inject(HttpClient);

  public getCustomerInfo(
    customerNumber: string,
    language: string
  ): Observable<CustomerInfo[]> {
    return this.http.get<CustomerInfo[]>(
      `${this.SALES_PLANNING_CUSTOMER_INFO_API}?customerNumber=${customerNumber}&language=${language}`
    );
  }

  public getCustomerSalesPlan(
    customerNumber: string
  ): Observable<SalesPlanResponse> {
    return this.http.get<SalesPlanResponse>(
      `${this.SALES_PLANNING_CUSTOMER_SALES_PLAN_API}?customerNumber=${customerNumber}`
    );
  }
}
