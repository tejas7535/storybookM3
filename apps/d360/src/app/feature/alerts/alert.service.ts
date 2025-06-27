/* eslint-disable max-lines */
import { HttpClient, HttpParams } from '@angular/common/http';
import { DestroyRef, inject, Injectable, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import {
  BehaviorSubject,
  catchError,
  concatMap,
  EMPTY,
  finalize,
  Observable,
  of,
  range,
  retry,
  Subject,
  Subscription,
  switchMap,
  take,
  tap,
  timer,
} from 'rxjs';

import { translate } from '@jsverse/transloco';
import {
  AdvancedFilterModel,
  FilterModel,
  SortModelItem,
} from 'ag-grid-enterprise';

import { AppRoutePath } from '../../app.routes.enum';
import { formatFilterModelForBackend } from '../../shared/ag-grid/grid-filter-model';
import { SelectableValue } from '../../shared/components/inputs/autocomplete/selectable-values.utils';
import {
  BackendTableResponse,
  RequestParams,
} from '../../shared/components/table';
import { SnackbarService } from '../../shared/utils/service/snackbar.service';
import { CurrencyService } from '../info/currency.service';
import {
  Alert,
  AlertCategory,
  AlertStatus,
  OpenFunction,
  Priority,
} from './model';

export interface AlertDataResult {
  rows: Alert[];
  rowCount: number;
}

export interface GroupedAlert {
  customerNumber: string;
  customerName: string;
  priorityCount: Record<string, number>;
  openFunction: OpenFunction;
  alertTypes: Record<string, AlertCategory[]>;
  materialNumbers: Record<string, SelectableValue[]>;
}

@Injectable({ providedIn: 'root' })
export class AlertService {
  private readonly http: HttpClient = inject(HttpClient);
  private readonly currencyService: CurrencyService = inject(CurrencyService);
  private readonly snackbarService: SnackbarService = inject(SnackbarService);
  private readonly destroyRef: DestroyRef = inject(DestroyRef);

  private readonly ALERT_HASH_API = 'api/alerts/hash';
  private readonly ALERT_API = 'api/alerts';

  private readonly fetchErrorEvent = new Subject<any>();
  private readonly loadingEvent = new BehaviorSubject<boolean>(true);
  private readonly refreshEvent = new Subject<void>();

  private readonly hashTimer = timer(0, 60 * 1000); // every  minute
  private timerSubscription: Subscription;
  private currentHash: string;
  private clientSideHash: string;

  public allActiveAlerts = signal<Alert[]>(null);

  public init(): void {
    this.loadActiveAlerts();
    this.refreshHashTimer();
    this.refreshEvent
      .pipe(
        tap(() => this.loadActiveAlerts()),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe();
  }

  /**
   * Loads all active alerts from the backend. If rowCount > 1000 the data is loaded in chunks of 1000 alerts.
   * Sets the data in the allActiveAlerts signal when done.
   * Emits a true value via the fetchErrorEvent when it fails.
   * Emits the loading state via the loadingEvents when loading state changes.
   *
   * @private
   * @return {void}
   * @memberof AlertService
   */
  public loadActiveAlerts(hideLoading: boolean = false): void {
    let alerts: Alert[] = [];
    let hasError = false;
    const chunkSize = 1000;
    if (!hideLoading) {
      this.loadingEvent.next(true);
    }
    this.fetchErrorEvent.next(false);
    this.requestAlerts(
      {
        startRow: 0,
        endRow: chunkSize - 1,
        sortModel: [],
        filterModel: [],
      },
      AlertStatus.ACTIVE
    )
      .pipe(
        retry(2),
        catchError(() => {
          hasError = true;

          return EMPTY;
        }),
        switchMap((firstResult) => {
          const rowCount = firstResult.rowCount;
          alerts = firstResult.rows;

          if (rowCount > chunkSize) {
            const numberOfRequests = Math.ceil(
              (rowCount - chunkSize) / chunkSize
            );

            return range(1, numberOfRequests);
          } else {
            return EMPTY;
          }
        }),
        concatMap((value) => {
          const startRow = value * chunkSize;
          const endRow = startRow + chunkSize - 1;

          return this.requestAlerts(
            {
              startRow,
              endRow,
              sortModel: [],
              filterModel: [],
            },
            AlertStatus.ACTIVE
          );
        }),

        catchError(() => {
          this.fetchErrorEvent.next(true);
          hasError = true;

          return of(null);
        }),
        tap((alertDataResult) => {
          alerts = [...alerts, ...(alertDataResult?.rows || [])];
        }),
        finalize(() => {
          if (hasError) {
            this.snackbarService.error(translate('error.loading_failed'));
            this.fetchErrorEvent.next(true);
            this.allActiveAlerts.set([]);
          } else {
            this.allActiveAlerts.set(alerts);
          }
          this.loadingEvent.next(false);
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe();
  }

  public completeAlert(alertId: string): Observable<any> {
    return this.http.post(`api/alerts/${alertId}/complete`, {});
  }

  public activateAlert(alertId: string): Observable<any> {
    return this.http.post(`api/alerts/${alertId}/activate`, {});
  }

  public deactivateAlert(alertId: string): Observable<any> {
    return this.http.post(`api/alerts/${alertId}/deactivate`, {});
  }

  public getAlertHash(): Observable<string> {
    // @ts-expect-error responseType 'text'
    return this.http.get<string>(this.ALERT_HASH_API, { responseType: 'text' });
  }

  public getFetchErrorEvent(): Observable<boolean> {
    return this.fetchErrorEvent.asObservable();
  }

  public getRefreshEvent(): Observable<void> {
    return this.refreshEvent.asObservable();
  }

  public getLoadingEvent(): Observable<boolean> {
    return this.loadingEvent.asObservable();
  }

  public getAlertData(
    selectedStatus: AlertStatus,
    selectedPriorities: Priority[],
    params: RequestParams
  ): Observable<BackendTableResponse> {
    return this.currencyService.getCurrentCurrency().pipe(
      take(1),
      switchMap((currency: string) => {
        const queryParams = new HttpParams()
          .set('status', selectedStatus)
          .set('currency', currency);

        return this.http.post<BackendTableResponse>(
          this.ALERT_API,
          {
            startRow: params.startRow,
            endRow: params.endRow,
            sortModel: params.sortModel,
            columnFilters: params.columnFilters,
            selectionFilters: { alertPriority: selectedPriorities },
          },
          { params: queryParams }
        );
      })
    );
  }

  private requestAlerts(
    requestParams: {
      startRow: number | undefined;
      endRow: number | undefined;
      filterModel: FilterModel | AdvancedFilterModel | null;
      sortModel: SortModelItem[];
    },
    selectedStatus: AlertStatus,
    selectedPriorities?: Priority[]
  ): Observable<AlertDataResult> {
    const { startRow, endRow, sortModel, filterModel } = requestParams;

    return this.currencyService.getCurrentCurrency().pipe(
      take(1),
      switchMap((currency: string) => {
        const queryParams = new HttpParams()
          .set('status', selectedStatus)
          .set('currency', currency);
        const columnFilters = formatFilterModelForBackend(filterModel);

        return this.http.post<AlertDataResult>(
          this.ALERT_API,
          {
            startRow,
            endRow,
            sortModel,
            selectionFilters: { alertPriority: selectedPriorities },
            columnFilters: [columnFilters],
          },
          { params: queryParams }
        );
      })
    );
  }

  private readonly groupBy = (input: any[], key: string) =>
    // eslint-disable-next-line unicorn/no-array-reduce
    input?.reduce((acc, currentValue) => {
      const groupKey = currentValue[key];
      if (!acc[groupKey]) {
        acc[groupKey] = [];
      }
      acc[groupKey].push(currentValue);

      return acc;
    }, {});

  public groupDataByCustomerAndPriority = (rows: Alert[]) => {
    const filteredAlerts = rows;
    const groupedResult: GroupedAlert[] = [];

    const groupedRows: Record<string, Alert[]> = this.groupBy(
      filteredAlerts,
      'customerNumber'
    );

    Object.entries(groupedRows).forEach(([key, value]) => {
      const groupedByPriority: Record<Priority, Alert[]> = this.groupBy(
        value,
        'alertPriority'
      );
      const typesByPriority: Record<string, AlertCategory[]> = {};
      const countByPriority: Record<string, number> = {};
      const materialByPriority: Record<string, SelectableValue[]> = {};

      Object.entries(groupedByPriority).forEach(([innerKey, innerValue]) => {
        countByPriority[innerKey] = innerValue.length;
        const allTypes = innerValue.map((alert) => alert.type);
        typesByPriority[innerKey] = [...new Set(allTypes)];
      });

      Object.entries(groupedByPriority).forEach(([innerKey, innerValue]) => {
        const allMaterials = innerValue
          .map((alert) => ({
            id: alert.materialNumber,
            text: alert.materialDescription,
          }))
          .filter(
            (
              selectableValue: SelectableValue,
              index: number,
              array: SelectableValue[]
            ) =>
              array.findIndex(
                (arrayValue) => selectableValue.id === arrayValue.id
              ) === index
          );
        materialByPriority[innerKey] = [...new Set(allMaterials)];
      });

      groupedResult.push({
        customerNumber: key,
        customerName: value[0].customerName,
        priorityCount: countByPriority,
        openFunction: value[0].openFunction,
        alertTypes: typesByPriority,
        materialNumbers: materialByPriority,
      });
    });

    groupedResult.sort((a, b) => {
      const priorityA = a.priorityCount || {};
      const priorityB = b.priorityCount || {};

      const compare = (index: Priority) => {
        if ((priorityA[index] || 0) < (priorityB[index] || 0)) {
          return 1;
        } else if ((priorityA[index] || 0) > (priorityB[index] || 0)) {
          return -1;
        } else {
          return 0;
        }
      };

      return (
        compare(Priority.Priority1) ||
        compare(Priority.Priority2) ||
        compare(Priority.Priority3) ||
        0
      );
    });

    return groupedResult;
  };

  public refreshHashTimer(): void {
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
      this.currentHash = undefined;
    }

    this.timerSubscription = this.hashTimer
      .pipe(
        switchMap(() =>
          this.getAlertHash().pipe(
            tap((hash) => {
              if (this.currentHash === undefined) {
                this.currentHash = hash;
              }
              if (this.currentHash !== hash) {
                this.snackbarService
                  .info(translate('alert.new_data'), undefined, {
                    timeOut: 15_000,
                    payload: { buttonName: translate('alert.refresh') },
                  })
                  .onTap.pipe(
                    take(1),
                    tap(() => this.refreshEvent.next()),
                    takeUntilDestroyed(this.destroyRef)
                  )
                  .subscribe();
                this.currentHash = hash;
              }
              if (this.clientSideHash !== hash) {
                this.loadActiveAlerts(true);
                this.clientSideHash = hash;
              }
            }),
            takeUntilDestroyed(this.destroyRef)
          )
        )
      )
      .subscribe();
  }

  public getRouteForOpenFunction(
    openFunction: OpenFunction
  ): AppRoutePath | '/' {
    switch (openFunction) {
      case OpenFunction.Validation_Of_Demand: {
        return AppRoutePath.DemandValidationPage;
      }
      case OpenFunction.Customer_Material_Portfolio: {
        return AppRoutePath.CustomerMaterialPortfolioPage;
      }
      default: {
        return '/';
      }
    }
  }

  public getModuleForOpenFunction(openFunction: OpenFunction): string {
    switch (openFunction) {
      case OpenFunction.Validation_Of_Demand: {
        return translate('validation_of_demand.title');
      }
      case OpenFunction.Customer_Material_Portfolio: {
        return translate('customer_material_portfolio.title');
      }
      default: {
        return openFunction;
      }
    }
  }
}
