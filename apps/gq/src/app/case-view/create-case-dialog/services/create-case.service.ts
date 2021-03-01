import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { DataService } from '@schaeffler/http';

import {
  CreateCase,
  CreateCaseResponse,
  Quotation,
} from '../../../core/store/models';

@Injectable({
  providedIn: 'root',
})
export class CreateCaseService {
  private readonly path = 'quotations';

  constructor(private readonly dataService: DataService) {}

  public createCase(createCaseData: CreateCase): Observable<any> {
    return this.dataService.post(this.path, createCaseData).pipe(
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
    return this.dataService.put(this.path, importCase);
  }
}
