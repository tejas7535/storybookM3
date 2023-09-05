import { Injectable } from '@angular/core';

import { catchError, map, of, switchMap, tap } from 'rxjs';

import { translate } from '@ngneat/transloco';
import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { TypedAction } from '@ngrx/store/src/models';

import {
  MaterialClass,
  NavigationLevel,
} from '@mac/feature/materials-supplier-database/constants';
import {
  DataResult,
  ManufacturerSupplierTableValue,
  Material,
  MaterialStandardTableValue,
  SAPMaterialsRequest,
  SAPMaterialsResponse,
} from '@mac/msd/models';
import { MsdDataService } from '@mac/msd/services/msd-data';
import { MsdSnackbarService } from '@mac/msd/services/msd-snackbar';
import * as DataActions from '@mac/msd/store/actions/data/data.actions';
import * as DialogActions from '@mac/msd/store/actions/dialog/dialog.actions';
import { DataFacade } from '@mac/msd/store/facades/data';

@Injectable()
export class DataEffects {
  public fetchResult$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(DataActions.fetchResult),
      concatLatestFrom(() => this.dataFacade.navigation$),
      switchMap(([_action, { navigationLevel, materialClass }]) => {
        if (materialClass === MaterialClass.SAP_MATERIAL) {
          return [];
        }
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
      ofType(DataActions.fetchMaterials, DataActions.fetchSAPMaterials),
      concatLatestFrom(() => this.dataFacade.navigation$),
      switchMap(([action, { materialClass }]) => {
        if (materialClass !== MaterialClass.SAP_MATERIAL) {
          return this.msdDataService.getMaterials(materialClass).pipe(
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
          );
        }

        const sapAction = action as {
          request: SAPMaterialsRequest;
        } & TypedAction<'[MSD - Data] Fetch SAP Materials'>;

        return this.msdDataService.fetchSAPMaterials(sapAction.request).pipe(
          map((result: SAPMaterialsResponse) =>
            DataActions.fetchSAPMaterialsSuccess({
              ...result,
              startRow: sapAction.request.startRow,
            })
          ),
          catchError(() =>
            of(
              DataActions.fetchSAPMaterialsFailure({
                startRow: sapAction.request.startRow,
              })
            )
          )
        );
      })
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

  public setAgGridFilter$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(DataActions.setAgGridFilter),
      concatLatestFrom(() => this.dataFacade.navigation$),
      switchMap(([{ filterModel }, { materialClass, navigationLevel }]) => [
        DataActions.setAgGridFilterForNavigation({
          filterModel,
          materialClass,
          navigationLevel,
        }),
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
        DataActions.infoSnackBar({
          message: translate(
            'materialsSupplierDatabase.mainTable.confirmDialog.successDeleteEntity'
          ),
        }),
      ])
    );
  });

  public deleteEntityFailure$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(DataActions.deleteEntityFailure),
      map(() =>
        DataActions.infoSnackBar({
          message: translate(
            'materialsSupplierDatabase.mainTable.confirmDialog.failureDeleteEntity'
          ),
        })
      )
    );
  });

  public infoSnackBar$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(DataActions.infoSnackBar),
        tap(({ message }) => this.matSnackBar.infoTranslated(message))
      );
    },
    { dispatch: false }
  );

  public errorSnackBar$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(DataActions.errorSnackBar),
        tap(({ message, detailMessage, items }) =>
          this.matSnackBar.errorTranslated(message, detailMessage, items)
        )
      );
    },
    { dispatch: false }
  );

  constructor(
    private readonly actions$: Actions,
    private readonly msdDataService: MsdDataService,
    private readonly dataFacade: DataFacade,
    private readonly matSnackBar: MsdSnackbarService
  ) {}
}
