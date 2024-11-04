import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { map, Observable } from 'rxjs';

import { CriteriaFields } from './model';

@Injectable({
  providedIn: 'root',
})
export class MaterialCustomerService {
  private readonly MATERIAL_CUSTOMER_API = 'api/material-customer';
  private readonly MATERIAL_CUSTOMER_CRITERIA_API =
    'api/material-customer/criteria-fields';
  private readonly MATERIAL_CUSTOMER_DATA_API =
    'api/material-customer/materials';

  constructor(private readonly http: HttpClient) {}

  getTotalMaterialsCountOfCustomer(
    customerNumber: string | undefined = undefined
  ): Observable<number> {
    if (!customerNumber) {
      return new Observable<number>();
    }

    // TODO declare requestBody type for PaginatedFilteredRequest and remove as any[] afterwards
    const requestBody = {
      startRow: 0,
      endRow: 1,
      sortModel: [] as any[],
      columnFilters: [] as any[],
      selectionFilters: { customerNumber: [customerNumber] },
    };

    return this.http
      .post<{
        rowCount: number;
      }>(this.MATERIAL_CUSTOMER_API, requestBody)
      .pipe(map((response) => response.rowCount));
  }

  getCriteriaData(): Observable<CriteriaFields> {
    // TODO Handle error like useSwrNotification
    return this.http.get<CriteriaFields>(this.MATERIAL_CUSTOMER_CRITERIA_API);
  }

  getMaterialCustomerData(selectedIds: string[]): Observable<{
    rows: { materialNumber: string; materialDescription: string }[];
    rowCount: number;
  }> {
    return this.http.post<{
      rows: { materialNumber: string; materialDescription: string }[];
      rowCount: number;
    }>(this.MATERIAL_CUSTOMER_DATA_API, selectedIds);
  }
}
