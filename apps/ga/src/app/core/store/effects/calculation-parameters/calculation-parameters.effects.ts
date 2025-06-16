/* istanbul ignore file -- Ignoring branch coverage due to functional inject() patterns */
import { inject } from '@angular/core';

import { filter, map, mergeMap, of, switchMap } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concatLatestFrom } from '@ngrx/operators';
import { Store } from '@ngrx/store';

import { RestService } from '@ga/core/services';
import { GreasesProviderService } from '@ga/shared/services/greases/greases.service';

import { CalculationParametersActions } from '../../actions';
import { getModelId } from '../../selectors/bearing-selection/bearing-selection.selector';
import {
  getCalculationParameters,
  getPreferredGreaseOptions,
} from '../../selectors/calculation-parameters/calculation-parameters.selector';

export const properties$ = createEffect(
  (
    actions$ = inject(Actions),
    restService = inject(RestService),
    store = inject(Store)
  ) => {
    return actions$.pipe(
      ofType(CalculationParametersActions.getProperties),
      concatLatestFrom(() => store.select(getModelId)),
      map(([_action, modelId]) => modelId),
      mergeMap((modelId) =>
        restService.getProperties(modelId).pipe(
          map((properties) =>
            CalculationParametersActions.getPropertiesSuccess({ properties })
          )
          // catchError((_e) => of(propertyErrors()))
        )
      )
    );
  },
  { functional: true }
);

export const updateModel$ = createEffect(
  (
    actions$ = inject(Actions),
    restService = inject(RestService),
    store = inject(Store)
  ) => {
    return actions$.pipe(
      ofType(CalculationParametersActions.patchParameters),
      concatLatestFrom(() => store.select(getCalculationParameters)),
      map(([_action, options]) => options),
      filter(({ modelId }) => modelId !== undefined),
      mergeMap(({ modelId, options }) =>
        restService.putModelUpdate(modelId, options).pipe(
          map(() => CalculationParametersActions.modelUpdateSuccess())
          // catchError((_e) => of(calculationError()))
        )
      )
    );
  },
  { functional: true }
);

export const getDialog$ = createEffect(
  (
    actions$ = inject(Actions),
    restService = inject(RestService),
    store = inject(Store)
  ) => {
    return actions$.pipe(
      ofType(CalculationParametersActions.getDialog),
      concatLatestFrom(() => [
        store.select(getModelId),
        store.select(getPreferredGreaseOptions),
      ]),
      switchMap(([_action, modelId, options]) => {
        return options?.length > 0
          ? of(CalculationParametersActions.getDialogEnd())
          : restService.getDialog(modelId).pipe(
              map((dialogResponse) =>
                CalculationParametersActions.getDialogSuccess({
                  dialogResponse,
                })
              ),
              catchError(() =>
                of(CalculationParametersActions.getDialogFailure())
              )
            );
      })
    );
  },
  { functional: true }
);

export const loadCompetitorsGreases$ = createEffect(
  (
    actions$ = inject(Actions),
    greasesProvider = inject(GreasesProviderService)
  ) => {
    return actions$.pipe(
      ofType(CalculationParametersActions.loadCompetitorsGreases),
      switchMap(() => {
        return greasesProvider.fetchAllGreases().pipe(
          map((greases) =>
            CalculationParametersActions.loadCompetitorsGreasesSuccess({
              greases: greases.map((grease) => ({ ...grease, isGrease: true })),
            })
          ),
          catchError(() =>
            of(CalculationParametersActions.loadCompetitorsGreasesFailure())
          )
        );
      })
    );
  },
  { functional: true }
);

export const loadSchaefflerGreases$ = createEffect(
  (
    actions$ = inject(Actions),
    greasesProvider = inject(GreasesProviderService)
  ) => {
    return actions$.pipe(
      ofType(CalculationParametersActions.loadSchaefflerGreases),
      switchMap(() => {
        return greasesProvider.fetchAllSchaefflerGreases().pipe(
          map((greases) =>
            CalculationParametersActions.loadSchaefflerGreasesSuccess({
              greases: greases.map((grease) => ({ ...grease, isGrease: true })),
            })
          ),
          catchError(() =>
            of(CalculationParametersActions.loadSchaefflerGreasesFailure())
          )
        );
      })
    );
  },
  { functional: true }
);
