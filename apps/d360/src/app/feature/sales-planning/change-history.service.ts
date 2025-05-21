import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import {
  BackendTableResponse,
  RequestParams,
} from '../../shared/components/table';

@Injectable({
  providedIn: 'root',
})
export class ChangeHistoryService {
  private readonly CHANGE_HISTORY_API: string =
    '/api/sales-planning/detailed-customer-sales-plan/change-history';

  private readonly http: HttpClient = inject(HttpClient);

  public getChangeHistory(
    params: RequestParams,
    selectionFilters: any
  ): Observable<BackendTableResponse> {
    return this.http.post<BackendTableResponse>(`${this.CHANGE_HISTORY_API}`, {
      startRow: params.startRow,
      endRow: params.endRow,
      sortModel: params.sortModel,
      selectionFilters,
      columnFilters: params.columnFilters,
    });
  }
}
