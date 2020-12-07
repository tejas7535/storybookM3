import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { DataService } from '@schaeffler/http';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { AddQuotationDetailsRequest, Quotation } from '../../core/store/models';

@Injectable({
  providedIn: 'root',
})
export class QuotationDetailsService {
  private readonly QUOTATIONS = 'quotations';

  private readonly QUOTATION_DETAILS = 'quotation-details';

  constructor(private readonly dataService: DataService) {}

  public getQuotation(quotationNumber: string): Observable<Quotation> {
    return this.dataService
      .getAll<any>(`${this.QUOTATIONS}/${quotationNumber}`)
      .pipe(map((res: any) => res));
  }

  public addMaterial(
    tableData: AddQuotationDetailsRequest
  ): Observable<Quotation> {
    return this.dataService
      .post(this.QUOTATION_DETAILS, tableData)
      .pipe(map((res: any) => res));
  }

  public removeMaterial(qgPositionIds: string[]): Observable<Quotation> {
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      body: qgPositionIds,
    };

    return this.dataService.delete(this.QUOTATION_DETAILS, options);
  }
}
