import {
  HttpClient,
  HttpErrorResponse,
  HttpParams,
} from '@angular/common/http';
import { DestroyRef, inject, Injectable } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import {
  Observable,
  of,
  Subject,
  Subscription,
  switchMap,
  take,
  tap,
  timer,
} from 'rxjs';
import { catchError } from 'rxjs/operators';

import { translate } from '@jsverse/transloco';
import {
  IServerSideDatasource,
  IServerSideGetRowsParams,
} from 'ag-grid-enterprise';

import { AppRoutePath } from '../../app.routes.enum';
import { formatFilterModelForBackend } from '../../shared/ag-grid/grid-filter-model';
import { SnackbarService } from '../../shared/utils/service/snackbar.service';
import { CurrencyService } from '../info/currency.service';
import {
  Alert,
  AlertCategory,
  AlertNotificationCount,
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
  openFunction: string;
  alertTypes: Record<string, AlertCategory[]>;
}

@Injectable({
  providedIn: 'root',
})
export class AlertService {
  private readonly http: HttpClient = inject(HttpClient);
  private readonly currencyService: CurrencyService = inject(CurrencyService);
  private readonly snackbarService: SnackbarService = inject(SnackbarService);
  private readonly destroyRef: DestroyRef = inject(DestroyRef);

  private readonly ALERT_HASH_API = 'api/alerts/hash';
  private readonly ALERT_API = 'api/alerts';
  private readonly ALERT_NOTIFICATION_COUNT_API =
    'api/alerts/notification/count';

  private readonly notificationCountChangedEvent =
    new Subject<AlertNotificationCount>();

  private readonly dataFetchedEvent = new Subject<AlertDataResult>();
  private readonly fetchErrorEvent = new Subject<any>();
  private readonly refreshEvent = new Subject<void>();

  private readonly hashTimer = timer(0, 5 * 60 * 1000); // every 5 minutes
  private timerSubscription: Subscription;
  private currentHash: string;

