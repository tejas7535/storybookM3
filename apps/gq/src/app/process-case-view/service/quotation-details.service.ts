import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { DataService } from '@schaeffler/http';

import {
  AddQuotationDetailsRequest,
  Quotation,
  UpdateQuotationDetail,
} from '../../core/store/models';

@Injectable({
  providedIn: 'root',
})
export class QuotationDetailsService {
  private readonly QUOTATIONS = 'quotations';

  private readonly QUOTATION_DETAILS = 'quotation-details';

  constructor(private readonly dataService: DataService) {}

  public getQuotation(gqId: number): Observable<Quotation> {
    return this.dataService
      .getAll<any>(`${this.QUOTATIONS}/${gqId}`)
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

  public updateMaterial(
    quotationDetails: UpdateQuotationDetail[]
  ): Observable<any> {
    return this.dataService.put(this.QUOTATION_DETAILS, quotationDetails);
  }
}
