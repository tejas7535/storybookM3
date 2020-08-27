import { Injectable } from '@angular/core';

import { of } from 'rxjs';
import {
  catchError,
  filter,
  map,
  mergeMap,
  tap,
  withLatestFrom,
} from 'rxjs/operators';

import { Actions, createEffect, ofType } from '@ngrx/effects';
import { ROUTER_NAVIGATED } from '@ngrx/router-store';
import { select, Store } from '@ngrx/store';

import { BearingRoutePath } from '../../../../bearing/bearing-route-path.enum';
import { DataService } from '../../../http/data.service';
import {
  getGreaseStatus,
  getGreaseStatusFailure,
  getGreaseStatusId,
  getGreaseStatusSuccess,
} from '../../actions';
import * as fromRouter from '../../reducers';
import { getGreaseSensorId } from '../../selectors';

@Injectable()
export class GreaseStatusEffects {
  router$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(ROUTER_NAVIGATED),
        map((action: any) => action.payload.routerState.url),
        map((url: string) =>
          Object.values(BearingRoutePath)
            .filter((route: string) => route !== '' && url.includes(route))
            .shift()
        ),
        filter(
          (currentRoute: string) =>
            currentRoute &&
            (currentRoute === BearingRoutePath.GreaseStatusPath ||
              currentRoute === BearingRoutePath.ConditionMonitoringPath)
        ),
        tap(() => this.store.dispatch(getGreaseStatusId()))
      ),
    { dispatch: false }
  );

  /**
   * Load Grease Status ID
   */
  greaseStatusId$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(getGreaseStatusId.type),
        withLatestFrom(this.store.pipe(select(getGreaseSensorId))),
        map(([_action, greaseStatusId]) => greaseStatusId),
        tap((greaseStatusId) => {
          this.store.dispatch(getGreaseStatus({ greaseStatusId }));
        })
      ),
    { dispatch: false }
  );

  /**
   * Load Grease Status
   */
  greaseStatus$ = createEffect(() =>
    this.actions$.pipe(
      ofType(getGreaseStatus.type),
      map((action: any) => action.greaseStatusId),
      mergeMap((greaseStatusId) =>
        this.dataService.getGreaseStatus(greaseStatusId).pipe(
          map((greaseStatus) => getGreaseStatusSuccess({ greaseStatus })),
          catchError((_e) => of(getGreaseStatusFailure()))
        )
      )
    )
  );

  constructor(
    private readonly actions$: Actions,
    private readonly dataService: DataService,
    private readonly store: Store<fromRouter.AppState>
  ) {}
}
