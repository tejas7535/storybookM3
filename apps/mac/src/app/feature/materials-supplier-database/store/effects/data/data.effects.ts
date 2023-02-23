import { Injectable } from '@angular/core';

import { catchError, map, of, switchMap, tap } from 'rxjs';

import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';

import {
  MaterialClass,
  NavigationLevel,
} from '@mac/feature/materials-supplier-database/constants';
import {
  DataResult,
  ManufacturerSupplierTableValue,
  Material,
  MaterialStandardTableValue,
} from '@mac/msd/models';
import { MsdDataService } from '@mac/msd/services/msd-data';
import { MsdSnackbarService } from '@mac/msd/services/msd-snackbar';
import * as DataActions from '@mac/msd/store/actions/data/data.actions';
import * as DialogActions from '@mac/msd/store/actions/dialog/dialog.actions';
import { DataFacade } from '@mac/msd/store/facades/data';

@Injectable()
export class DataEffects {
  constructor(
    private readonly actions$: Actions,
    private readonly msdDataService: MsdDataService,
    private readonly dataFacade: DataFacade,
    // private readonly matSnackBar: MatSnackBar
    private readonly matSnackBar: MsdSnackbarService
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
          map((result: DataResult[] | Material[]) =>
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
          map((manufacturerSuppliers) =>
            this.msdDataService.mapSuppliersToTableView(manufacturerSuppliers)
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
          map((materialStandards) =>
            this.msdDataService.mapStandardsToTableView(materialStandards)
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

  public deleteEntity$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(DataActions.deleteEntity),
      concatLatestFrom(() => this.dataFacade.navigation$),
      switchMap(([{ id }, { navigationLevel, materialClass }]) => {
        switch (navigationLevel) {
          case NavigationLevel.MATERIAL:
            return [DataActions.deleteMaterial({ id, materialClass })];
          case NavigationLevel.STANDARD:
            return [DataActions.deleteMaterialStandard({ id, materialClass })];
          case NavigationLevel.SUPPLIER:
            return [
              DataActions.deleteManufacturerSupplier({ id, materialClass }),
            ];
          default:
            return [];
        }
      })
    );
  });

  public deleteMaterial$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(DataActions.deleteMaterial),
      switchMap(({ id, materialClass }) =>
        this.msdDataService.deleteMaterial(id, materialClass).pipe(
          map(() => DataActions.deleteEntitySuccess()),
          catchError(() => of(DataActions.deleteEntityFailure()))
        )
      )
    );
  });

  public deleteMaterialStandard$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(DataActions.deleteMaterialStandard),
      switchMap(({ id, materialClass }) =>
        this.msdDataService.deleteMaterialStandard(id, materialClass).pipe(
          map(() => DataActions.deleteEntitySuccess()),
          catchError(() => of(DataActions.deleteEntityFailure()))
        )
      )
    );
  });

  public deleteManufacturerSupplier$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(DataActions.deleteManufacturerSupplier),
      switchMap(({ id, materialClass }) =>
        this.msdDataService.deleteManufacturerSupplier(id, materialClass).pipe(
          map(() => DataActions.deleteEntitySuccess()),
          catchError(() => of(DataActions.deleteEntityFailure()))
        )
      )
    );
  });

  public deleteEntitySuccess$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(DataActions.deleteEntitySuccess),
      switchMap(() => [
        DataActions.fetchResult(),
        DataActions.openSnackBar({
          msgKey:
            'materialsSupplierDatabase.mainTable.confirmDialog.successDeleteEntity',
        }),
      ])
    );
  });

  public deleteEntityFailure$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(DataActions.deleteEntityFailure),
      map(() =>
        DataActions.openSnackBar({
          msgKey:
            'materialsSupplierDatabase.mainTable.confirmDialog.failureDeleteEntity',
        })
      )
    );
  });

  public openSnackBar$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(DataActions.openSnackBar),
        tap(({ msgKey }) => this.matSnackBar.open(msgKey))
      );
    },
    { dispatch: false }
  );
}
