import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { DataService, GetOptions } from '@schaeffler/http';

import { SalesOrg } from '../../../core/store/models';

@Injectable({
  providedIn: 'root',
})
export class SalesOrgsService {
  private readonly PARAM_CUSTOMER_ID = 'customer_id';
  private readonly GET_SALES_ORGS = 'sales-orgs';

  constructor(private readonly dataService: DataService) {}

  public getSalesOrgs(customerId: string): Observable<SalesOrg[]> {
    const httpParams = new HttpParams().set(this.PARAM_CUSTOMER_ID, customerId);
    const options: GetOptions = {
      params: httpParams,
    };

    return this.dataService
      .getAll<string[]>(`${this.GET_SALES_ORGS}`, options)
      .pipe(
        map((res: string[]) =>
          res.map((el, index) => ({ id: el, selected: index === 0 }))
        )
      );
  }
}
