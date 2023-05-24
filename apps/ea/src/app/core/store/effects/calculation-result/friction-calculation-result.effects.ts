import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { catchError, of, switchMap, takeUntil } from 'rxjs';

import { FrictionService } from '@ea/core/services/friction.service';
import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';

import { FrictionCalculationResultActions } from '../../actions';
import { CalculationParametersFacade } from '../../facades';
import { FrictionCalculationResultFacade } from '../../facades/calculation-result/friction-calculation-result.facade';
import { ProductSelectionFacade } from '../../facades/product-selection/product-selection.facade';

@Injectable()
export class FrictionCalculationResultEffects {
  constructor(
    private readonly actions$: Actions,
    private readonly frictionService: FrictionService,
    private readonly calculationParametersFacade: CalculationParametersFacade,
    private readonly frictionCalculationResultFacade: FrictionCalculationResultFacade,
    private readonly productSelectionFacade: ProductSelectionFacade
  ) {}

  public createModel$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(FrictionCalculationResultActions.createModel),
      concatLatestFrom(() => [
        this.productSelectionFacade.bearingDesignation$,
        this.frictionCalculationResultFacade.modelId$,
      ]),
      switchMap(([action, bearingDesignation, currentModelId]) => {
        // don't recreate model if already created (unless forced)
        const modelId$ =
          currentModelId && !action.forceRecreate
            ? of(currentModelId)
            : this.frictionService.createFrictionModel(bearingDesignation);

        return modelId$.pipe(
          switchMap((modelId) => [
            FrictionCalculationResultActions.setModelId({ modelId }),
            FrictionCalculationResultActions.updateModel(),
          ]),
          catchError((error: HttpErrorResponse) =>
            of(
              FrictionCalculationResultActions.setCalculationFailure({
                error: error.message,
              })
            )
          )
        );
      })
    );
  });

  public updateModel$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(FrictionCalculationResultActions.updateModel),
      concatLatestFrom(() => [
        this.frictionCalculationResultFacade.modelId$,
        this.calculationParametersFacade.energySource$,
        this.calculationParametersFacade.operationConditions$,
        this.calculationParametersFacade.isCalculationMissingInput$,
      ]),
      switchMap(
        ([
          _action,
          modelId,
          energySource,
          operationConditions,
          isInputInvalid,
        ]) =>
          isInputInvalid
            ? of(
                FrictionCalculationResultActions.setLoading({
                  isLoading: false,
                })
              )
            : this.frictionService
                .updateFrictionModel(modelId, operationConditions, energySource)
                .pipe(
                  takeUntil(
                    // cancel request if action is called again
                    this.actions$.pipe(
                      ofType(FrictionCalculationResultActions.updateModel)
                    )
                  ),
                  switchMap(() => [
                    FrictionCalculationResultActions.calculateModel(),
                  ]),
                  catchError((error: HttpErrorResponse) =>
                    of(
                      FrictionCalculationResultActions.setCalculationFailure({
                        error: error.message,
                      })
                    )
                  )
                )
      )
    );
  });

  public calculateModel$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(FrictionCalculationResultActions.calculateModel),
      concatLatestFrom(() => [this.frictionCalculationResultFacade.modelId$]),
      switchMap(([_action, modelId]) =>
        this.frictionService.calculateFrictionModel(modelId).pipe(
          takeUntil(
            // cancel request if action is called again
            this.actions$.pipe(
              ofType(FrictionCalculationResultActions.calculateModel)
            )
          ),
          switchMap((calculationId) => [
            FrictionCalculationResultActions.setCalculationId({
              calculationId,
            }),
            FrictionCalculationResultActions.fetchCalculationResult(),
          ]),
          catchError((error: HttpErrorResponse) =>
            of(
              FrictionCalculationResultActions.setCalculationFailure({
                error: error.message,
              })
            )
          )
        )
      )
    );
  });

  public fetchCalculationResult$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(FrictionCalculationResultActions.fetchCalculationResult),
      concatLatestFrom(() => [
        this.frictionCalculationResultFacade.modelId$,
        this.frictionCalculationResultFacade.calculationId$,
      ]),
      switchMap(([_action, modelId, calculationId]) =>
        this.frictionService.getCalculationResult(modelId, calculationId).pipe(
          takeUntil(
            // cancel request if action is called again
            this.actions$.pipe(
              ofType(FrictionCalculationResultActions.fetchCalculationResult)
            )
          ),
          switchMap((calculationResult) => [
            FrictionCalculationResultActions.setCalculationResult({
              calculationResult,
            }),
          ]),

          catchError((error: HttpErrorResponse) => {
            if (error.status === 400) {
              // invalid data was sent, calculation not possible
              return of(
                FrictionCalculationResultActions.setCalculationImpossible({
                  isCalculationImpossible: true,
                })
              );
            }

            // general, unspecific error
            return of(
              FrictionCalculationResultActions.setCalculationFailure({
                error: error.message,
              })
            );
          })
        )
      )
    );
  });
}
