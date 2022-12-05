import { Injectable } from '@angular/core';

import { catchError, map, of, switchMap } from 'rxjs';

import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';

import { MaterialClass } from '@mac/feature/materials-supplier-database/constants';
import { DataResult, MaterialV2 } from '@mac/msd/models';
import { MsdDataService } from '@mac/msd/services/msd-data';
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
      switchMap(() => [DataActions.fetchMaterials()])
    );
  });
}
