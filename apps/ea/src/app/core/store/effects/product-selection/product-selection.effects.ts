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
        ProductSelectionActions.fetchBearingCapabilities(),
        ProductSelectionActions.fetchCalculationModuleInfo(),
      ])
    );
  });

  public fetchBearingCapabilities$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ProductSelectionActions.fetchBearingCapabilities),
      concatLatestFrom(() => [this.productSelectionFacade.bearingDesignation$]),
      switchMap(([_action, bearingDesignation]) => {
        return this.catalogService
          .getBearingCapabilities(bearingDesignation)
          .pipe(
            concatLatestFrom(() => [
              this.calculationParametersFacade.getCalculationTypes$,
            ]),
            switchMap(([capabilities, calculationConfig]) => {
              const newCalculationTypes: CalculationParametersCalculationTypes =
                {
                  ...calculationConfig,
                  frictionalPowerloss: {
                    ...calculationConfig.frictionalPowerloss,
                    disabled: !capabilities.capabilityInfo.frictionCalculation,
                    selected: !capabilities.capabilityInfo.frictionCalculation
                      ? false
                      : calculationConfig.frictionalPowerloss.selected,
                  },
                };

              return [
                ProductSelectionActions.setBearingId({
                  bearingId: capabilities.productInfo.id,
                }),
                ProductSelectionActions.setBearingProductClass({
                  productClass: capabilities.productInfo.bearinxClass,
                }),
                ProductSelectionActions.fetchLoadcaseTemplate(),
                CO2UpstreamCalculationResultActions.fetchResult(),
                ProductSelectionActions.fetchOperatingConditionsTemplate(),
                CalculationTypesActions.setCalculationTypes({
                  calculationTypes: newCalculationTypes,
                }),
              ];
            }),
            catchError((err: HttpErrorResponse) => {
              return of(
                ProductSelectionActions.setProductFetchFailure({
                  error: {
                    catalogApi: err.ok
                      ? undefined
                      : err.statusText || 'Unkown error',
                  },
                })
              );
            })
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
            catchError((_error: HttpErrorResponse) => {
              if (_error.status === 404) {
                // workaround for inconsistencies with PIM
                // based on the assumption that all scenarios where a possibly legit 404 error
                // is caught by medias before running into issues in the app
                // NOTE: might break for standalone
                return of({
                  catalogueCalculation: true,
                } as ModuleCalculationModuleInfoResult);
              }

              return of(
                {} as Pick<
                  ModuleCalculationModuleInfoResult,
                  'catalogueCalculation' | 'frictionCalculation'
                >
              );
            }),
            concatLatestFrom(() => [
              this.calculationParametersFacade.getCalculationTypes$,
            ]),
            switchMap(([result, calculationTypes]) => {
              const updatedTypes: CalculationParametersCalculationTypes = {
                emission: {
                  ...calculationTypes.emission,
                  disabled: false, // special case, stays enabled since we are still able to calculate upstream
                },
                // should not change the value as long as the new friciion api isn't implemented in the frontend
                frictionalPowerloss: {
                  ...calculationTypes.frictionalPowerloss,
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

  public fetchLoadcaseTemplate$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ProductSelectionActions.fetchLoadcaseTemplate),
      concatLatestFrom(() => [this.productSelectionFacade.bearingId$]),
      switchMap(([_action, bearingId]) => {
        return this.catalogService.getLoadcaseTemplate(bearingId).pipe(
          switchMap((result) => [
            ProductSelectionActions.setLoadcaseTemplate({
              loadcaseTemplate: result,
            }),
          ]),
          catchError((_error: HttpErrorResponse) => {
            console.error(_error);

            return of(
              ProductSelectionActions.setLoadcaseTemplate({
                loadcaseTemplate: undefined,
              })
            );
          })
        );
      })
    );
  });

  public fetchOperatingConditionsTemplate$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ProductSelectionActions.fetchOperatingConditionsTemplate),
      concatLatestFrom(() => [this.productSelectionFacade.bearingId$]),
      switchMap(([_action, bearingId]) => {
        return this.catalogService
          .getOperatingConditionsTemplate(bearingId)
          .pipe(
            switchMap((result) => [
              ProductSelectionActions.setOperatingConditionsTemplate({
                operatingConditionsTemplate: result,
              }),
            ]),
            catchError((_error: HttpErrorResponse) =>
              of(
                ProductSelectionActions.setOperatingConditionsTemplate({
                  operatingConditionsTemplate: undefined,
                })
              )
            )
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
