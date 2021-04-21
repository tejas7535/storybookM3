import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { DataService } from '@schaeffler/http';

import {
  AddQuotationDetailsRequest,
  UpdateQuotationDetail,
} from '../../../../core/store/reducers/process-case/models';
import { Quotation } from '../../../models';
import { QuotationDetail } from '../../../models/quotation-detail';

@Injectable({
  providedIn: 'root',
})
export class QuotationDetailsService {
  private readonly PATH_QUOTATION_DETAILS = 'quotation-details';

  constructor(private readonly dataService: DataService) {}

  public addMaterial(
    tableData: AddQuotationDetailsRequest
  ): Observable<Quotation> {
    return this.dataService
      .post(this.PATH_QUOTATION_DETAILS, tableData)
      .pipe(map((res: any) => res));
  }

  public removeMaterial(qgPositionIds: string[]): Observable<Quotation> {
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      body: qgPositionIds,
    };

    return this.dataService.delete(this.PATH_QUOTATION_DETAILS, options);
  }

  public updateMaterial(
    quotationDetails: UpdateQuotationDetail[]
  ): Observable<QuotationDetail[]> {
    return this.dataService.put(this.PATH_QUOTATION_DETAILS, quotationDetails);
  }
}
