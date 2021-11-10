import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { DataService, DeleteOptions } from '@schaeffler/http';

import { ViewQuotation } from '../../../../case-view/models/view-quotation.model';
import {
  CreateCase,
  CreateCaseResponse,
} from '../../../../core/store/reducers/create-case/models';
import { Quotation } from '../../../models';
import { CreateCustomerCase } from '../search-service/models/create-customer-case.model';

@Injectable({
  providedIn: 'root',
})
export class QuotationService {
  private readonly PATH_UPLOAD_SELECTION = 'upload-selection';
  private readonly PATH_REFRESH_SAP_PRICING = 'refresh-sap-price';
  private readonly PATH_QUOTATIONS = 'quotations';
  private readonly PATH_CUSTOMER_QUOTATION = 'customers/quotations';

  constructor(private readonly dataService: DataService) {}

  public uploadSelectionToSap(gqPositionIds: string[]): Observable<Quotation> {
    return this.dataService.post(`${this.PATH_UPLOAD_SELECTION}`, {
      gqPositionIds,
    });
  }
  public refreshSapPricing(gqId: number): Observable<Quotation> {
    return this.dataService.getAll(
      `${this.PATH_QUOTATIONS}/${gqId}/${this.PATH_REFRESH_SAP_PRICING}`
    );
  }

  public deleteCases(gqId: string[]): Observable<any> {
    const options: DeleteOptions = {
      body: gqId,
    };

    return this.dataService.delete(`${this.PATH_QUOTATIONS}`, options);
  }

  public getQuotation(gqId: number): Observable<Quotation> {
    return this.dataService.getAll<Quotation>(
      `${this.PATH_QUOTATIONS}/${gqId}`
    );
  }

  public getCases(): Observable<ViewQuotation[]> {
    return this.dataService.getAll<ViewQuotation[]>(`${this.PATH_QUOTATIONS}`);
  }

  public createCase(
    createCaseData: CreateCase
  ): Observable<CreateCaseResponse> {
    return this.dataService.post(this.PATH_QUOTATIONS, createCaseData).pipe(
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
    return this.dataService.put(this.PATH_QUOTATIONS, importCase);
  }

  public createCustomerCase(
    requestPayload: CreateCustomerCase
  ): Observable<CreateCaseResponse> {
    return this.dataService
      .post(this.PATH_CUSTOMER_QUOTATION, requestPayload)
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
}
