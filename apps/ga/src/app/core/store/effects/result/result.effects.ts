import { Injectable } from '@angular/core';

import { catchError, filter, map, mergeMap, of } from 'rxjs';

import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { ROUTER_NAVIGATED } from '@ngrx/router-store';
import { Store } from '@ngrx/store';

import { ApplicationInsightsService } from '@schaeffler/application-insights';

import { GreaseCalculationPath } from '../../../../grease-calculation/grease-calculation-path.enum';
import { PROPERTIES } from '../../../../shared/constants';
import { ErrorService, RestService } from '../../../services';
import {
  calculationError,
  calculationSuccess,
  getCalculation,
} from '../../actions/result/result.actions';
import { getModelId } from '../../selectors/bearing/bearing.selector';
import { getCalculationParameters } from '../../selectors/parameter/parameter.selector';

@Injectable()
export class ResultEffects {
  router$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ROUTER_NAVIGATED),
      map((action: any) => action.payload.routerState.url),
      map((url: string) =>
        Object.values(GreaseCalculationPath).find(
          (route: string) => route !== '' && url.includes(route)
        )
      ),
      filter(
        (currentRoute: string) =>
          currentRoute === GreaseCalculationPath.ResultPath
      ),
      map(() => getCalculation())
    );
  });

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
            PROPERTIES,
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
