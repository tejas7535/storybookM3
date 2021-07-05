import { Injectable } from '@angular/core';

import { of } from 'rxjs';
import { catchError, map, mergeMap, tap, withLatestFrom } from 'rxjs/operators';

import { Actions, createEffect, ofType } from '@ngrx/effects';
import { ROUTER_NAVIGATED } from '@ngrx/router-store';
import { Store } from '@ngrx/store';

import { AppRoutePath } from '../../../../app-route-path.enum';
import { BearingRoutePath } from '../../../../bearing/bearing-route-path.enum';
import { RestService } from '../../../http/rest.service';
import {
  getGreaseStatus,
  getGreaseStatusFailure,
  getGreaseStatusSuccess,
} from '../../actions/grease-status/grease-status.actions';
import {
  getLoadAssessmentId,
  setLoadAssessmentInterval,
} from '../../actions/load-assessment/load-assessment.actions';
import {
  getBearingLoad,
  getBearingLoadFailure,
  getBearingLoadSuccess,
  getLoadAverage,
  getLoadAverageFailure,
  getLoadAverageSuccess,
} from '../../actions/load-sense/load-sense.actions';
import {
  getShaft,
  getShaftFailure,
  getShaftSuccess,
} from '../../actions/shaft/shaft.actions';
import * as fromRouter from '../../reducers';
import { Interval } from '../../reducers/shared/models';
import { getLoadAssessmentInterval } from '../../selectors/load-assessment/load-assessment.selector';

@Injectable()
export class LoadAssessmentEffects {
  router$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(ROUTER_NAVIGATED),
        map((action: any) => action.payload.routerState.url),
        map((url: string) =>
          Object.values({ ...BearingRoutePath, ...AppRoutePath }).find(
            (route: string) => route !== '' && url.includes(route)
          )
        ),
        tap((currentRoute) => {
          if (currentRoute === BearingRoutePath.LoadAssessmentPath) {
            this.store.dispatch(getLoadAssessmentId());
          }
        })
      );
    },
    { dispatch: false }
  );

  /**
   * Set Interval
   */
  interval$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(setLoadAssessmentInterval),
      map(() => getLoadAssessmentId())
    );
  });

  /**
   * Load Load Assessment Id
   */
  loadAssessmentId$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(getLoadAssessmentId),
        withLatestFrom(this.store.select(fromRouter.getRouterState)),
        map(([_action, routerState]) => ({
          deviceId: routerState.state.params.id,
        })),
        tap(({ deviceId }) => {
          this.store.dispatch(getGreaseStatus({ deviceId }));
          this.store.dispatch(getLoadAverage({ deviceId }));
          this.store.dispatch(getBearingLoad({ deviceId }));
          this.store.dispatch(getShaft({ deviceId }));
        })
      );
    },
    { dispatch: false }
  );

  /**
   * Load Grease Status
   */
  greaseStatus$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(getGreaseStatus),
      withLatestFrom(this.store.select(getLoadAssessmentInterval)),
      map(([action, interval]: [any, Interval]) => ({
        id: action.deviceId,
        ...interval,
      })),
      mergeMap((greaseParams) =>
        this.restService.getGreaseStatus(greaseParams).pipe(
          map((gcmStatus) => getGreaseStatusSuccess({ gcmStatus })),
          catchError((_e) => of(getGreaseStatusFailure()))
        )
      )
    );
  });

  /**
   * Load Load
   */
  load$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(getBearingLoad),
      withLatestFrom(this.store.select(getLoadAssessmentInterval)),
      map(([action, interval]: [any, Interval]) => ({
        id: action.deviceId,
        ...interval,
      })),
      mergeMap((greaseParams) =>
        this.restService.getBearingLoad(greaseParams).pipe(
          map((bearingLoad) => getBearingLoadSuccess({ bearingLoad })),
          catchError((_e) => of(getBearingLoadFailure()))
        )
      )
    );
  });

  /**
   * Load Shaft
   */
  shaft$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(getShaft),
      withLatestFrom(this.store.select(getLoadAssessmentInterval)),
      map(([action, interval]: [any, Interval]) => ({
        id: action.deviceId,
        ...interval,
      })),
      mergeMap((deviceId) =>
        this.restService.getShaft(deviceId).pipe(
          map((shaft) => getShaftSuccess({ shaft })),
          catchError((_e) => of(getShaftFailure()))
        )
      )
    );
  });

  loadAverage$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(getLoadAverage),
      withLatestFrom(this.store.select(getLoadAssessmentInterval)),
      map(([action, interval]: [any, Interval]) => ({
        id: action.deviceId,
        ...interval,
      })),
      mergeMap((greaseParams) =>
        this.restService.getBearingLoadAverage(greaseParams).pipe(
          map(([loadAverage]) => getLoadAverageSuccess({ loadAverage })),
          catchError((_e) => of(getLoadAverageFailure()))
        )
      )
    );
  });

  constructor(
    private readonly actions$: Actions,
    private readonly restService: RestService,
    private readonly store: Store
  ) {}
}
