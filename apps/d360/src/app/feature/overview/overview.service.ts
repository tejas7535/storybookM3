import { HttpClient, HttpParams } from '@angular/common/http';
import { DestroyRef, inject, Injectable } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import {
  BehaviorSubject,
  catchError,
  EMPTY,
  Observable,
  switchMap,
  take,
  tap,
} from 'rxjs';

import { translate } from '@jsverse/transloco';
import {
  AdvancedFilterModel,
  FilterModel,
  IServerSideDatasource,
  IServerSideGetRowsParams,
  SortModelItem,
} from 'ag-grid-enterprise';

import { CustomerSalesPlanningData } from '../../pages/overview/components/customer-sales-planning-grid/customer-sales-planning-grid.component';
import { formatFilterModelForBackend } from '../../shared/ag-grid/grid-filter-model';
import { CurrencyService } from '../info/currency.service';

export interface CustomerSalesPlanningResult {
  rows: CustomerSalesPlanningData[];
  rowCount: number;
}

@Injectable({
  providedIn: 'root',
})
export class OverviewService {
  private readonly SALES_PLANNING_OVERVIEW_API: string =
    'api/sales-planning/overview';
  private readonly http: HttpClient = inject(HttpClient);
  private readonly currencyService: CurrencyService = inject(CurrencyService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly fetchErrorEvent: BehaviorSubject<{ message: string }> =
    new BehaviorSubject<{
      message: string;
    }>(null);
  public readonly dataFetchedEvent: BehaviorSubject<CustomerSalesPlanningResult> =
    new BehaviorSubject({
      rows: [],
      rowCount: 0,
    });

  public getSalesPlanningOverview(
    requestParams: {
      startRow: number | undefined;
      endRow: number | undefined;
      filterModel: FilterModel | AdvancedFilterModel | null;
      sortModel: SortModelItem[];
    },
    isAssignedToMe: boolean,
    gkamNumbers: string[],
    customers: string[]
  ): Observable<CustomerSalesPlanningResult> {
    const { startRow, endRow, sortModel, filterModel } = requestParams;

    return this.currencyService.getCurrentCurrency().pipe(
      take(1),
      switchMap((currency: string) => {
        const params = new HttpParams()
          .set('isCustomerNumberAssignedToMe', isAssignedToMe)
          .set('currency', currency);

        const columnFilters = formatFilterModelForBackend(filterModel);

        return this.http.post<CustomerSalesPlanningResult>(
          `${this.SALES_PLANNING_OVERVIEW_API}`,
          {
            startRow,
            endRow,
            sortModel,
            selectionFilters: {
              keyAccountNumber: gkamNumbers,
              customerNumber: customers,
            },
            columnFilters: [columnFilters],
          },
          { params }
        );
      }),
      takeUntilDestroyed(this.destroyRef)
    );
  }

  public createCustomerSalesPlanningDatasource(
    isAssignedToMe: boolean,
    gkamNumbers: string[],
    customers: string[]
  ): IServerSideDatasource {
    return {
      getRows: (
        params: IServerSideGetRowsParams<CustomerSalesPlanningData>
      ) => {
        this.fetchErrorEvent.next(null);
        this.getSalesPlanningOverview(
          params.request,
          isAssignedToMe,
          gkamNumbers,
          customers
        )
          .pipe(
            tap((data: CustomerSalesPlanningResult) => {
              params.success({
                rowData: data.rows,
                rowCount: data.rowCount,
              });
              this.dataFetchedEvent.next(data);
            }),
            catchError((error: any) => {
              this.dataFetchedEvent.next({ rows: [], rowCount: 0 });
              if (error?.details?.values?.['x-sap-messagenumber'] === '133') {
                params.success({
                  rowData: [],
                  rowCount: 0,
                });
                this.fetchErrorEvent.next({
                  message: translate('hint.selectData'),
                });
              } else {
                params.fail();
              }

              return EMPTY;
            }),
            takeUntilDestroyed(this.destroyRef)
          )
          .subscribe();
      },
    };
  }
  public getDataFetchedEvent(): BehaviorSubject<CustomerSalesPlanningResult> {
    return this.dataFetchedEvent;
  }

  public getFetchErrorEvent(): BehaviorSubject<{ message: string }> {
    return this.fetchErrorEvent;
  }
}
