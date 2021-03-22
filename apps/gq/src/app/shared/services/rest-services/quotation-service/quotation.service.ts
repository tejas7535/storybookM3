import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { DataService, DeleteOptions } from '@schaeffler/http';

import {
  CreateCase,
  CreateCaseResponse,
  Quotation,
  ViewQuotation,
} from '../../../../core/store/models';

@Injectable({
  providedIn: 'root',
})
export class QuotationService {
  private readonly PATH_UPLOAD_OFFER = 'upload-offer';
  private readonly PATH_QUOTATIONS = 'quotations';

  constructor(private readonly dataService: DataService) {}

  public uploadOfferToSap(gqId: number): Observable<Quotation> {
    return this.dataService.post(`${this.PATH_UPLOAD_OFFER}`, { gqId });
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
          customerId: createCaseData.customer.customerId,
          salesOrg: createCaseData.customer.salesOrg,
        };

        return response;
      })
    );
  }

  public importCase(importCase: string): Observable<Quotation> {
    return this.dataService.put(this.PATH_QUOTATIONS, importCase);
  }
}
