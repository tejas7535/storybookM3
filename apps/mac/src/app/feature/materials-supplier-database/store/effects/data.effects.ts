import { Injectable } from '@angular/core';

import { catchError, map, of, switchMap } from 'rxjs';

import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';

import { StringOption } from '@schaeffler/inputs';

import {
  DataResult,
  ManufacturerSupplier,
  MaterialStandard,
} from '../../models';
import { getFilters } from '../selectors';
import { MsdDataService } from './../../services/msd-data/msd-data.service';
import * as DataActions from './../actions/data.actions';

@Injectable()
export class DataEffects {
  constructor(
    private readonly actions$: Actions,
    private readonly msdDataService: MsdDataService,
    private readonly store: Store
  ) {}

  public fetchMaterials$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(DataActions.fetchMaterials),
      concatLatestFrom(() => this.store.select(getFilters)),
      switchMap(
        ([_action, { materialClass, productCategory }]: [
          any,
          {
            materialClass: StringOption;
            productCategory: StringOption[];
          }
        ]) =>
          this.msdDataService
            .getMaterials(
              materialClass?.id?.toString(),
              productCategory?.map((category: StringOption) =>
                category?.id?.toString()
              )
            )
            .pipe(
              map((result: DataResult[]) =>
                DataActions.fetchMaterialsSuccess({ result })
              ),
              catchError(() =>
                // TODO: implement proper error handling
                of(DataActions.fetchMaterialsFailure())
              )
            )
      )
    );
  });

  public fetchClassAndCategoryOptions$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(DataActions.fetchClassAndCategoryOptions),
      switchMap(() => [
        DataActions.fetchClassOptions(),
        DataActions.fetchCategoryOptions(),
      ])
    );
  });

  public fetchClassOptions$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(DataActions.fetchClassOptions),
      switchMap(() =>
        this.msdDataService.getMaterialClasses().pipe(
          map((materialClassOptions: StringOption[]) =>
            DataActions.fetchClassOptionsSuccess({ materialClassOptions })
          ),
          catchError(() =>
            // TODO: implement proper error handling
            of(DataActions.fetchClassOptionsFailure())
          )
        )
      )
    );
  });

  public fetchCategoryOptions$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(DataActions.fetchCategoryOptions),
      switchMap(() =>
        this.msdDataService.getProductCategories().pipe(
          map((productCategoryOptions: StringOption[]) =>
            DataActions.fetchCategoryOptionsSuccess({ productCategoryOptions })
          ),
          catchError(() =>
            // TODO: implement proper error handling
            of(DataActions.fetchCategoryOptionsFailure())
          )
        )
      )
    );
  });

  public addMaterialDialogOpened$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(DataActions.addMaterialDialogOpened),
      switchMap(() => [
        DataActions.fetchMaterialStandards(),
        DataActions.fetchCo2Classifications(),
        DataActions.fetchManufacturerSuppliers(),
        DataActions.fetchRatings(),
        DataActions.fetchSteelMakingProcesses(),
        DataActions.fetchCastingModes(),
      ])
    );
  });

  public fetchMaterialStandards$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(DataActions.fetchMaterialStandards),
      switchMap(() =>
        this.msdDataService.fetchMaterialStandards().pipe(
          map((materialStandards: MaterialStandard[]) =>
            DataActions.fetchMaterialStandardsSuccess({ materialStandards })
          ),
          // TODO: implement proper error handling
          catchError(() => of(DataActions.fetchMaterialStandardsFailure()))
        )
      )
    );
  });

  public fetchCo2Classifications$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(DataActions.fetchCo2Classifications),
      switchMap(() =>
        this.msdDataService.fetchCo2Classifications().pipe(
          map((co2Classifications: StringOption[]) =>
            DataActions.fetchCo2ClassificationsSuccess({ co2Classifications })
          ),
          // TODO: implement proper error handling
          catchError(() => of(DataActions.fetchCo2ClassificationsFailure()))
        )
      )
    );
  });

  public fetchManufacturerSuppliers$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(DataActions.fetchManufacturerSuppliers),
      switchMap(() =>
        this.msdDataService.fetchManufacturerSuppliers().pipe(
          map((manufacturerSuppliers: ManufacturerSupplier[]) =>
            DataActions.fetchManufacturerSuppliersSuccess({
              manufacturerSuppliers,
            })
          ),
          // TODO: implement proper error handling
          catchError(() => of(DataActions.fetchManufacturerSuppliersFailure()))
        )
      )
    );
  });

  public fetchRatings$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(DataActions.fetchRatings),
      switchMap(() =>
        this.msdDataService.fetchRatings().pipe(
          map((ratings: string[]) =>
            DataActions.fetchRatingsSuccess({ ratings })
          ),
          // TODO: implement proper error handling
          catchError(() => of(DataActions.fetchRatingsFailure()))
        )
      )
    );
  });

  public fetchSteelMakingProcesses$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(DataActions.fetchSteelMakingProcesses),
      switchMap(() =>
        this.msdDataService.fetchSteelMakingProcesses().pipe(
          map((steelMakingProcesses: string[]) =>
            DataActions.fetchSteelMakingProcessesSuccess({
              steelMakingProcesses,
            })
          ),
          // TODO: implement proper error handling
          catchError(() => of(DataActions.fetchSteelMakingProcessesFailure()))
        )
      )
    );
  });

  public fetchCastingModes$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(DataActions.fetchCastingModes),
      switchMap(() =>
        this.msdDataService.fetchCastingModes().pipe(
          map((castingModes: string[]) =>
            DataActions.fetchCastingModesSuccess({ castingModes })
          ),
          // TODO: implement proper error handling
          catchError(() => of(DataActions.fetchCastingModesFailure()))
        )
      )
    );
  });

  public addMaterialDialogConfirmed$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(DataActions.addMaterialDialogConfirmed),
      switchMap(({ material }) =>
        this.msdDataService.createMaterial(material).pipe(
          map(() => DataActions.createMaterialComplete({ success: true })),
          // TODO: implement proper error handling
          catchError(() =>
            of(DataActions.createMaterialComplete({ success: false }))
          )
        )
      )
    );
  });
}
