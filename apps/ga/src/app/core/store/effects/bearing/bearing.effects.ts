import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { catchError, map, mergeMap, of } from 'rxjs';
import { tap } from 'rxjs/operators';

import { translate } from '@ngneat/transloco';
import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';

import { AppRoutePath } from '../../../../app-route-path.enum';
import { GreaseCalculationPath } from '../../../../grease-calculation/grease-calculation-path.enum';
import { ExtendedSearchParameters } from '../../../../shared/models';
import { ErrorService, RestService } from '../../../services';
import {
  bearingSearchExtendedFailure,
  bearingSearchExtendedSuccess,
  bearingSearchSuccess,
  modelCreateFailure,
  modelCreateSuccess,
  searchBearing,
  searchBearingExtended,
  selectBearing,
} from '../../actions/bearing/bearing.actions';
import { getSelectedBearing } from '../../selectors/bearing/bearing.selector';

@Injectable()
export class BearingEffects {
  bearingSearch$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(searchBearing),
      map((action) => action.query),
      mergeMap(
        (query: string) =>
          this.restService
            .getBearingSearch(query)
            .pipe(
              map((resultList: string[]) =>
                bearingSearchSuccess({ resultList })
              )
            )
        //   catchError((_e) => of(bearingSearchFailure())
      )
    );
  });

  extendedBearingSearch$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(searchBearingExtended),
      map((action) => action.parameters),
      mergeMap((parameters: ExtendedSearchParameters) =>
        this.restService.getBearingExtendedSearch(parameters).pipe(
          map((resultList: string[]) =>
            bearingSearchExtendedSuccess({ resultList })
          ),
          catchError((_e) => of(bearingSearchExtendedFailure()))
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
                translate('bearing.modelCreationError', { bearing }),
                translate('bearing.close')
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
