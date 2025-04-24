import { HttpClient } from '@angular/common/http';
import { DestroyRef, inject, Injectable } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import {
  BehaviorSubject,
  catchError,
  EMPTY,
  Observable,
  take,
  tap,
} from 'rxjs';

import {
  AdvancedFilterModel,
  FilterModel,
  IServerSideDatasource,
  IServerSideGetRowsParams,
  SortModelItem,
} from 'ag-grid-enterprise';

import { formatFilterModelForBackend } from '../../shared/ag-grid/grid-filter-model';
import { PaginatedFilteredResponse } from '../../shared/models/paginated-filtered-request';
import { ChangeHistoryData } from './model';

@Injectable({
  providedIn: 'root',
})
export class ChangeHistoryService {
  private readonly CHANGE_HISTORY_API: string =
    '/api/sales-planning/detailed-customer-sales-plan/change-history';

  private readonly http: HttpClient = inject(HttpClient);
  private readonly destroyRef: DestroyRef = inject(DestroyRef);
  public readonly dataChangedEvent: BehaviorSubject<
    PaginatedFilteredResponse<ChangeHistoryData>
  > = new BehaviorSubject<PaginatedFilteredResponse<ChangeHistoryData>>({
    rows: [],
    rowCount: 0,
  });

  public getChangeHistory(
    requestParams: {
      startRow: number | undefined;
      endRow: number | undefined;
      filterModel: FilterModel | AdvancedFilterModel | null;
      sortModel: SortModelItem[];
    },
    customerNumber: string
  ): Observable<PaginatedFilteredResponse<ChangeHistoryData>> {
    const { startRow, endRow, sortModel, filterModel } = requestParams;

    return this.http.post<PaginatedFilteredResponse<ChangeHistoryData>>(
      `${this.CHANGE_HISTORY_API}`,
      {
        sortModel,
        selectionFilters: { customerNumber: [customerNumber] },
        columnFilters: [formatFilterModelForBackend(filterModel)],
        startRow,
        endRow,
      }
    );
  }

  public createChangeHistoryDatasource(
    customerNumber: string
  ): IServerSideDatasource {
    return {
      getRows: (params: IServerSideGetRowsParams) =>
        this.getChangeHistory(params.request, customerNumber)
          .pipe(
            take(1),
            tap((result: PaginatedFilteredResponse<ChangeHistoryData>) => {
              params.success({
                rowData: result.rows,
                rowCount: result.rowCount,
              });
              this.dataChangedEvent.next(result);
            }),
            catchError(() => {
              params.fail();

              return EMPTY;
            }),
            takeUntilDestroyed(this.destroyRef)
          )
          .subscribe(),
    };
  }
}
