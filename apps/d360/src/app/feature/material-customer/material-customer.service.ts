import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { map, Observable } from 'rxjs';

import { AgEvent, IServerSideDatasource } from 'ag-grid-community';

import { formatFilterModelForBackend } from '../../shared/ag-grid/grid-filter-model';
import {
  DATA_FETCHED_EVENT,
  FETCH_ERROR_EVENT,
} from '../../shared/utils/datasources';
import { CriteriaFields } from './model';

@Injectable({
  providedIn: 'root',
})
export class MaterialCustomerService {
  get rowCount(): number {
    return this._rowCount;
  }

  private readonly MATERIAL_CUSTOMER_API = 'api/material-customer';
  private readonly MATERIAL_CUSTOMER_CRITERIA_API =
    'api/material-customer/criteria-fields';
  private readonly MATERIAL_CUSTOMER_DATA_API =
    'api/material-customer/materials';

  private _rowCount = 0;

  constructor(private readonly http: HttpClient) {}

  setRowCount(value: number) {
    this._rowCount = value;
  }

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

  createMaterialCustomerDatasource(
    selectionFilters: any,
    predefinedColumnFilters: any,
    materialCustomerService: MaterialCustomerService
  ): IServerSideDatasource {
    const httpClient = this.http;

    return {
      getRows: (params) => {
        const { startRow, endRow, sortModel, filterModel } = params.request;
        const columnFilters = formatFilterModelForBackend(filterModel);

        httpClient
          .post('api/material-customer', {
            startRow,
            endRow,
            sortModel,
            selectionFilters,
            columnFilters: [predefinedColumnFilters, columnFilters].filter(
              (x) => x && Object.keys(x).length > 0
            ),
          })
          .subscribe({
            next: (data: any) => {
              params.success({ rowData: data.rows });
              materialCustomerService.setRowCount(data.rowCount);
              // dispatch custom event when data is loaded, so we can react to it
              params.api.dispatchEvent({ type: DATA_FETCHED_EVENT });
            },
            error: (e) => {
              params.fail();
              params.api.dispatchEvent({
                type: FETCH_ERROR_EVENT,
                error: e,
              } as AgEvent);
            },
          });
      },
    };
  }
}
