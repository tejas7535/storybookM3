import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable, of } from 'rxjs';
import { delay, map } from 'rxjs/operators';

import {
  CreateCase,
  CreateCaseResponse,
} from '../../../../core/store/reducers/create-case/models';
import { QuotationSearchResult } from '../../../../shared/models/quotation';
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

  public updateCases(
    gqIds: number[],
    status: QuotationStatus
  ): Observable<any> {
    const requestBody: any = {
      status,
      gqIds,
    };

    return this.http.put(
      `${ApiVersion.V1}/${QuotationPaths.PATH_QUOTATIONS_STATUS}`,
      requestBody
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

  public createSapQuotation(
    gqId: number,
    gqPositionIds: string[]
  ): Observable<Quotation> {
    const requestBody: { gqId: number; gqPositionIds: string[] } = {
      gqId,
      gqPositionIds,
    };

    return this.http.post<Quotation>(
      `${ApiVersion.V1}/${QuotationPaths.PATH_SAP_QUOTATION}`,
      requestBody
    );
  }

  // TODO: remove underscore when calling the BE service
  public getCasesByMaterialNumber(
    _materialNumber: string
  ): Observable<QuotationSearchResult[]> {
    const result: QuotationSearchResult[] = [
      {
        gqId: 46_406,
        customerName:
          'namejdlajsd ajldajsld jalskdjiowe roijdmdalsjdoi ajdlasj do ijwoeijoi ',
        customerNumber: '2005',
        salesOrg: '0615',
        customerCurrency: 'EUR',
        priceOfMaterial: 24.3,
        quantityOfMaterial: 4,
        gpi: 24.3,
        status: QuotationStatus.ACTIVE,
      },
      {
        gqId: 46_406,
        customerName: 'name',
        customerNumber: '2005',
        customerCurrency: 'EUR',
        salesOrg: '0615',
        priceOfMaterial: 24.3,
        quantityOfMaterial: 4,
        gpi: 24.3,
        status: QuotationStatus.ACTIVE,
      },
      {
        gqId: 46_406,
        customerName: 'name',
        customerNumber: '2005',
        customerCurrency: 'EUR',
        salesOrg: '0615',
        priceOfMaterial: 24.3,
        quantityOfMaterial: 4,
        gpi: 24.3,
        status: QuotationStatus.ACTIVE,
      },
      {
        gqId: 46_406,
        customerName: 'name',
        customerNumber: '2005',
        customerCurrency: 'AMD',
        salesOrg: '0615',
        priceOfMaterial: 24.3,
        quantityOfMaterial: 4,
        gpi: 24.3,
        status: QuotationStatus.ACTIVE,
      },
      {
        gqId: 46_406,
        customerName: 'name',
        customerNumber: '2005',
        customerCurrency: 'BYN',
        salesOrg: '0615',
        priceOfMaterial: 24.3,
        quantityOfMaterial: 4,
        gpi: 24.3,
        status: QuotationStatus.ACTIVE,
      },
      {
        gqId: 46_406,
        customerName: 'name',
        customerNumber: '2005',
        customerCurrency: 'BYN',
        salesOrg: '0615',
        priceOfMaterial: 24.3,
        quantityOfMaterial: 4,
        gpi: 24.3,
        status: QuotationStatus.ACTIVE,
      },
      {
        gqId: 46_406,
        customerName: 'name',
        customerNumber: '2005',
        customerCurrency: 'BYN',
        salesOrg: '0615',
        priceOfMaterial: 24.3,
        quantityOfMaterial: 4,
        gpi: 24.3,
        status: QuotationStatus.ACTIVE,
      },
      {
        gqId: 46_406,
        customerName: 'name',
        customerNumber: '2005',
        customerCurrency: 'USD',
        salesOrg: '0615',
        priceOfMaterial: 24.3,
        quantityOfMaterial: 4,
        gpi: 24.3,
        status: QuotationStatus.ACTIVE,
      },
      {
        gqId: 46_406,
        customerName: 'name',
        customerNumber: '2005',
        customerCurrency: 'USD',
        salesOrg: '0615',
        priceOfMaterial: 24.3,
        quantityOfMaterial: 4,
        gpi: 24.3,
        status: QuotationStatus.ACTIVE,
      },
      {
        gqId: 46_406,
        customerName: 'name',
        customerNumber: '2005',
        customerCurrency: 'USD',
        salesOrg: '0615',
        priceOfMaterial: 24.3,
        quantityOfMaterial: 4,
        gpi: 24.3,
        status: QuotationStatus.ACTIVE,
      },
      {
        gqId: 46_406,
        customerName: 'name',
        customerNumber: '2005',
        customerCurrency: 'PLN',
        salesOrg: '0615',
        priceOfMaterial: 24.3,
        quantityOfMaterial: 4,
        gpi: 24.3,
        status: QuotationStatus.ACTIVE,
      },
      {
        gqId: 46_406,
        customerName: 'name',
        customerNumber: '2005',
        customerCurrency: 'PLN',
        salesOrg: '0615',
        priceOfMaterial: 24.3,
        quantityOfMaterial: 4,
        gpi: 24.3,
        status: QuotationStatus.ACTIVE,
      },
    ];

    return of(result).pipe(delay(2000));
  }
}
