import { inject } from '@angular/core';

import { delay, map, switchMap, tap } from 'rxjs';

import { LocaleService } from '@mm/core/services';
import { InternalDetectionService } from '@mm/core/services/internal-detection/internal-detection.service';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';

import { ApplicationInsightsService } from '@schaeffler/application-insights';

import { StorageMessagesActions } from '../../actions';
import { CalculationSelectionActions } from '../../actions/calculation-selection';
import { GlobalActions } from '../../actions/global/global.actions';

export const initGlobal$ = createEffect(
  (actions$ = inject(Actions), localeService = inject(LocaleService)) => {
    return actions$.pipe(
      ofType(GlobalActions.initGlobal),
      delay(1),
      switchMap(({ bearingId, separator }) => {
        const actions: Action[] = [
          GlobalActions.determineInternalUser(),
          StorageMessagesActions.getStorageMessage(),
        ];

        if (bearingId) {
          actions.push(
            CalculationSelectionActions.fetchBearingData({
              bearingId,
            })
          );
        }

        if (separator) {
          localeService.setSeparator(separator);
        }

        return [...actions, GlobalActions.setIsInitialized()];
      })
    );
  },
  { functional: true }
);

export const determineInternalUser$ = createEffect(
  (
    actions$ = inject(Actions),
    internalDetectionService = inject(InternalDetectionService)
  ) => {
    return actions$.pipe(
      ofType(GlobalActions.determineInternalUser),
      switchMap(() => internalDetectionService.getInternalHelloEndpoint()),
      map((isInternalUser) =>
        GlobalActions.setIsInternalUser({ isInternalUser })
      )
    );
  },
  { functional: true }
);

export const setIsInternalUser$ = createEffect(
  (
    actions$ = inject(Actions),
    appInsights = inject(ApplicationInsightsService)
  ) => {
    return actions$.pipe(
      ofType(GlobalActions.setIsInternalUser),
      tap(({ isInternalUser }) => {
        appInsights.addCustomPropertyToTelemetryData(
          'internalUser',
          `${isInternalUser}`
        );
      })
    );
  },
  { functional: true, dispatch: false }
);
