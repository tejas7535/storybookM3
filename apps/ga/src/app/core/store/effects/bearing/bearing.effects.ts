import { Injectable } from '@angular/core';

import { map, mergeMap, withLatestFrom } from 'rxjs';

import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';

import { getSelectedBearing } from '../..';
import { RestService } from '../../../services/rest/rest.service';
import {
  bearingSearchSuccess,
  modelCreateFailure,
  modelCreateSuccess,
  searchBearing,
  selectBearing,
} from '../../actions/bearing/bearing.actions';

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

  createModel$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(selectBearing),
      withLatestFrom(this.store.select(getSelectedBearing)),
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
