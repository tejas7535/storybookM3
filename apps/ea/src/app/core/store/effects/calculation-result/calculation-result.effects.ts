import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { catchError, of, switchMap, takeUntil } from 'rxjs';

import { CO2Service } from '@ea/core/services/co2.service';
import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';

import { CalculationResultActions } from '../../actions';
import { CalculationParametersFacade } from '../../facades';
import { CalculationResultFacade } from '../../facades/calculation-result/calculation-result.facade';

@Injectable()
export class CalculationResultEffects {
  constructor(
    private readonly actions$: Actions,
    private readonly co2Service: CO2Service,
    private readonly calculationParametersFacade: CalculationParametersFacade,
    private readonly calculationResultFacade: CalculationResultFacade
  ) {}

  public createModel$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(CalculationResultActions.createModel),
      concatLatestFrom(() => [
        this.calculationParametersFacade.bearingDesignation$,
        this.calculationResultFacade.modelId$,
      ]),
      switchMap(([_action, bearingDesignation, currentModelId]) => {
        // don't recreate model if already created
        const modelId$ = currentModelId
          ? of(currentModelId)
          : this.co2Service.createModel(bearingDesignation);

        return modelId$.pipe(
          switchMap((modelId) => [
            CalculationResultActions.setModelId({ modelId }),
            CalculationResultActions.updateModel(),
          ]),
          catchError((error: HttpErrorResponse) =>
            of(
              CalculationResultActions.setCalculationFailure({
                error: error.toString(),
              })
            )
          )
        );
      })
    );
  });

  public updateModel$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(CalculationResultActions.updateModel),
      concatLatestFrom(() => [
        this.calculationResultFacade.modelId$,
        this.calculationParametersFacade.energySource$,
        this.calculationParametersFacade.operationConditions$,
      ]),
      switchMap(([_action, modelId, energySource, operationConditions]) =>
        this.co2Service
          .updateModel(modelId, operationConditions, energySource)
          .pipe(
            takeUntil(
              // cancel request if action is called again
              this.actions$.pipe(ofType(CalculationResultActions.updateModel))
            ),
            switchMap(() => [CalculationResultActions.calculateModel()]),
            catchError((error: HttpErrorResponse) =>
              of(
                CalculationResultActions.setCalculationFailure({
                  error: error.toString(),
                })
              )
            )
          )
      )
    );
  });

  public calculateModel$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(CalculationResultActions.calculateModel),
      concatLatestFrom(() => [this.calculationResultFacade.modelId$]),
      switchMap(([_action, modelId]) =>
        this.co2Service.calculateModel(modelId).pipe(
          takeUntil(
            // cancel request if action is called again
            this.actions$.pipe(ofType(CalculationResultActions.calculateModel))
          ),
          switchMap((calculationId) => [
            CalculationResultActions.setCalculationId({ calculationId }),
            CalculationResultActions.fetchCalculationResult(),
          ]),
          catchError((error: HttpErrorResponse) =>
            of(
              CalculationResultActions.setCalculationFailure({
                error: error.toString(),
              })
            )
          )
        )
      )
    );
  });

  public fetchCalculationResult$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(CalculationResultActions.fetchCalculationResult),
      concatLatestFrom(() => [
        this.calculationResultFacade.modelId$,
        this.calculationResultFacade.calculationId$,
      ]),
      switchMap(([_action, modelId, calculationId]) =>
        this.co2Service.getCalculationResult(modelId, calculationId).pipe(
          takeUntil(
            // cancel request if action is called again
            this.actions$.pipe(
              ofType(CalculationResultActions.fetchCalculationResult)
            )
          ),
          switchMap((calculationResult) => [
            CalculationResultActions.setCalculationResult({
              calculationResult,
            }),
          ]),

          catchError((error: HttpErrorResponse) => {
            if (error.status === 400) {
              // invalid data was sent, calculation not possible
              return of(
                CalculationResultActions.setCalculationImpossible({
                  isCalculationImpossible: true,
                })
              );
            }

            // general, unspecific error
            return of(
              CalculationResultActions.setCalculationFailure({
                error: error.message,
              })
            );
          })
        )
      )
    );
  });
}
