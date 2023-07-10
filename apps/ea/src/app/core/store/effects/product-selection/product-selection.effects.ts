import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { catchError, mergeMap, of, switchMap } from 'rxjs';

import { ModuleCalculationModuleInfoResult } from '@ea/core/services/calculation-module-info.interface';
import { CalculationModuleInfoService } from '@ea/core/services/calculation-module-info.service';
import { CatalogService } from '@ea/core/services/catalog.service';
import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';

import {
  CalculationTypesActions,
  CO2UpstreamCalculationResultActions,
  FrictionCalculationResultActions,
  ProductSelectionActions,
} from '../../actions';
import { CalculationParametersFacade } from '../../facades';
import { ProductSelectionFacade } from '../../facades/product-selection/product-selection.facade';
import { CalculationParametersCalculationTypes } from '../../models';

@Injectable()
export class ProductSelectionEffects {
  public setBearingDesignation$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ProductSelectionActions.setBearingDesignation),
      mergeMap(() => [
        ProductSelectionActions.fetchBearingId(),
        ProductSelectionActions.fetchCalculationModuleInfo(),
        FrictionCalculationResultActions.createModel({ forceRecreate: true }),
        CO2UpstreamCalculationResultActions.fetchResult(),
      ])
    );
  });

  public fetchBearingId$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ProductSelectionActions.fetchBearingId),
      concatLatestFrom(() => [
        this.productSelectionFacade.bearingDesignation$,
        this.productSelectionFacade.bearingId$,
      ]),
      switchMap(([_action, bearingDesignation, bearingId]) => {
        // don't fetch bearing id again if already existing
        const bearingId$ = bearingId
          ? of(bearingId)
          : this.catalogService.getBearingIdFromDesignation(bearingDesignation);

        return bearingId$.pipe(
          switchMap((result) => [
            ProductSelectionActions.setBearingId({ bearingId: result }),
          ]),
          catchError((error: HttpErrorResponse) =>
            of(
              ProductSelectionActions.setProductFetchFailure({
                error: error.toString(),
              })
            )
          )
        );
      })
    );
  });

  public fetchCalculationModuleInfo$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ProductSelectionActions.fetchCalculationModuleInfo),
      concatLatestFrom(() => [this.productSelectionFacade.bearingDesignation$]),
      switchMap(([_action, bearingDesignation]) => {
        return this.calculationModuleInfoService
          .getCalculationInfo(bearingDesignation)
          .pipe(
            catchError((_error: HttpErrorResponse) =>
              of(
                {} as Pick<
                  ModuleCalculationModuleInfoResult,
                  'catalogueCalculation' | 'frictionCalculation'
                >
              )
            ),
            concatLatestFrom(() => [
              this.calculationParametersFacade.getCalculationTypes$,
            ]),
            switchMap(([result, calculationTypes]) => {
              const updatedTypes: CalculationParametersCalculationTypes = {
                emission: {
                  ...calculationTypes.emission,
                  disabled: false, // special case, stays enabled since we are still able to calculate upstream
                },
                frictionalPowerloss: {
                  ...calculationTypes.frictionalPowerloss,
                  disabled: !result.frictionCalculation,
                  selected: !result.frictionCalculation
                    ? false
                    : calculationTypes.frictionalPowerloss.selected,
                },
                lubrication: {
                  ...calculationTypes.lubrication,
                  disabled: !result.catalogueCalculation,
                  selected: !result.catalogueCalculation
                    ? false
                    : calculationTypes.lubrication.selected,
                },
                overrollingFrequency: {
                  ...calculationTypes.overrollingFrequency,
                  disabled: !result.catalogueCalculation,
                  selected: !result.catalogueCalculation
                    ? false
                    : calculationTypes.overrollingFrequency.selected,
                },
                ratingLife: {
                  ...calculationTypes.ratingLife,
                  disabled: !result.catalogueCalculation,
                  selected: !result.catalogueCalculation
                    ? false
                    : calculationTypes.ratingLife.selected,
                },
              };

              return [
                ProductSelectionActions.setCalculationModuleInfo({
                  calculationModuleInfo: result,
                }),
                CalculationTypesActions.setCalculationTypes({
                  calculationTypes: updatedTypes,
                }),
              ];
            })
          );
      })
    );
  });

  constructor(
    private readonly actions$: Actions,
    private readonly catalogService: CatalogService,
    private readonly calculationModuleInfoService: CalculationModuleInfoService,
    private readonly productSelectionFacade: ProductSelectionFacade,
    private readonly calculationParametersFacade: CalculationParametersFacade
  ) {}
}
