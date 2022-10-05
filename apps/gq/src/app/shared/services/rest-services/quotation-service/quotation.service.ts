import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import {
  CreateCase,
  CreateCaseResponse,
} from '../../../../core/store/reducers/create-case/models';
import { ApiVersion, Quotation } from '../../../models';
import { QuotationStatus } from '../../../models/quotation/quotation-status.enum';
import { CreateCustomerCase } from '../search-service/models/create-customer-case.model';
import { GetQuotationsResponse } from './models/get-quotations-response.interface';
import { QuotationPaths } from './models/quotation-paths.enum';
import { UpdateQuotationRequest } from './models/update-quotation-request.model';

@Injectable({
  providedIn: 'root',
})
export class QuotationService {
  private readonly PARAM_STATUS = 'status';

  constructor(private readonly http: HttpClient) {}

  public uploadSelectionToSap(gqPositionIds: string[]): Observable<Quotation> {
    return this.http.post<Quotation>(
      `${ApiVersion.V1}/${QuotationPaths.PATH_UPLOAD_SELECTION}`,
      {
        gqPositionIds,
      }
    );
  }
  public refreshSapPricing(gqId: number): Observable<Quotation> {
    return this.http.get<Quotation>(
      `${ApiVersion.V1}/${QuotationPaths.PATH_QUOTATIONS}/${gqId}/${QuotationPaths.PATH_REFRESH_SAP_PRICING}`
    );
  }

  public deleteCases(gqId: string[]): Observable<any> {
    return this.http.delete(
      `${ApiVersion.V1}/${QuotationPaths.PATH_QUOTATIONS}`,
      {
        body: gqId,
      }
    );
  }

  public getQuotation(gqId: number): Observable<Quotation> {
    return this.http.get<Quotation>(
      `${ApiVersion.V1}/${QuotationPaths.PATH_QUOTATIONS}/${gqId}`
    );
  }

  public getCases(status: QuotationStatus): Observable<GetQuotationsResponse> {
    const httpParams = new HttpParams().set(this.PARAM_STATUS, status);

    return this.http.get<GetQuotationsResponse>(
      `${ApiVersion.V1}/${QuotationPaths.PATH_QUOTATIONS}`,
      {
        params: httpParams,
      }
    );
  }

  public createCase(
    createCaseData: CreateCase
  ): Observable<CreateCaseResponse> {
    return this.http
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

  public importCase(importCase: string): Observable<Quotation> {
    return this.http.put<Quotation>(
      `${ApiVersion.V1}/${QuotationPaths.PATH_QUOTATIONS}`,
      importCase
    );
  }

  public createCustomerCase(
    requestPayload: CreateCustomerCase
  ): Observable<CreateCaseResponse> {
    return this.http
      .post(
        `${ApiVersion.V1}/${QuotationPaths.PATH_CUSTOMER_QUOTATION}`,
        requestPayload
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

  public updateQuotation(
    updateQuotationRequest: UpdateQuotationRequest,
    gqId: number
  ): Observable<Quotation> {
    return this.http.put<Quotation>(
      `${ApiVersion.V1}/${QuotationPaths.PATH_QUOTATIONS}/${gqId}`,
      updateQuotationRequest
    );
  }

  public getCurrencies(): Observable<{ currency: string }[]> {
    return this.http.get<{ currency: string }[]>(
      `${ApiVersion.V1}/${QuotationPaths.PATH_CURRENCIES}`
    );
  }

  public getExchangeRateForCurrency(fromCurrency: string, toCurrency: string) {
    return this.http.get(
      `${ApiVersion.V1}/${QuotationPaths.PATH_CURRENCIES}/${fromCurrency}/exchangeRates/${toCurrency}`
    );
  }
}
