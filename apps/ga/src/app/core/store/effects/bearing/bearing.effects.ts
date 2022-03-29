import { Injectable } from '@angular/core';

import { map, mergeMap } from 'rxjs';

import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';

import { ExtendedSearchParameters } from '../../../../shared/models';
import { RestService } from '../../../services/rest/rest.service';
import {
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
      map((action: any) => action.query),
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
      mergeMap(
        (parameters: ExtendedSearchParameters) =>
          this.restService
            .getBearingExtendedSearch(parameters)
            .pipe(
              map((resultList: string[]) =>
                bearingSearchExtendedSuccess({ resultList })
              )
            )
        //   catchError((_e) => of(bearingSearchExtendedFailure())
      )
    );
  });

  createModel$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(selectBearing),
      concatLatestFrom(() => this.store.select(getSelectedBearing)),
      map(([_action, bearing]) => bearing as string),
      mergeMap(
        (bearing: string) =>
          this.restService
            .putModelCreate(bearing)
            .pipe(
              map((modelId: string) =>
                modelId ? modelCreateSuccess({ modelId }) : modelCreateFailure()
              )
            )
        //   catchError((_e) => of(modelCreateFailure())
      )
    );
  });

  constructor(
    private readonly actions$: Actions,
    private readonly restService: RestService,
    private readonly store: Store
  ) {}
}
