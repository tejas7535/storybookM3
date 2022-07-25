import { Injectable } from '@angular/core';

import { catchError, map, mergeMap, of } from 'rxjs';

import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';

import { ApplicationInsightsService } from '@schaeffler/application-insights';

import { ErrorService, RestService } from '@ga/core/services';
import {
  calculationError,
  calculationSuccess,
  getCalculation,
} from '@ga/core/store/actions/calculation-result/calculation-result.actions';
import { TRACKING_NAME_PROPERTIES } from '@ga/shared/constants';

import { getModelId } from '../../selectors/bearing-selection/bearing-selection.selector';
import { getCalculationParameters } from '../../selectors/calculation-parameters/calculation-parameters.selector';

@Injectable()
export class CalculationResultEffects {
  calculation$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(getCalculation),
      concatLatestFrom(() => this.store.select(getModelId)),
      map(([_action, modelId]) => modelId),
      mergeMap((modelId) =>
        this.restService.getGreaseCalculation(modelId).pipe(
          map((resultId) => calculationSuccess({ resultId })),
          catchError((_e) => of(calculationError()))
        )
      )
    );
  });

  calculationError$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(calculationError),
        map(() => this.errorService.openGenericSnackBar())
      );
    },
    { dispatch: false }
  );

  calculationSuccess$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(calculationSuccess),
        concatLatestFrom(() => this.store.select(getCalculationParameters)),
        map(([_action, parameters]) => parameters),
        map((properties) =>
          this.applicationInsightsService.logEvent(
            TRACKING_NAME_PROPERTIES,
            properties.options
          )
        )
      );
    },
    { dispatch: false }
  );

  constructor(
    private readonly actions$: Actions,
    private readonly restService: RestService,
    private readonly store: Store,
    private readonly errorService: ErrorService,
    private readonly applicationInsightsService: ApplicationInsightsService
  ) {}
}
