import { Inject, Injectable } from '@angular/core';

import { tap } from 'rxjs';

import { Capacitor } from '@capacitor/core';
import { InAppReview } from '@capacitor-community/in-app-review';
import { LOCAL_STORAGE } from '@ng-web-apis/common';
import { Actions, createEffect, ofType } from '@ngrx/effects';

import { calculationSuccess } from '../../actions';

export const CALCULATION_COUNTER_STORAGE_KEY = 'succesful_calculations';
export const REVIEW_PROMPT_THRESHOLD = 3;

@Injectable()
export class AppRatingEffects {
  constructor(
    private readonly actions$: Actions,
    @Inject(LOCAL_STORAGE) readonly localStorage: Storage
  ) {}

  calculationCounterEffect$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(calculationSuccess),
        tap(() => {
          const previous = this.localStorage.getItem(
            CALCULATION_COUNTER_STORAGE_KEY
          );
          const baseValue = previous ? Number.parseInt(previous, 10) : 0;
          if (Number.isNaN(baseValue)) {
            this.localStorage.setItem(CALCULATION_COUNTER_STORAGE_KEY, '1');
          } else {
            this.localStorage.setItem(
              CALCULATION_COUNTER_STORAGE_KEY,
              `${baseValue + 1}`
            );
          }
        })
      );
    },
    { dispatch: false }
  );

  showAppReviewPrompt$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(calculationSuccess),
        tap(() => {
          if (!Capacitor.isNativePlatform()) {
            return;
          }
          const validCalculationCountStorageValue = this.localStorage.getItem(
            CALCULATION_COUNTER_STORAGE_KEY
          );
          const validCalculations = Number.isNaN(
            validCalculationCountStorageValue
          )
            ? 0
            : Number.parseInt(validCalculationCountStorageValue, 10);

          if (validCalculations === REVIEW_PROMPT_THRESHOLD) {
            InAppReview.requestReview();
          }
        })
      );
    },
    { dispatch: false }
  );
}
