import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { DataService } from '@schaeffler/http';

import { CreateCase, CreateCaseResponse } from '../../../core/store/models';

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
          customerId: createCaseData.customerId,
        };

        return response;
      })
    );
  }

  public importCase(importCase: string): Observable<any> {
    return this.dataService.put(this.path, importCase).pipe(
      map((res: any) => {
        return res.gqId;
      })
    );
  }
}
