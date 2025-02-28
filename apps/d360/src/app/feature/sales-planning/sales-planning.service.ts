import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { TranslocoService } from '@jsverse/transloco';

import {
  CustomerInfo,
  DetailedCustomerSalesPlan,
  DetailedCustomerSalesPlanRequest,
  DetailedSalesPlanUpdateRequest,
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

  private readonly SALES_PLANNING_CASH_DISCOUNTS_API: string =
    'api/sales-planning/cash-discounts';

  private readonly SALES_PLANNING_SALES_DEDUCTIONS_API: string =
    'api/sales-planning/sales-deductions';

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
    request: DetailedCustomerSalesPlanRequest
  ): Observable<DetailedCustomerSalesPlan[]> {
    let params = new HttpParams()
      .set('customerNumber', request.customerNumber)
      .set('language', this.translocoService.getActiveLang())
      .set('currency', request.planningCurrency);

    if (request.planningLevelMaterialType) {
      params = params.set(
        'planningLevelMaterialType',
        request.planningLevelMaterialType
      );
    }

    if (request.detailLevel) {
      params = params.set('detailLevel', request.detailLevel);
    }

    if (request.planningMaterial) {
      params = params.set('planningMaterial', request.planningMaterial);
    }

    if (request.planningYear) {
      params = params.set('planningYear', request.planningYear);
    }

    return this.http.get<DetailedCustomerSalesPlan[]>(
      this.SALES_PLANNING_DATA_API,
      { params }
    );
  }

  public updateDetailedCustomerSalesPlan(
    customerNumber: string,
    detailedSalesPlanUpdateRequest: DetailedSalesPlanUpdateRequest
  ): Observable<void> {
    const params = new HttpParams().set('customerNumber', customerNumber);

    return this.http.put<void>(
      this.SALES_PLANNING_DATA_API,
      detailedSalesPlanUpdateRequest,
      { params }
    );
  }

  public deleteDetailedCustomerSalesPlan(
    customerNumber: string,
    planningYear: string,
    planningMonth: string,
    planningMaterial: string | null
  ): Observable<void> {
    let params = new HttpParams()
      .set('customerNumber', customerNumber)
      .set('planningYear', planningYear)
      .set('planningMonth', planningMonth);

    if (planningMaterial) {
      params = params.set('planningMaterial', planningMaterial);
    }

    return this.http.delete<void>(this.SALES_PLANNING_DATA_API, { params });
  }

  public updateCashDiscounts(
    customerNumber: string,
    planningYear: string,
    adjustedPercentage: number
  ): Observable<void> {
    const params = new HttpParams()
      .set('customerNumber', customerNumber)
      .set('planningYear', planningYear);

    return this.http.put<void>(
      this.SALES_PLANNING_CASH_DISCOUNTS_API,
      { adjustedPercentage },
      { params }
    );
  }

  public updateSalesDeductions(
    customerNumber: string,
    planningYear: string,
    adjustedPercentage: number
  ): Observable<void> {
    const params = new HttpParams()
      .set('customerNumber', customerNumber)
      .set('planningYear', planningYear);

    return this.http.put<void>(
      this.SALES_PLANNING_SALES_DEDUCTIONS_API,
      { adjustedPercentage },
      { params }
    );
  }
}
