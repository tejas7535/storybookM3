import { inject, Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

import { catchError, map, mergeMap, of } from 'rxjs';
import { switchMap, withLatestFrom } from 'rxjs/operators';

import { ActiveCaseFacade } from '@gq/core/store/active-case/active-case.facade';
import { UpdateQuotationDetail } from '@gq/core/store/active-case/models';
import { PriceSource } from '@gq/shared/models';
import { FPricingService } from '@gq/shared/services/rest/f-pricing/f-pricing.service';
import { translate } from '@jsverse/transloco';
import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';

import { FPricingActions } from './f-pricing.actions';
import { fPricingFeature } from './f-pricing.reducer';
import { FPricingCalculations } from './models/f-pricing-calculations.interface';

@Injectable()
export class FPricingEffects {
  private readonly actions = inject(Actions);
  private readonly fPricingService = inject(FPricingService);
  private readonly snackBar = inject(MatSnackBar);
  private readonly store = inject(Store);
  private readonly activeCaseFacade = inject(ActiveCaseFacade);

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

  triggerInitialCalculations$ = createEffect(() => {
    return this.actions.pipe(
      ofType(FPricingActions.loadFPricingDataSuccess),
      switchMap(() => of(FPricingActions.triggerFPricingCalculations()))
    );
  });

  getFPricingCalculations$ = createEffect(() => {
    return this.actions.pipe(
      ofType(FPricingActions.triggerFPricingCalculations),
      concatLatestFrom(() =>
        this.store.select(fPricingFeature.getDataForTriggerCalculations)
      ),
      mergeMap(([_, requestData]) =>
        this.fPricingService.getFPricingCalculations(requestData).pipe(
          map((response) => {
            const result: FPricingCalculations = {
              ...response,
              gpm: response.gpm * 100,
              sanityCheck: {
                ...response.sanityCheck,
                sqv: requestData.sanityCheck.sqv,
                lastCustomerPrice: requestData.sanityCheck.lastCustomerPrice,
                priceAfterSanityCheck: response.finalPrice,
              },
            };

            return FPricingActions.triggerFPricingCalculationsSuccess({
              response: result,
            });
          }),
          catchError((error) =>
            of(FPricingActions.triggerFPricingCalculationsFailure({ error }))
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

  updateGqPrice$ = createEffect(
    () => {
      return this.actions.pipe(
        ofType(FPricingActions.updateFPricingSuccess),
        map(({ response }) => {
          const updateQuotationDetail: UpdateQuotationDetail = {
            gqPositionId: response.gqPositionId,
            priceSource: PriceSource.GQ,
            price: response.finalPrice,
          };

          this.activeCaseFacade.updateQuotationDetails([updateQuotationDetail]);
        })
      );
    },
    { dispatch: false }
  );

  updateManualPrice$ = createEffect(
    () => {
      return this.actions.pipe(
        ofType(FPricingActions.updateManualPrice),
        withLatestFrom(this.store.select(fPricingFeature.selectManualPrice)),
        map(
          ([action, manualPrice]: [
            ReturnType<typeof FPricingActions.updateManualPrice>,
            number,
          ]) => {
            const updateQuotationDetail: UpdateQuotationDetail = {
              gqPositionId: action.gqPositionId,
              priceSource: PriceSource.MANUAL,
              price: manualPrice,
              priceComment: action.comment,
            };

            this.activeCaseFacade.updateQuotationDetails([
              updateQuotationDetail,
            ]);
          }
        )
      );
    },
    { dispatch: false }
  );

  getComparisonMaterialInformation$ = createEffect(() => {
    return this.actions.pipe(
      ofType(FPricingActions.getComparisonMaterialInformation),
      withLatestFrom(this.store.select(fPricingFeature.selectProductType)),
      switchMap(([action, productType]) =>
        this.fPricingService
          .getComparisonMaterialInformation(
            productType,
            action.referenceMaterial,
            action.materialToCompare
          )
          .pipe(
            map((response) =>
              FPricingActions.getComparisonMaterialInformationSuccess({
                response,
              })
            ),
            catchError((error) => {
              const failureMessage = translate(
                'fPricing.pricingAssistantModal.confirm.failure'
              );

              this.snackBar.open(failureMessage);

              return of(
                FPricingActions.getComparisonMaterialInformationFailure({
                  error,
                })
              );
            })
          )
      )
    );
  });
}
