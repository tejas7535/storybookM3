/* eslint-disable @typescript-eslint/member-ordering */
import { inject, Injectable } from '@angular/core';

import { catchError, map, mergeMap, of, switchMap } from 'rxjs';

import { FPricingService } from '@gq/shared/services/rest/f-pricing/f-pricing.service';
import { Actions, createEffect, ofType } from '@ngrx/effects';

import { FPricingActions } from './f-pricing.actions';

@Injectable()
export class FPricingEffects {
  private readonly actions = inject(Actions);
  private readonly fPricingService = inject(FPricingService);

  getFPricingData$ = createEffect(() => {
    return this.actions.pipe(
      ofType(FPricingActions.loadFPricingData),
      mergeMap(({ gqPositionId }) =>
        this.fPricingService.getFPricingData(gqPositionId).pipe(
          map((data) => FPricingActions.loadFPricingDataSuccess({ data })),
          catchError((error) =>
            of(FPricingActions.loadFPricingDataFailure({ error }))
          )
        )
      )
    );
  });

  getComparableTransactions$ = createEffect(() => {
    return this.actions.pipe(
      ofType(FPricingActions.loadComparableTransactions),
      switchMap(({ gqPositionId }) =>
        this.fPricingService.getComparableTransactions(gqPositionId).pipe(
          // if needed at some point, check if received gqPositionId is the same as requested
          map((data) =>
            FPricingActions.loadComparableTransactionsSuccess({
              data: data.fPricingComparableMaterials,
            })
          ),
          catchError((error) =>
            of(FPricingActions.loadComparableTransactionsFailure({ error }))
          )
        )
      )
    );
  });
}
