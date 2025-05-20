import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { CriteriaFields } from './model';

@Injectable({ providedIn: 'root' })
export class MaterialCustomerService {
  private readonly MATERIAL_CUSTOMER_CRITERIA_API =
    'api/material-customer/criteria-fields';
  private readonly MATERIAL_CUSTOMER_DATA_API =
    'api/material-customer/materials';

  private readonly http: HttpClient = inject(HttpClient);

  public getCriteriaData(): Observable<CriteriaFields> {
    // TODO Handle error like useSwrNotification
    return this.http.get<CriteriaFields>(this.MATERIAL_CUSTOMER_CRITERIA_API);
  }

  public getMaterialCustomerData(selectedIds: string[]): Observable<{
    rows: { materialNumber: string; materialDescription: string }[];
    rowCount: number;
  }> {
    return this.http.post<{
      rows: { materialNumber: string; materialDescription: string }[];
      rowCount: number;
    }>(this.MATERIAL_CUSTOMER_DATA_API, selectedIds);
  }
}
