import { Injectable } from '@angular/core';

import { forkJoin, of } from 'rxjs';
import {
  catchError,
  debounceTime,
  filter,
  map,
  mergeMap,
  withLatestFrom,
} from 'rxjs/operators';

import { Actions, createEffect, ofType } from '@ngrx/effects';
import { ROUTER_NAVIGATED } from '@ngrx/router-store';
import { Store } from '@ngrx/store';

import { AppRoutePath } from '../../../../app-route-path.enum';
import { BearingRoutePath } from '../../../../bearing/bearing-route-path.enum';
import { RestService } from '../../../http/rest.service';
import {
  getLoadAssessmentDataFailure,
  getLoadAssessmentDataSuccess,
  getLoadAssessmentId,
  setLoadAssessmentInterval,
} from '../../actions/load-assessment/load-assessment.actions';
import {
  getBearingLoad,
  getBearingLoadFailure,
  getBearingLoadSuccess,
  getLoadAverage,
} from '../../actions/load-sense/load-sense.actions';
import * as fromRouter from '../../reducers';
import { Interval } from '../../reducers/shared/models';
import { getLoadAssessmentInterval } from '../../selectors/load-assessment/load-assessment.selector';
import { actionInterval } from '../utils';
import { LegacyAPIService } from '../../../http/legacy.service';
import {
  getLoadDistributionLatestSuccess,
  getCenterLoad,
  getCenterLoadSuccess,
  getCenterLoadFailure,
} from '../..';
@Injectable()
export class LoadAssessmentEffects {
  router$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ROUTER_NAVIGATED),
      map((action: any) => action.payload.routerState.url),
      map((url: string) =>
        Object.values({ ...BearingRoutePath, ...AppRoutePath }).find(
          (route: string) => route !== '' && url.includes(route)
        )
      ),
      filter(
        (currentRoute) => currentRoute === BearingRoutePath.LoadAssessmentPath
      ),
      map(() => getLoadAssessmentId())
    );
  });

  /**
   * Set Interval
   */
  interval$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(setLoadAssessmentInterval),
      debounceTime(500),
      map(() => getLoadAssessmentId())
    );
  });

  /**
   * Load Load Assessment Id for the line chart
   */
  loadAssessmentId$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(getLoadAssessmentId),
      withLatestFrom(this.store.select(fromRouter.getRouterState)),
      map(([_action, routerState]) => ({
        id: routerState.state.params.id,
      })),
      withLatestFrom(this.store.select(getLoadAssessmentInterval)),
      map(([_action, interval]) => ({
        ..._action,
        start: interval.startDate,
        end: interval.endDate,
      })),
      mergeMap((params) =>
        this.restService.getLoadAssessmentDistribution(params).pipe(
          map((data) =>
            data.sort(
              (a, b) =>
                new Date(b.timestamp).getTime() -
                new Date(a.timestamp).getTime()
            )
          ),
          map((data) => getLoadAssessmentDataSuccess({ data })),
          catchError((_e) => of(getLoadAssessmentDataFailure()))
        )
      )
    );
  });

  /**
   * Used by the line chart of the load assessment page
   */
  load$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(getBearingLoad),
      withLatestFrom(this.store.select(getLoadAssessmentInterval)),
      map(([action, interval]: [any, Interval]) => ({
        id: action.deviceId,
        start: interval.startDate,
        end: interval.endDate,
      })),
      mergeMap((greaseParams) =>
        this.legacyAPIService.getBearingLoad(greaseParams).pipe(
          map((bearingLoad) =>
            bearingLoad.sort(
              (a, b) =>
                new Date(b.timestamp).getTime() -
                new Date(a.timestamp).getTime()
            )
          ),
          map((bearingLoad) => getBearingLoadSuccess({ bearingLoad })),
          catchError((_e) => of(getBearingLoadFailure()))
        )
      )
    );
  });

  loadAverage$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(getLoadAverage),
      withLatestFrom(this.store.select(getLoadAssessmentInterval)),
      map(actionInterval()),
      mergeMap(({ id, start, end }) =>
        forkJoin([
          this.legacyAPIService.getLoadDistributionAverage({
            id,
            start,
            end,
            row: 1,
          }),
          this.legacyAPIService.getLoadDistributionAverage({
            id,
            start,
            end,
            row: 2,
          }),
          this.legacyAPIService.getBearingLoadAverage({
            id,
            start,
            end,
          }),
        ]).pipe(
          map(([result, result2, _result3]) =>
            getLoadDistributionLatestSuccess({
              row1: result.shift(),
              row2: result2.shift(),
              lsp: _result3.shift(),
            })
          )
        )
      )
    );
  });
  /**
   * Used by the line chart of the load assessment page
   */
  loadCenterLoad$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(getCenterLoad),
      withLatestFrom(this.store.select(getLoadAssessmentInterval)),
      map(actionInterval()),
      mergeMap((deviceId) =>
        this.restService.getCenterLoad(deviceId).pipe(
          map((centerLoad) =>
            centerLoad.sort(
              (a, b) =>
                new Date(b.timestamp).getTime() -
                new Date(a.timestamp).getTime()
            )
          ),
          map((centerLoad) => getCenterLoadSuccess({ centerLoad })),
          catchError((_e) => of(getCenterLoadFailure()))
        )
      )
    );
  });

  constructor(
    private readonly actions$: Actions,
    private readonly restService: RestService,
    private readonly legacyAPIService: LegacyAPIService,
    private readonly store: Store
  ) {}
}
