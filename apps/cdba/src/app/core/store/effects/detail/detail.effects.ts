import { Injectable } from '@angular/core';

import { of } from 'rxjs';
import { catchError, map, mergeMap, tap, withLatestFrom } from 'rxjs/operators';

import { Actions, createEffect, ofType } from '@ngrx/effects';
import { ROUTER_NAVIGATED } from '@ngrx/router-store';
import { select, Store } from '@ngrx/store';

import { DetailService } from '../../../../detail/service/detail.service';
import {
  getCalculations,
  getCalculationsFailure,
  getCalculationsSuccess,
  getReferenceTypeDetails,
  getReferenceTypeItem,
  getReferenceTypeItemFailure,
  getReferenceTypeItemSuccess,
} from '../../actions';
import * as fromRouter from '../../reducers';
import { ReferenceTypeResultModel } from '../../reducers/detail/models';
import { CalculationsResultModel } from '../../reducers/detail/models/calculations-result-model';

/**
 * Effect class for all tagging related actions which trigger side effects
 */
@Injectable()
export class DetailEffects {
  referenceTypeDetails$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(ROUTER_NAVIGATED, getReferenceTypeDetails.type),
        withLatestFrom(this.store.pipe(select(fromRouter.getRouterState))),
        map(([_action, routerState]) => routerState),
        tap((routerState) => {
          this.store.dispatch(
            getReferenceTypeItem({
              referenceTypeId: {
                materialNumber:
                  routerState.state.queryParams['material-number'],
                plant: routerState.state.queryParams.plant,
              },
            })
          );
          this.store.dispatch(
            getCalculations({
              materialNumber: routerState.state.queryParams['material-number'],
            })
          );
        })
      );
    },
    { dispatch: false }
  );

  referenceTypeItem$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(getReferenceTypeItem),
      mergeMap((action) =>
        this.detailService.detail(action.referenceTypeId).pipe(
          map((item: ReferenceTypeResultModel) =>
            getReferenceTypeItemSuccess({ item })
          ),
          catchError((_e) => of(getReferenceTypeItemFailure()))
        )
      )
    );
  });

  calculations$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(getCalculations),
      mergeMap((action) =>
        this.detailService.calculations(action.materialNumber).pipe(
          map((item: CalculationsResultModel) =>
            getCalculationsSuccess({ item })
          ),
          catchError((_e) => of(getCalculationsFailure()))
        )
      )
    );
  });

  constructor(
    private readonly actions$: Actions,
    private readonly detailService: DetailService,
    private readonly store: Store<fromRouter.AppState>
  ) {}
}
