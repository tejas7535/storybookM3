import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { DataService } from '../../core/http/data.service';
import { Quotation } from '../../core/store/models';

@Injectable({
  providedIn: 'root',
})
export class QuotationDetailsService {
  private readonly QUOTATIONS = 'quotations';

  constructor(private readonly dataService: DataService) {}

  public getQuotation(quotationNumber: string): Observable<Quotation> {
    return this.dataService
      .getAll<any>(`${this.QUOTATIONS}/${quotationNumber}`)
      .pipe(map((res: any) => res));
  }
}
