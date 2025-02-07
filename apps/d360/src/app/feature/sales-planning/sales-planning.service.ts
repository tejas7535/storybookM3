import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { TranslocoService } from '@jsverse/transloco';

import {
  CustomerInfo,
  DetailedCustomerSalesPlan,
  SalesPlanResponse,
} from './model';

@Injectable({
  providedIn: 'root',
})
export class SalesPlanningService {
  private readonly SALES_PLANNING_CUSTOMER_INFO_API: string =
    'api/sales-planning/customer-info';

  private readonly SALES_PLANNING_CUSTOMER_SALES_PLAN_API: string =
    'api/sales-planning/customer-sales-plan';

  private readonly SALES_PLANNING_DATA_API: string =
    '/api/sales-planning/detailed-customer-sales-plan';

  private readonly translocoService: TranslocoService =
    inject(TranslocoService);

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

  public getDetailedCustomerSalesPlan(
    customerNumber: string,
    planningCurrency: string,
    planningLevelMaterialType?: string,
    detailLevel?: string
  ): Observable<DetailedCustomerSalesPlan[]> {
    let params = new HttpParams()
      .set('customerNumber', customerNumber)
      .set('language', this.translocoService.getActiveLang())
      .set('currency', planningCurrency);

    if (planningLevelMaterialType) {
      params = params.set(
        'planningLevelMaterialType',
        planningLevelMaterialType
      );
    }

    if (detailLevel) {
      params = params.set('detailLevel', detailLevel);
    }

    return this.http.get<DetailedCustomerSalesPlan[]>(
      this.SALES_PLANNING_DATA_API,
      { params }
    );
  }
}
