import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { catchError, map, mergeMap, of } from 'rxjs';
import { tap } from 'rxjs/operators';

import { translate } from '@ngneat/transloco';
import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';

import { AppRoutePath } from '@ga/app-route-path.enum';
import { ErrorService, RestService } from '@ga/core/services';
import {
  advancedBearingSelectionCountFailure,
  advancedBearingSelectionCountSuccess,
  advancedBearingSelectionFailure,
  advancedBearingSelectionSuccess,
  bearingSearchSuccess,
  modelCreateFailure,
  modelCreateSuccess,
  searchBearing,
  searchBearingForAdvancedSelection,
  searchBearingForAdvancedSelectionCount,
  selectBearing,
} from '@ga/core/store/actions';
import { GreaseCalculationPath } from '@ga/features/grease-calculation/grease-calculation-path.enum';
import {
  AdvancedBearingSelectionFilters,
  BearingInfo,
} from '@ga/shared/models';

import { getSelectedBearing } from '../../selectors/bearing-selection/bearing-selection.selector';

@Injectable()
export class BearingSelectionEffects {
  bearingSearch$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(searchBearing),
      map((action) => action.query),
      mergeMap(
        (query: string) =>
          this.restService
            .getBearingSearch(query)
            .pipe(
              map((resultList: BearingInfo[]) =>
                bearingSearchSuccess({ resultList })
              )
            )
        //   catchError((_e) => of(bearingSearchFailure())
      )
    );
  });

  searchBearingForAdvancedSelection$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(searchBearingForAdvancedSelection),
      map((action) => action.selectionFilters),
      mergeMap((selectionFilters: AdvancedBearingSelectionFilters) =>
        this.restService.getBearingExtendedSearch(selectionFilters).pipe(
          map((resultList: BearingInfo[]) =>
            advancedBearingSelectionSuccess({ resultList })
          ),
          catchError((_e) => of(advancedBearingSelectionFailure()))
        )
      )
    );
  });

  searchBearingForAdvancedSelectionCount$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(searchBearingForAdvancedSelectionCount),
      map((action) => action.selectionFilters),
      mergeMap((selectionFilters: AdvancedBearingSelectionFilters) =>
        this.restService.getBearingExtendedSearchCount(selectionFilters).pipe(
          map((resultsCount: number) =>
            advancedBearingSelectionCountSuccess({ resultsCount })
          ),
          catchError((_e) => of(advancedBearingSelectionCountFailure()))
        )
      )
    );
  });

  createModel$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(selectBearing),
      concatLatestFrom(() => this.store.select(getSelectedBearing)),
      map(([_action, bearing]) => bearing as string),
      mergeMap((bearing: string) =>
        this.restService.putModelCreate(bearing).pipe(
          tap((modelId) => {
            if (modelId) {
              this.router.navigate([
                `${AppRoutePath.GreaseCalculationPath}/${GreaseCalculationPath.ParametersPath}`,
              ]);
            } else {
              this.errorService.openSnackBar(
                translate(
                  'bearing.bearingSelection.advancedSelection.error.modelCreation',
                  { bearing }
                ),
                translate('shared.button.close')
              );
            }
          }),
          map((modelId) =>
            modelId ? modelCreateSuccess({ modelId }) : modelCreateFailure()
          ),
          catchError((_e) => {
            this.errorService.openGenericSnackBar();

            return of(modelCreateFailure());
          })
        )
      )
    );
  });

  constructor(
    private readonly actions$: Actions,
    private readonly restService: RestService,
    private readonly store: Store,
    private readonly router: Router,
    private readonly errorService: ErrorService
  ) {}
}
