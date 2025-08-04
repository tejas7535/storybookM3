import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { catchError, map, mergeMap, of, switchMap, tap } from 'rxjs';

import { AppRoutePath } from '@ea/app-route-path.enum';
import { CatalogService } from '@ea/core/services/catalog.service';
import { CatalogServiceProductClass } from '@ea/core/services/catalog.service.interface';
import { CO2UpstreamService } from '@ea/core/services/co2-upstream.service';
import { DownstreamCalculationService } from '@ea/core/services/downstream-calculation.service';
import {
  CATALOG_BEARING_TYPE,
  SLEWING_BEARING_TYPE,
} from '@ea/shared/constants/products';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concatLatestFrom } from '@ngrx/operators';

import {
  CalculationTypesActions,
  CatalogCalculationResultActions,
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
      tap((action) => {
        if (action.shouldNavigateToCalculationPage) {
          this.router.navigate([AppRoutePath.BasePath]);
        }
      }),
      mergeMap(() => [
        ProductSelectionActions.fetchBearingCapabilities(),

        ProductSelectionActions.fetchCanCalculate(),
        CatalogCalculationResultActions.fetchBearinxVersions(),
      ])
    );
  });

  public fetchBearingCapabilities$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ProductSelectionActions.fetchBearingCapabilities),
      concatLatestFrom(() => [
        this.productSelectionFacade.bearingDesignation$,
        this.calculationParametersFacade.getCalculationTypes$,
      ]),
      switchMap(([_action, bearingDesignation, calculationTypes]) => {
        return this.catalogService
          .getBearingCapabilities(bearingDesignation)
          .pipe(
            switchMap((capabilities) => {
              const types = this.getCalculationTypes(
                capabilities.productInfo.bearinxClass,
                calculationTypes
              );

              return [
                ProductSelectionActions.setBearingId({
                  bearingId: capabilities.productInfo.id,
                }),
                ProductSelectionActions.setBearingProductClass({
                  productClass: capabilities.productInfo.bearinxClass,
                }),
                CalculationTypesActions.setCalculationTypes({
                  calculationTypes: {
                    ...types,
                  },
                }),
                ProductSelectionActions.fetchLoadcaseTemplate(),
                CO2UpstreamCalculationResultActions.fetchResult(),
                ProductSelectionActions.fetchOperatingConditionsTemplate(),
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

  public fetchCanCalculate$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ProductSelectionActions.fetchCanCalculate),
      concatLatestFrom(() => [
        this.productSelectionFacade.bearingDesignation$,
        this.calculationParametersFacade.getCalculationTypes$,
      ]),
      switchMap(([_, designation, calculationTypes]) => {
        return this.downstreamCalculationService
          .getCanCalculate(designation)
          .pipe(
            switchMap((co2DownstreamAvailable) => [
              ProductSelectionActions.setCanCalculate({
                co2DownstreamAvailable,
              }),
              CalculationTypesActions.setCalculationTypes({
                calculationTypes: {
                  ...calculationTypes,
                  frictionalPowerloss: {
                    ...calculationTypes.frictionalPowerloss,
                    disabled: !co2DownstreamAvailable,
                  },
                },
              }),
            ])
          );
      })
    );
  });

  public bearingSearch$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ProductSelectionActions.searchBearing),
      map((action) => action.query),
      mergeMap((query: string) =>
        this.co2Service
          .findBearings(query)
          .pipe(
            map((resultList) =>
              ProductSelectionActions.bearingSearchSuccess({ resultList })
            )
          )
      )
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
      concatLatestFrom(() => [
        this.productSelectionFacade.bearingId$,
        this.productSelectionFacade.bearingProductClass$,
      ]),
      switchMap(([_action, bearingId, bearingProductClass]) => {
        if (
          !this.isbearingSupportsOperatingConditionsTemplate(
            bearingProductClass
          )
        ) {
          // Unsupported type: return empty result immediately
          return of(
            ProductSelectionActions.setOperatingConditionsTemplate({
              operatingConditionsTemplate: [],
            })
          );
        }

        // Supported type: proceed with API call
        return this.catalogService
          .getOperatingConditionsTemplate(bearingId)
          .pipe(
            switchMap((result) => [
              ProductSelectionActions.setOperatingConditionsTemplate({
                operatingConditionsTemplate: result,
              }),
            ]),
            catchError((_error: HttpErrorResponse) => {
              return of(
                ProductSelectionActions.setOperatingConditionsTemplate({
                  operatingConditionsTemplate: undefined,
                })
              );
            })
          );
      })
    );
  });

  constructor(
    private readonly actions$: Actions,
    private readonly catalogService: CatalogService,
    private readonly productSelectionFacade: ProductSelectionFacade,
    private readonly calculationParametersFacade: CalculationParametersFacade,
    private readonly router: Router,
    private readonly co2Service: CO2UpstreamService,
    private readonly downstreamCalculationService: DownstreamCalculationService
  ) {}

  private isbearingSupportsOperatingConditionsTemplate(
    bearingProductClass: CatalogServiceProductClass
  ): boolean {
    return bearingProductClass === CATALOG_BEARING_TYPE;
  }

  private getCalculationTypes(
    bearingProductClass: CatalogServiceProductClass,
    types: CalculationParametersCalculationTypes
  ): CalculationParametersCalculationTypes {
    const visibleCalculationTypes =
      bearingProductClass === CATALOG_BEARING_TYPE;

    const isSlewingBearing = bearingProductClass === SLEWING_BEARING_TYPE;

    const calculationTypes: CalculationParametersCalculationTypes = {
      ...types,
      overrollingFrequency: {
        ...types.overrollingFrequency,
        visible: visibleCalculationTypes,
      },
      lubrication: {
        ...types.lubrication,
        visible: visibleCalculationTypes,
      },
      frictionalPowerloss: {
        ...types.frictionalPowerloss,
        selected: isSlewingBearing,
      },
    };

    return calculationTypes;
  }
}
