import { Injectable } from '@angular/core';

import { catchError, map, of, switchMap } from 'rxjs';

import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';

import {
  MaterialClass,
  NavigationLevel,
} from '@mac/feature/materials-supplier-database/constants';
import {
  DataResult,
  ManufacturerSupplierTableValue,
  ManufacturerSupplierV2,
  MaterialStandardTableValue,
  MaterialStandardV2,
  MaterialV2,
} from '@mac/msd/models';
import { MsdDataService } from '@mac/msd/services/msd-data';
import * as DataActions from '@mac/msd/store/actions/data/data.actions';
import * as DialogActions from '@mac/msd/store/actions/dialog/dialog.actions';
import { DataFacade } from '@mac/msd/store/facades/data';

@Injectable()
export class DataEffects {
  constructor(
    private readonly actions$: Actions,
    private readonly msdDataService: MsdDataService,
    private readonly dataFacade: DataFacade
  ) {}

  public fetchResult$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(DataActions.fetchResult),
      concatLatestFrom(() => this.dataFacade.navigation$),
      switchMap(([_action, { navigationLevel }]) => {
        switch (navigationLevel) {
          case NavigationLevel.MATERIAL:
            return [DataActions.fetchMaterials()];
          case NavigationLevel.SUPPLIER:
            return [DataActions.fetchManufacturerSuppliers()];
          case NavigationLevel.STANDARD:
            return [DataActions.fetchMaterialStandards()];
          default:
            return [];
        }
      })
    );
  });

  public fetchMaterials$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(DataActions.fetchMaterials),
      concatLatestFrom(() => this.dataFacade.navigation$),
      switchMap(([_action, { materialClass }]) =>
        this.msdDataService.getMaterials(materialClass).pipe(
          map((result: DataResult[] | MaterialV2[]) =>
            DataActions.fetchMaterialsSuccess({
              materialClass,
              result,
            })
          ),
          catchError(() =>
            // TODO: implement proper error handling
            of(DataActions.fetchMaterialsFailure())
          )
        )
      )
    );
  });

  public fetchClassOptions$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(DataActions.fetchClassOptions),
      switchMap(() =>
        this.msdDataService.getMaterialClasses().pipe(
          map((materialClasses: MaterialClass[]) =>
            DataActions.fetchClassOptionsSuccess({ materialClasses })
          ),
          catchError(() =>
            // TODO: implement proper error handling
            of(DataActions.fetchClassOptionsFailure())
          )
        )
      )
    );
  });

  public setNavigation$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(DataActions.setNavigation),
      switchMap(() => [
        DataActions.fetchResult(),
        DialogActions.cleanMinimizeDialog(),
      ])
    );
  });

  public fetchManufacturerSuppliers$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(DataActions.fetchManufacturerSuppliers),
      concatLatestFrom(() => this.dataFacade.materialClass$),
      switchMap(([_action, materialClass]) =>
        this.msdDataService.fetchManufacturerSuppliers(materialClass).pipe(
          map(
            (
              manufacturerSuppliers: ManufacturerSupplierV2[]
            ): ManufacturerSupplierTableValue[] =>
              manufacturerSuppliers.map(
                (manufacturerSupplier) =>
                  ({
                    id: manufacturerSupplier.id,
                    manufacturerSupplierName: manufacturerSupplier.name,
                    manufacturerSupplierPlant: manufacturerSupplier.plant,
                    manufacturerSupplierCountry: manufacturerSupplier.country,
                    sapSupplierIds:
                      'sapData' in manufacturerSupplier
                        ? manufacturerSupplier.sapData?.map(
                            (sapData: { sapSupplierId: string }) =>
                              sapData.sapSupplierId
                          ) || []
                        : undefined,
                    lastModified: manufacturerSupplier.timestamp,
                  } as ManufacturerSupplierTableValue)
              )
          ),
          map((manufacturerSuppliers: ManufacturerSupplierTableValue[]) =>
            DataActions.fetchManufacturerSuppliersSuccess({
              materialClass,
              manufacturerSuppliers,
            })
          ),
          // TODO: implement proper error handling
          catchError(() => of(DataActions.fetchManufacturerSuppliersFailure()))
        )
      )
    );
  });

  public fetchMaterialStandards$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(DataActions.fetchMaterialStandards),
      concatLatestFrom(() => this.dataFacade.materialClass$),
      switchMap(([_action, materialClass]) =>
        this.msdDataService.fetchMaterialStandards(materialClass).pipe(
          map((materialStandards: MaterialStandardV2[]) =>
            materialStandards.map(
              (materialStandard) =>
                ({
                  id: materialStandard.id,
                  materialStandardMaterialName: materialStandard.materialName,
                  materialStandardStandardDocument:
                    materialStandard.standardDocument,
                  materialNumbers:
                    'materialNumber' in materialStandard
                      ? materialStandard.materialNumber
                      : undefined,
                  lastModified: materialStandard.timestamp,
                } as MaterialStandardTableValue)
            )
          ),
          map((materialStandards: MaterialStandardTableValue[]) =>
            DataActions.fetchMaterialStandardsSuccess({
              materialClass,
              materialStandards,
            })
          ),
          // TODO: implement proper error handling
          catchError(() => of(DataActions.fetchMaterialStandardsFailure()))
        )
      )
    );
  });
}
