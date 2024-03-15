/* eslint-disable @typescript-eslint/member-ordering */
import { inject, Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

import { catchError, map, mergeMap, of, tap } from 'rxjs';
import { switchMap, withLatestFrom } from 'rxjs/operators';

import { FPricingService } from '@gq/shared/services/rest/f-pricing/f-pricing.service';
import { translate } from '@ngneat/transloco';
import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';

import { FPricingActions } from './f-pricing.actions';
import { fPricingFeature, SanityCheckData } from './f-pricing.reducer';

@Injectable()
export class FPricingEffects {
  private readonly actions = inject(Actions);
  private readonly fPricingService = inject(FPricingService);
  private readonly snackBar = inject(MatSnackBar);
  private readonly store = inject(Store);

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

  calculateSanityCheckValue$ = createEffect(() => {
    return this.actions.pipe(
      ofType(FPricingActions.loadFPricingDataSuccess),
      concatLatestFrom(() =>
        this.store.select(fPricingFeature.getSanityCheckData)
      ),
      map(
        ([_, sanityCheckData]: [
          ReturnType<typeof FPricingActions.loadFPricingDataSuccess>,
          SanityCheckData
        ]) =>
          FPricingActions.setSanityCheckValue({
            value:
              sanityCheckData.recommendBeforeChecks -
              sanityCheckData.recommendAfterChecks,
          })
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
  updateFPricingData$ = createEffect(() => {
    return this.actions.pipe(
      ofType(FPricingActions.updateFPricing),
      withLatestFrom(
        this.store.select(fPricingFeature.getDataForUpdateFPricing)
      ),
      mergeMap(([action, request]) =>
        this.fPricingService
          .updateFPricingData(action.gqPositionId, request)
          .pipe(
            tap(() => {
              const successMessage = translate(
                'fPricing.pricingAssistantModal.confirm.success'
              );
              this.snackBar.open(successMessage);
            }),
            map((response) =>
              FPricingActions.updateFPricingSuccess({ response })
            ),
            catchError((error) => {
              const failureMessage = translate(
                'fPricing.pricingAssistantModal.confirm.failure'
              );

              this.snackBar.open(failureMessage);

              return of(FPricingActions.updateFPricingFailure({ error }));
            })
          )
      )
    );
  });
}
