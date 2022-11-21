import { Injectable } from '@angular/core';

import { catchError, map, of, switchMap } from 'rxjs';

import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';

import { StringOption } from '@schaeffler/inputs';

import { MaterialClass } from '@mac/feature/materials-supplier-database/constants';
import { DataResult, MaterialV2 } from '@mac/msd/models';
import { MsdDataService } from '@mac/msd/services';
import * as DataActions from '@mac/msd/store/actions/data/data.actions';
import { DataFacade } from '@mac/msd/store/facades/data';

@Injectable()
export class DataEffects {
  constructor(
    private readonly actions$: Actions,
    private readonly msdDataService: MsdDataService,
    private readonly dataFacade: DataFacade
  ) {}

  public fetchMaterials$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(DataActions.fetchMaterials),
      concatLatestFrom(() => this.dataFacade.filters$),
      switchMap(([_action, { materialClass, productCategory }]) =>
        this.msdDataService
          .getMaterials(
            materialClass?.id as MaterialClass,
            productCategory?.map((category) => category?.id?.toString())
          )
          .pipe(
            map((result: DataResult[] | MaterialV2[]) =>
              DataActions.fetchMaterialsSuccess({
                materialClass: materialClass?.id as MaterialClass,
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
      concatLatestFrom(() => this.dataFacade.materialClass$),
      switchMap(([_action, materialClass]) =>
        this.msdDataService.getProductCategories(materialClass).pipe(
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