  public constructor() {
    this.updateNotificationCount();
    this.refreshHashTimer();
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

  public getAlertNotificationCount(): Observable<AlertNotificationCount> {
    return this.http.get<AlertNotificationCount>(
      this.ALERT_NOTIFICATION_COUNT_API
    );
  }

  public getNotificationCount(): Observable<AlertNotificationCount> {
    return this.notificationCountChangedEvent.asObservable();
  }

  public getDataFetchedEvent(): Observable<AlertDataResult> {
    return this.dataFetchedEvent.asObservable();
  }

  public getRefreshEvent(): Observable<void> {
    return this.refreshEvent.asObservable();
  }

  public createAlertDatasource(
    selectedStatus: AlertStatus
  ): IServerSideDatasource {
    return {
      getRows: (params: IServerSideGetRowsParams) =>
        this.requestAlerts(params, selectedStatus)
          .pipe(
            tap(({ rows, rowCount }) => {
              params.success({
                rowData: rows,
                rowCount,
              });
              this.dataFetchedEvent.next({ rows, rowCount });
            }),
            catchError((error: HttpErrorResponse) => {
              params.fail();
              this.fetchErrorEvent.next(error);

              return of(error);
            }),
            takeUntilDestroyed(this.destroyRef)
          )
          .subscribe(),
    };
  }

  private requestAlerts(
    params: IServerSideGetRowsParams,
    selectedStatus: AlertStatus,
    openFunction?: string
  ): Observable<AlertDataResult> {
    const { startRow, endRow, sortModel, filterModel } = params.request;

    return this.currencyService.getCurrentCurrency().pipe(
      take(1),
      switchMap((currency: string) => {
        let queryParams = new HttpParams()
          .set('status', selectedStatus)
          .set('currency', currency);
        if (openFunction) {
          queryParams = queryParams.set('openFunction', openFunction);
        }
        const columnFilters = formatFilterModelForBackend(filterModel);

        return this.http.post<AlertDataResult>(
          this.ALERT_API,
          {
            startRow,
            endRow,
            sortModel,
            selectionFilters: {},
            columnFilters: [columnFilters],
          },
          { params: queryParams }
        );
      })
    );
  }

  private readonly groupBy = (input: any[], key: string) =>
    // eslint-disable-next-line unicorn/no-array-reduce
    input.reduce((acc, currentValue) => {
      const groupKey = currentValue[key];
      if (!acc[groupKey]) {
        acc[groupKey] = [];
      }
      acc[groupKey].push(currentValue);

      return acc;
    }, {});

  public createGroupedAlertDatasource(
    selectedStatus: AlertStatus,
    openFunction?: OpenFunction,
    customerNumbers?: string[],
    priorities: Priority[] = []
  ): IServerSideDatasource {
    return {
      getRows: (params: IServerSideGetRowsParams) => {
        this.requestAlerts(params, selectedStatus, openFunction)
          .pipe(
            tap(({ rows }) => {
              let filteredAlerts = rows;
              if (customerNumbers && customerNumbers.length > 0) {
                filteredAlerts = rows.filter((alert) =>
                  customerNumbers?.includes(alert.customerNumber)
                );
              }
              let groupedResult: GroupedAlert[] = [];

              const groupedRows: Record<string, Alert[]> = this.groupBy(
                filteredAlerts,
                'customerNumber'
              );

              Object.entries(groupedRows).forEach(([key, value]) => {
                const groupedByPriority: Record<Priority, Alert[]> =
                  this.groupBy(value, 'alertPriority');
                const typesByPriority: Record<string, AlertCategory[]> = {};
                const countByPriority: Record<string, number> = {};

                Object.entries(groupedByPriority).forEach(
                  ([innerKey, innerValue]) => {
                    countByPriority[innerKey] = innerValue.length;
                    const allTypes = innerValue.map((alert) => alert.type);
                    typesByPriority[innerKey] = [...new Set(allTypes)];
                  }
                );

                groupedResult.push({
                  customerNumber: key,
                  customerName: value[0].customerName,
                  priorityCount: countByPriority,
                  openFunction: value[0].openFunction,
                  alertTypes: typesByPriority,
                });
              });

              groupedResult.sort((a, b) => {
                const priorityA = a.priorityCount || {};
                const priorityB = b.priorityCount || {};

                const compare = (index: Priority) => {
                  if ((priorityA[index] || 0) < (priorityB[index] || 0)) {
                    return 1;
                  } else if (
                    (priorityA[index] || 0) > (priorityB[index] || 0)
                  ) {
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

              groupedResult = groupedResult.filter((alert) => {
                let hasRequestedPriorityTask = false;
                priorities.forEach((requestedPriority) => {
                  hasRequestedPriorityTask =
                    hasRequestedPriorityTask ||
                    alert.priorityCount[requestedPriority] > 0;
                });

                return hasRequestedPriorityTask;
              });

              params.success({
                rowData: groupedResult,
                rowCount: groupedResult.length,
              });
            }),
            catchError((error: HttpErrorResponse) => {
              params.fail();
              this.fetchErrorEvent.next(error);

              return of(error);
            })
          )
          .subscribe();
      },
    };
  }

  public updateNotificationCount() {
    this.getAlertNotificationCount()
      .pipe(
        take(1),
        tap((count) => {
          this.notificationCountChangedEvent.next(count);
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe();
  }

  public refreshHashTimer() {
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
                  .openSnackBar(
                    translate('alert.new_data'),
                    translate('alert.refresh'),
                    15_000
                  )
                  .onAction()
                  .pipe(
                    tap(() => {
                      this.refreshEvent.next();
                    }),
                    takeUntilDestroyed(this.destroyRef)
                  )
                  .subscribe();
                this.currentHash = hash;
              }
            }),
            takeUntilDestroyed(this.destroyRef)
          )
        )
      )
      .subscribe();
  }

  public getRouteForOpenFunction(openFunction: OpenFunction) {
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

  public getModuleForOpenFunction(openFunction: OpenFunction) {
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
