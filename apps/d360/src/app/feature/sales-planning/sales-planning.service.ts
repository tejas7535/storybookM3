import { HttpClient, HttpParams } from '@angular/common/http';
import { DestroyRef, inject, Injectable, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { catchError, finalize, map, Observable, of, take, tap } from 'rxjs';

import { translate, TranslocoService } from '@jsverse/transloco';

import { BackendTableResponse } from '../../shared/components/table';
import {
  Comment,
  CommentCreateRequest,
  CommentParams,
} from '../../shared/models/comments.model';
import { SnackbarService } from '../../shared/utils/service/snackbar.service';
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

  private readonly SALES_PLANNING_OTHER_REVENUES_API: string =
    'api/sales-planning/other-revenues';

  private readonly SALES_PLANNING_MATERIAL_SHARE_API: string =
    'api/sales-planning/material-share';

  private readonly COMMENTS_READ_API = '/api/sales-planning/comments';
  private readonly COMMENTS_CREATE_API = '/api/sales-planning/comments/create';

  private readonly translocoService: TranslocoService =
    inject(TranslocoService);

  private readonly destroyRef: DestroyRef = inject(DestroyRef);
  private readonly http: HttpClient = inject(HttpClient);
  private readonly snackbarService: SnackbarService = inject(SnackbarService);

  public loadingComments = signal<boolean>(false);

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

  public updateOtherRevenues(
    customerNumber: string,
    planningYear: string,
    planningCurrency: string,
    adjustedValue: number
  ): Observable<void> {
    const params = new HttpParams()
      .set('customerNumber', customerNumber)
      .set('planningYear', planningYear);

    return this.http.put<void>(
      this.SALES_PLANNING_OTHER_REVENUES_API,
      { planningCurrency, adjustedValue },
      { params }
    );
  }

  public updateShares(
    customerNumber: string,
    planningYear: string,
    adjustedShares: {
      apShare: number;
      spShare: number;
      opShare: number;
    }
  ): Observable<void> {
    const params = new HttpParams()
      .set('customerNumber', customerNumber)
      .set('planningYear', planningYear);

    return this.http.put<void>(
      this.SALES_PLANNING_MATERIAL_SHARE_API,
      adjustedShares,
      {
        params,
      }
    );
  }

  public deleteShares(
    customerNumber: string,
    planningYear: string
  ): Observable<void> {
    const params = new HttpParams()
      .set('customerNumber', customerNumber)
      .set('planningYear', planningYear);

    return this.http.delete<void>(this.SALES_PLANNING_MATERIAL_SHARE_API, {
      params,
    });
  }

  public getComments$(
    params: CommentParams
  ): Observable<BackendTableResponse<Comment> | null> {
    this.loadingComments.set(true);

    return this.http
      .post<BackendTableResponse<Comment> | null>(
        this.COMMENTS_READ_API,
        params,
        { responseType: 'json' }
      )
      .pipe(
        map((response: BackendTableResponse<Comment> | null) => response),
        catchError(() => {
          this.snackbarService.openSnackBar(translate('error.loading_failed'));

          return of(null);
        }),
        finalize(() => this.loadingComments.set(false)),
        takeUntilDestroyed(this.destroyRef)
      );
  }

  public postComment$(
    data: CommentCreateRequest,
    customerNumber: string
  ): Observable<unknown> {
    this.loadingComments.set(true);

    return this.http
      .post<Comment | void>(this.COMMENTS_CREATE_API, data, {
        responseType: 'json',
        params: new HttpParams().set('customerNumber', customerNumber),
      })
      .pipe(
        take(1),
        tap(() =>
          this.snackbarService.openSnackBar(
            translate('sales_planning.comments.saved')
          )
        ),
        finalize(() => this.loadingComments.set(false)),
        takeUntilDestroyed(this.destroyRef)
      );
  }
}
