import { Injectable } from '@angular/core';

import { EMPTY, of } from 'rxjs';
import {
  catchError,
  concatMap,
  filter,
  map,
  mergeMap,
  withLatestFrom,
} from 'rxjs/operators';

import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';

import { Loads, PredictionResult, StatisticalPrediction } from '../../models';
import { RestService } from '../../services/rest.service';
import * as PredictionActions from '../actions/prediction.actions';
import {
  getLoadsRequest,
  getPredictionRequest,
  getStatisticalRequest,
} from '../selectors/prediction.selectors';
import { HvLimits } from './../../models/hv-limits.model';
import { PredictionRequest } from './../../models/prediction-request.model';
import { StatisticalRequest } from './../../models/statistical-request.model';

@Injectable()
export class PredictionEffects {
  constructor(
    private readonly actions$: Actions,
    private readonly restService: RestService,
    private readonly store: Store
  ) {}

  public setPredictionRequest$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(PredictionActions.setPredictionRequest),
      mergeMap(
        ({
          predictionRequest,
          statisticalRequest,
        }: {
          predictionRequest: HvLimits | PredictionRequest;
          statisticalRequest: HvLimits | StatisticalRequest;
        }) => {
          return [
            PredictionActions.setMLRequest({
              predictionRequest,
            }),
            PredictionActions.setStatisticalRequest({
              statisticalRequest,
            }),
          ];
        }
      )
    );
  });

  public postPrediction$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(PredictionActions.setHardness),
      map(() => PredictionActions.postPrediction())
    );
  });

  public postMLPrediction$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(PredictionActions.postPrediction, PredictionActions.setMLRequest),
      concatMap((action) =>
        of(action).pipe(withLatestFrom(this.store.select(getPredictionRequest)))
      ),
      mergeMap(([_action, predictionRequest]) =>
        this.restService.postPrediction(predictionRequest, 2).pipe(
          map((predictionResult: PredictionResult) =>
            PredictionActions.setPredictionResult({ predictionResult })
          ),
          catchError(() => EMPTY)
        )
      )
    );
  });

  public postStatisticalPrediction$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(
        PredictionActions.postPrediction,
        PredictionActions.setStatisticalRequest
      ),
      concatMap((action) =>
        of(action).pipe(
          withLatestFrom(this.store.select(getStatisticalRequest))
        )
      ),
      mergeMap(([_action, statisticalRequest]) =>
        this.restService.postStatisticalService(statisticalRequest).pipe(
          map((statisticalResult: StatisticalPrediction) =>
            PredictionActions.setStatisticalResult({ statisticalResult })
          ),
          catchError(() => EMPTY)
        )
      )
    );
  });

  public setLoadsRequest$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(PredictionActions.setLoadsRequest),
      map(() => PredictionActions.postLoadsData())
    );
  });

  public postLoadsData$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(PredictionActions.postLoadsData, PredictionActions.postPrediction),
      withLatestFrom(this.store.select(getLoadsRequest)),
      filter(([_action, loadsRequest]) => loadsRequest !== undefined),
      mergeMap(([_action, loadsRequest]) =>
        this.restService.postLoadsData(loadsRequest).pipe(
          map((loadsResult: Loads) =>
            PredictionActions.setLoadsResult({
              loads: loadsResult,
              status: 2,
              error: undefined,
            })
          ),
          catchError((error) =>
            of(
              PredictionActions.setLoadsResult({
                loads: undefined,
                status: 3,
                error: `${error.statusText}`,
              })
            )
          )
        )
      )
    );
  });
}
