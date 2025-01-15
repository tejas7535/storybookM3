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

import { formatFilterModelForBackend } from '../../shared/ag-grid/grid-filter-model';
import { SnackbarService } from '../../shared/utils/service/snackbar.service';
import { CurrencyService } from '../info/currency.service';
import { Alert, AlertNotificationCount, AlertStatus } from './model';

export interface AlertDataResult {
  rows: Alert[];
  rowCount: number;
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

  constructor() {
    this.updateNotificationCount();
    this.refreshHashTimer();
  }

  completeAlert(alertId: string): Observable<any> {
    return this.http.post(`api/alerts/${alertId}/complete`, {});
  }

  activateAlert(alertId: string): Observable<any> {
    return this.http.post(`api/alerts/${alertId}/activate`, {});
  }

  deactivateAlert(alertId: string): Observable<any> {
    return this.http.post(`api/alerts/${alertId}/deactivate`, {});
  }

  getAlertHash(): Observable<string> {
    // @ts-expect-error responseType 'text'
    return this.http.get<string>(this.ALERT_HASH_API, { responseType: 'text' });
  }

  getAlertNotificationCount(): Observable<AlertNotificationCount> {
    return this.http.get<AlertNotificationCount>(
      this.ALERT_NOTIFICATION_COUNT_API
    );
  }

  getNotificationCount(): Observable<AlertNotificationCount> {
    return this.notificationCountChangedEvent.asObservable();
  }

  getDataFetchedEvent(): Observable<AlertDataResult> {
    return this.dataFetchedEvent.asObservable();
  }

  getRefreshEvent(): Observable<void> {
    return this.refreshEvent.asObservable();
  }

  createAlertDatasource(selectedStatus: AlertStatus): IServerSideDatasource {
    return {
      getRows: (params: IServerSideGetRowsParams) => {
        const { startRow, endRow, sortModel, filterModel } = params.request;
        this.currencyService
          .getCurrentCurrency()
          .pipe(
            take(1),
            switchMap((currency: string) => {
              const queryParams = new HttpParams()
                .set('status', selectedStatus)
                .set('currency', currency);
              const columnFilters = formatFilterModelForBackend(filterModel);

              return this.http
                .post<AlertDataResult>(
                  `api/alerts`,
                  {
                    startRow,
                    endRow,
                    sortModel,
                    selectionFilters: {},
                    columnFilters: [columnFilters],
                  },
                  { params: queryParams }
                )
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
                  })
                );
            })
          )
          .subscribe();
      },
    };
  }

  updateNotificationCount() {
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

  refreshHashTimer() {
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
}
