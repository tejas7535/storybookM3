import { HttpClient, HttpContext, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import {
  AddQuotationDetailsRequest,
  UpdateQuotationDetail,
} from '@gq/core/store/active-case/models';
import {
  ComparableLinkedTransaction,
  ExtendedComparableLinkedTransaction,
  ExtendedSapPriceConditionDetail,
  SapPriceConditionDetail,
} from '@gq/core/store/reducers/models';

import { BYPASS_DEFAULT_ERROR_HANDLING } from '../../../http/http-error.interceptor';
import { ApiVersion, Quotation } from '../../../models';
import { MaterialComparableCost } from '../../../models/quotation-detail/material-comparable-cost.model';
import { MaterialSalesOrg } from '../../../models/quotation-detail/material-sales-org.model';

@Injectable({
  providedIn: 'root',
})
export class QuotationDetailsService {
  private readonly PATH_QUOTATION_DETAILS = 'quotation-details';
  private readonly PATH_QUOTATIONS = 'quotations';
  private readonly PATH_TRANSACTIONS = 'comparable-transactions';
  private readonly PATH_MATERIAL_COMPARABLE_COSTS = 'material-comparable-costs';
  private readonly PATH_MATERIAL_STATUS = 'material-status';
  private readonly PATH_SAP_PRICE_DETAILS =
    'material-sap-price-condition-details';
  private readonly PATH_EXTENDED_SAP_PRICE_DETAILS =
    'sap-price-condition-details';

  constructor(private readonly http: HttpClient) {}

  public addQuotationDetails(
    tableData: AddQuotationDetailsRequest
  ): Observable<Quotation> {
    return this.http.post<Quotation>(
      `${ApiVersion.V1}/${this.PATH_QUOTATION_DETAILS}`,
      tableData
    );
  }

  public deleteQuotationDetail(qgPositionIds: string[]): Observable<Quotation> {
    return this.http.delete<Quotation>(
      `${ApiVersion.V1}/${this.PATH_QUOTATION_DETAILS}`,
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
        }),
        body: qgPositionIds,
        context: new HttpContext().set(BYPASS_DEFAULT_ERROR_HANDLING, true),
      }
    );
  }

  public updateQuotationDetail(
    quotationDetails: UpdateQuotationDetail[]
  ): Observable<Quotation> {
    return this.http.put<Quotation>(
      `${ApiVersion.V1}/${this.PATH_QUOTATION_DETAILS}`,
      quotationDetails
    );
  }

  public getTransactions(
    gqPositionId: string
  ): Observable<ComparableLinkedTransaction[]> {
    return this.http.get<ComparableLinkedTransaction[]>(
      `${ApiVersion.V1}/${this.PATH_QUOTATION_DETAILS}/${gqPositionId}/${this.PATH_TRANSACTIONS}`
    );
  }

  public getAllTransactions(
    quotationNumber: number
  ): Observable<ExtendedComparableLinkedTransaction[]> {
    return this.http.get<ExtendedComparableLinkedTransaction[]>(
      `${ApiVersion.V1}/${this.PATH_QUOTATIONS}/${quotationNumber}/${this.PATH_TRANSACTIONS}`
    );
  }

  getMaterialComparableCosts(
    gqPositionId: string
  ): Observable<MaterialComparableCost[]> {
    return this.http.get<MaterialComparableCost[]>(
      `${ApiVersion.V1}/${this.PATH_QUOTATION_DETAILS}/${gqPositionId}/${this.PATH_MATERIAL_COMPARABLE_COSTS}`
    );
  }

  getMaterialStatus(gqPositionId: string): Observable<MaterialSalesOrg> {
    return this.http.get<MaterialSalesOrg>(
      `${ApiVersion.V1}/${this.PATH_QUOTATION_DETAILS}/${gqPositionId}/${this.PATH_MATERIAL_STATUS}`
    );
  }

  getSapPriceDetails(
    gqPositionId: string
  ): Observable<SapPriceConditionDetail[]> {
    return this.http.get<SapPriceConditionDetail[]>(
      `${ApiVersion.V1}/${this.PATH_QUOTATION_DETAILS}/${gqPositionId}/${this.PATH_SAP_PRICE_DETAILS}`
    );
  }

  getExtendedSapPriceConditionDetails(quotationNumber: number) {
    return this.http.get<ExtendedSapPriceConditionDetail[]>(
      `${ApiVersion.V1}/${this.PATH_QUOTATIONS}/${quotationNumber}/${this.PATH_EXTENDED_SAP_PRICE_DETAILS}`
    );
  }
}
