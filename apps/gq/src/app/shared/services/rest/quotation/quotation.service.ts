import { HttpClient, HttpContext, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { QuotationTab } from '@gq/core/store/overview-cases/models/quotation-tab.enum';
import { CreateCase, CreateCaseResponse } from '@gq/core/store/reducers/models';
import { SHOW_DEFAULT_SNACKBAR_ACTION } from '@gq/shared/http/http-error.interceptor';
import { OfferType } from '@gq/shared/models/offer-type.interface';
import { GetQuotationsCountResponse } from '@gq/shared/services/rest/quotation/models/get-quotations-count-response.interface';

import {
  ApiVersion,
  PurchaseOrderType,
  Quotation,
  QuotationStatus,
} from '../../../models';
import { CreateCustomerCase } from '../search/models/create-customer-case.model';
import { GetQuotationsResponse } from './models/get-quotations-response.interface';
import { QuotationPaths } from './models/quotation-paths.enum';
import { UpdateQuotationRequest } from './models/update-quotation-request.model';

@Injectable({
  providedIn: 'root',
})
export class QuotationService {
  private readonly PARAM_SHARED = 'shared';
  private readonly PARAM_STATUS = 'status';
  private readonly PARAM_NEXT_APPROVER = 'next_approver';

  readonly #http = inject(HttpClient);

  uploadSelectionToSap(gqPositionIds: string[]): Observable<Quotation> {
    return this.#http.post<Quotation>(
      `${ApiVersion.V1}/${QuotationPaths.PATH_UPLOAD_SELECTION}`,
      {
        gqPositionIds,
      }
    );
  }

  refreshSapPricing(gqId: number): Observable<Quotation> {
    return this.#http.get<Quotation>(
      `${ApiVersion.V1}/${QuotationPaths.PATH_QUOTATIONS}/${gqId}/${QuotationPaths.PATH_REFRESH_SAP_PRICING}`
    );
  }

  updateCases(gqIds: number[], status: QuotationStatus): Observable<any> {
    const requestBody: any = {
      status,
      gqIds,
    };

    return this.#http.put(
      `${ApiVersion.V1}/${QuotationPaths.PATH_QUOTATIONS_STATUS}`,
      requestBody
    );
  }

  getQuotation(gqId: number): Observable<Quotation> {
    return this.#http.get<Quotation>(
      `${ApiVersion.V1}/${QuotationPaths.PATH_QUOTATIONS}/${gqId}`
    );
  }

  getQuotationsCount() {
    return this.#http.get<GetQuotationsCountResponse>(
      `${ApiVersion.V1}/${QuotationPaths.PATH_QUOTATIONS}/${QuotationPaths.PATH_QUOTATIONS_COUNT}`
    );
  }

  getCases(
    tab: QuotationTab,
    nextApprover: string,
    status: QuotationStatus
  ): Observable<GetQuotationsResponse> {
    let httpParams = new HttpParams();

    if (status) {
      httpParams = httpParams.set(this.PARAM_STATUS, status);
    }

    if (tab === QuotationTab.SHARED) {
      httpParams = httpParams.set(this.PARAM_SHARED, true);
    }

    if (tab === QuotationTab.TO_APPROVE) {
      httpParams = httpParams.set(this.PARAM_NEXT_APPROVER, nextApprover);
    }

    return this.#http.get<GetQuotationsResponse>(
      `${ApiVersion.V1}/${QuotationPaths.PATH_QUOTATIONS}`,
      {
        params: httpParams,
      }
    );
  }

  createCase(createCaseData: CreateCase): Observable<CreateCaseResponse> {
    return this.#http
      .post<CreateCaseResponse>(
        `${ApiVersion.V1}/${QuotationPaths.PATH_QUOTATIONS}`,
        createCaseData
      )
      .pipe(
        map((res: any) => {
          const response: CreateCaseResponse = {
            gqId: res.gqId,
            customerId: res.customer.identifier.customerId,
            salesOrg: res.customer.identifier.salesOrg,
          };

          return response;
        })
      );
  }

  importCase(importCase: string): Observable<Quotation> {
    return this.#http.put<Quotation>(
      `${ApiVersion.V1}/${QuotationPaths.PATH_QUOTATIONS}`,
      importCase
    );
  }

  createCustomerCase(
    requestPayload: CreateCustomerCase
  ): Observable<CreateCaseResponse> {
    return this.#http
      .post(
        `${ApiVersion.V1}/${QuotationPaths.PATH_CUSTOMER_QUOTATION}`,
        requestPayload,
        {
          context: new HttpContext().set(SHOW_DEFAULT_SNACKBAR_ACTION, false),
        }
      )
      .pipe(
        map((res: any) => {
          const response: CreateCaseResponse = {
            gqId: res.gqId,
            customerId: res.customer.identifier.customerId,
            salesOrg: res.customer.identifier.salesOrg,
          };

          return response;
        })
      );
  }

  updateQuotation(
    updateQuotationRequest: UpdateQuotationRequest,
    gqId: number
  ): Observable<Quotation> {
    return this.#http.put<Quotation>(
      `${ApiVersion.V1}/${QuotationPaths.PATH_QUOTATIONS}/${gqId}`,
      updateQuotationRequest
    );
  }

  getCurrencies(): Observable<{ currency: string }[]> {
    return this.#http.get<{ currency: string }[]>(
      `${ApiVersion.V1}/${QuotationPaths.PATH_CURRENCIES}`
    );
  }

  getExchangeRateForCurrency(fromCurrency: string, toCurrency: string) {
    return this.#http.get(
      `${ApiVersion.V1}/${QuotationPaths.PATH_CURRENCIES}/${fromCurrency}/exchangeRates/${toCurrency}`
    );
  }

  createSapQuotation(
    gqId: number,
    gqPositionIds: string[]
  ): Observable<Quotation> {
    const requestBody: { gqId: number; gqPositionIds: string[] } = {
      gqId,
      gqPositionIds,
    };

    return this.#http.post<Quotation>(
      `${ApiVersion.V1}/${QuotationPaths.PATH_SAP_QUOTATION}`,
      requestBody
    );
  }

  getPurchaseOrderTypes(): Observable<PurchaseOrderType[]> {
    return this.#http.get<PurchaseOrderType[]>(
      `${ApiVersion.V1}/${QuotationPaths.PURCHASE_ORDER_TYPES}`
    );
  }

  getOfferTypes(): Observable<OfferType[]> {
    return this.#http.get<OfferType[]>(
      `${ApiVersion.V1}/${QuotationPaths.OFFER_TYPES}`
    );
  }
}
