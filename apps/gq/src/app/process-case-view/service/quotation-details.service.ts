import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { DataService } from '../../core/http/data.service';
import { QuotationDetails } from '../../core/store/models';

@Injectable({
  providedIn: 'root',
})
export class QuotationDetailsService {
  private readonly QUOTATION_DETAILS = 'quotation-details';

  constructor(private readonly dataService: DataService) {}

  public quotationDetails(
    quotationNumber: string
  ): Observable<QuotationDetails[]> {
    return this.dataService
      .getAll<any>(`${this.QUOTATION_DETAILS}/${quotationNumber}`)
      .pipe(map((res: any) => res.items));
  }
}
