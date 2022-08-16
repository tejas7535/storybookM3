import { Injectable } from '@angular/core';

import { catchError, map, of, switchMap } from 'rxjs';

import { Actions, createEffect, ofType } from '@ngrx/effects';

import { StringOption } from '@schaeffler/inputs';

import {
  CreateMaterialState,
  ManufacturerSupplier,
  MaterialStandard,
} from '@mac/msd/models';
import { MsdDataService } from '@mac/msd/services';
import * as DialogActions from '@mac/msd/store/actions/dialog/dialog.actions';

@Injectable()
export class DialogEffects {
  constructor(
    private readonly actions$: Actions,
    private readonly msdDataService: MsdDataService
  ) {}

  public addMaterialDialogOpened$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(DialogActions.addMaterialDialogOpened),
      switchMap(() => [
        DialogActions.fetchMaterialStandards(),
        DialogActions.fetchCo2Classifications(),
        DialogActions.fetchManufacturerSuppliers(),
        DialogActions.fetchRatings(),
        DialogActions.fetchSteelMakingProcesses(),
        DialogActions.fetchCastingModes(),
      ])
    );
  });

  public fetchMaterialStandards$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(DialogActions.fetchMaterialStandards),
      switchMap(() =>
        this.msdDataService.fetchMaterialStandards().pipe(
          map((materialStandards: MaterialStandard[]) =>
            DialogActions.fetchMaterialStandardsSuccess({ materialStandards })
          ),
          // TODO: implement proper error handling
          catchError(() => of(DialogActions.fetchMaterialStandardsFailure()))
        )
      )
    );
  });

  public fetchCo2Classifications$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(DialogActions.fetchCo2Classifications),
      switchMap(() =>
        this.msdDataService.fetchCo2Classifications().pipe(
          map((co2Classifications: StringOption[]) =>
            DialogActions.fetchCo2ClassificationsSuccess({ co2Classifications })
          ),
          // TODO: implement proper error handling
          catchError(() => of(DialogActions.fetchCo2ClassificationsFailure()))
        )
      )
    );
  });

  public fetchManufacturerSuppliers$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(DialogActions.fetchManufacturerSuppliers),
      switchMap(() =>
        this.msdDataService.fetchManufacturerSuppliers().pipe(
          map((manufacturerSuppliers: ManufacturerSupplier[]) =>
            DialogActions.fetchManufacturerSuppliersSuccess({
              manufacturerSuppliers,
            })
          ),
          // TODO: implement proper error handling
          catchError(() =>
            of(DialogActions.fetchManufacturerSuppliersFailure())
          )
        )
      )
    );
  });

  public fetchRatings$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(DialogActions.fetchRatings),
      switchMap(() =>
        this.msdDataService.fetchRatings().pipe(
          map((ratings: string[]) =>
            DialogActions.fetchRatingsSuccess({ ratings })
          ),
          // TODO: implement proper error handling
          catchError(() => of(DialogActions.fetchRatingsFailure()))
        )
      )
    );
  });

  public fetchSteelMakingProcesses$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(DialogActions.fetchSteelMakingProcesses),
      switchMap(() =>
        this.msdDataService.fetchSteelMakingProcesses().pipe(
          map((steelMakingProcesses: string[]) =>
            DialogActions.fetchSteelMakingProcessesSuccess({
              steelMakingProcesses,
            })
          ),
          // TODO: implement proper error handling
          catchError(() => of(DialogActions.fetchSteelMakingProcessesFailure()))
        )
      )
    );
  });

  public fetchCastingModes$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(DialogActions.fetchCastingModes),
      switchMap(() =>
        this.msdDataService.fetchCastingModes().pipe(
          map((castingModes: string[]) =>
            DialogActions.fetchCastingModesSuccess({ castingModes })
          ),
          // TODO: implement proper error handling
          catchError(() => of(DialogActions.fetchCastingModesFailure()))
        )
      )
    );
  });

  public addMaterialDialogConfirmed$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(DialogActions.addMaterialDialogConfirmed),
      switchMap(({ standard, supplier, material }) => [
        DialogActions.postMaterialStandard({
          record: {
            standard,
            supplier,
            material,
            state: CreateMaterialState.Initial,
            error: false,
          },
        }),
      ])
    );
  });

  public postMaterialStandard$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(DialogActions.postMaterialStandard),
      switchMap(({ record }) =>
        record.standard.id
          ? // material standard already exists
            of(
              DialogActions.postManufacturerSupplier({
                record: {
                  ...record,
                  state: CreateMaterialState.MaterialStandardSkipped,
                },
              })
            )
          : // create new material standard entry
            this.msdDataService.createMaterialStandard(record.standard).pipe(
              map((response) =>
                DialogActions.postManufacturerSupplier({
                  record: {
                    ...record,
                    material: {
                      ...record.material,
                      materialStandardId: response.id,
                    },
                    state: CreateMaterialState.MaterialStandardCreated,
                  },
                })
              ),
              // TODO: implement proper error handling
              catchError(() =>
                of(
                  DialogActions.createMaterialComplete({
                    record: {
                      ...record,
                      state: CreateMaterialState.MaterialStandardCreationFailed,
                      error: true,
                    },
                  })
                )
              )
            )
      )
    );
  });

  public postManufacturerSupplier$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(DialogActions.postManufacturerSupplier),
      switchMap(({ record }) =>
        record.supplier.id
          ? // skip creating manufacturer
            of(
              DialogActions.postMaterial({
                record: {
                  ...record,
                  state: CreateMaterialState.ManufacturerSupplierSkipped,
                },
              })
            )
          : // create new manufacturer
            this.msdDataService
              .createManufacturerSupplier(record.supplier)
              .pipe(
                map((response) =>
                  DialogActions.postMaterial({
                    record: {
                      ...record,
                      material: {
                        ...record.material,
                        manufacturerSupplierId: response.id,
                      },
                      state: CreateMaterialState.ManufacturerSupplierCreated,
                    },
                  })
                ),
                // TODO: implement proper error handling
                catchError(() =>
                  of(
                    DialogActions.createMaterialComplete({
                      record: {
                        ...record,
                        state:
                          CreateMaterialState.ManufacturerSupplierCreationFailed,
                        error: true,
                      },
                    })
                  )
                )
              )
      )
    );
  });

  public postMaterial$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(DialogActions.postMaterial),
      switchMap(({ record }) =>
        this.msdDataService.createMaterial(record.material).pipe(
          map(() =>
            DialogActions.createMaterialComplete({
              record: {
                ...record,
                // there is currently no place in Material to store the ID...
                state: CreateMaterialState.MaterialCreated,
              },
            })
          ),
          // TODO: implement proper error handling
          catchError(() =>
            of(
              DialogActions.createMaterialComplete({
                record: {
                  ...record,
                  state: CreateMaterialState.MaterialCreationFailed,
                  error: true,
                },
              })
            )
          )
        )
      )
    );
  });

  public fetchCastingDiameters$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(DialogActions.fetchCastingDiameters),
      switchMap(({ supplierId, castingMode }) => {
        if (!supplierId || !castingMode) {
          return of(
            DialogActions.fetchCastingDiametersSuccess({ castingDiameters: [] })
          );
        }

        return this.msdDataService
          .fetchCastingDiameters(supplierId, castingMode)
          .pipe(
            map((castingDiameters) =>
              DialogActions.fetchCastingDiametersSuccess({ castingDiameters })
            ),
            catchError(() => of(DialogActions.fetchCastingDiametersFailure()))
          );
      })
    );
  });
}
