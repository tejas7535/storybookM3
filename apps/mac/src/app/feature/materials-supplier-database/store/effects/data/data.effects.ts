import { Injectable } from '@angular/core';

import { catchError, map, of, switchMap } from 'rxjs';

import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';

import { StringOption } from '@schaeffler/inputs';

import { DataResult } from '@mac/msd/models';
import { MsdDataService } from '@mac/msd/services';
import * as DataActions from '@mac/msd/store/actions/data/data.actions';
import { getFilters } from '@mac/msd/store/selectors';

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
}
