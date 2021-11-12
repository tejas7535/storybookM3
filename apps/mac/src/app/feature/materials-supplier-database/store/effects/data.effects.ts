import { Injectable } from '@angular/core';

import { catchError, map, of, switchMap, withLatestFrom } from 'rxjs';

import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';

import { DataResult } from '../../models';
import { getFilters } from '../selectors';
import { DataFilter } from './../../models/data/data-filter.model';
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
      withLatestFrom(this.store.select(getFilters)),
      switchMap(
        ([_action, { materialClass, productCategory }]: [
          any,
          {
            materialClass: DataFilter;
            productCategory: DataFilter[];
          }
        ]) =>
          this.msdDataService
            .getMaterials(
              materialClass.id,
              productCategory?.map((category: DataFilter) => category.id)
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
          map((materialClassOptions: DataFilter[]) =>
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
          map((productCategoryOptions: DataFilter[]) =>
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
