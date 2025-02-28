import { Injectable } from '@angular/core';

import { catchError, map, mergeMap, of, switchMap, takeUntil } from 'rxjs';

import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';

import { ApplicationInsightsService } from '@schaeffler/application-insights';

import { ErrorService, RestService } from '@ga/core/services';
import {
  calculationError,
  calculationSuccess,
  fetchBearinxVersions,
  getCalculation,
  setBearinxVersions,
  unsetBearinxVersions,
} from '@ga/core/store/actions/calculation-result/calculation-result.actions';
import {
  GREASE_PRESELECTION,
  TRACKING_NAME_PROPERTIES,
} from '@ga/shared/constants';

import { getModelId } from '../../selectors/bearing-selection/bearing-selection.selector';
import {
  getCalculationParameters,
  getPreferredGreaseSelection,
} from '../../selectors/calculation-parameters/calculation-parameters.selector';

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
        concatLatestFrom(() => [
          this.store.select(getCalculationParameters),
          this.store.select(getPreferredGreaseSelection),
        ]),
        map(([_action, properties, preferedGrease]) => {
          this.applicationInsightsService.logEvent(
            TRACKING_NAME_PROPERTIES,
            properties.options
          );
          this.applicationInsightsService.logEvent(
            GREASE_PRESELECTION,
            preferedGrease
          );
        })
      );
    },
    { dispatch: false }
  );

  public fetchBearinxVersion$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(fetchBearinxVersions),
      switchMap(() =>
        this.restService.getBearinxVersions().pipe(
          takeUntil(
            // cancel request if action is called again
            this.actions$.pipe(ofType(fetchBearinxVersions))
          ),
          switchMap((versions) => [setBearinxVersions({ versions })]),
          catchError(() => of(unsetBearinxVersions()))
        )
      )
    );
  });

  constructor(
    private readonly actions$: Actions,
    private readonly restService: RestService,
    private readonly store: Store,
    private readonly errorService: ErrorService,
    private readonly applicationInsightsService: ApplicationInsightsService
  ) {}
}
