import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import {
  BackendTableResponse,
  RequestParams,
} from '../../../../shared/components/table/interfaces';

@Injectable()
export class MaterialCustomerTableService {
  private readonly MATERIAL_CUSTOMER_API = 'api/material-customer';
  private readonly http: HttpClient = inject(HttpClient);

  public getMaterialCustomerData(
    selectionFilters: any,
    params: RequestParams
  ): Observable<BackendTableResponse> {
    return this.http.post<BackendTableResponse>(this.MATERIAL_CUSTOMER_API, {
      startRow: params.startRow,
      endRow: params.endRow,
      sortModel: params.sortModel,
      selectionFilters,
      columnFilters: params.columnFilters,
    });
  }
}
