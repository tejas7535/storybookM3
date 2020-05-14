import { Injectable } from '@angular/core';

import { EMPTY, of } from 'rxjs';
import {
  catchError,
  concatMap,
  map,
  mergeMap,
  switchMap,
  withLatestFrom,
} from 'rxjs/operators';

import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';

import { PredictionResult } from '../../../shared/models';
import { RestService } from '../../services/rest.service';
import * as PredictionActions from '../actions/prediction.actions';
import { LTPState } from '../reducers';
import { getPredictionRequest } from '../selectors/prediction.selectors';

@Injectable()
export class PredictionEffects {
  constructor(
    private readonly actions$: Actions,
    private readonly restService: RestService,
    private readonly store: Store<LTPState>
  ) {}

  public setPredictionRequest$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PredictionActions.setPredictionRequest),
      map(() => PredictionActions.postPrediction())
    )
  );

  public postPrediction$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PredictionActions.postPrediction, PredictionActions.setHardness),
      concatMap((action) =>
        of(action).pipe(withLatestFrom(this.store.select(getPredictionRequest)))
      ),
      switchMap(([_action, predictionRequest]) =>
        this.restService.postPrediction(predictionRequest, 2).pipe(
          map((predictionResult: PredictionResult) =>
            PredictionActions.setPredictionResult({ predictionResult })
          ),
          catchError(() => EMPTY)
        )
      )
    )
  );

  public postLoadsData$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PredictionActions.postLoadsData),
      concatMap((action) =>
        of(action).pipe(withLatestFrom(this.store.select(getPredictionRequest)))
      ),
      mergeMap(([action, predictionRequest]) =>
        this.restService
          .postLoadsData(action.loadsRequest, predictionRequest)
          .pipe(
            map((loadsResult) =>
              PredictionActions.setLoadsResult({
                ...loadsResult,
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
    )
  );
}
