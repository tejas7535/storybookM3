import { Injectable } from '@angular/core';

import { map, mergeMap } from 'rxjs';

import { Actions, createEffect, ofType } from '@ngrx/effects';

import { RestService } from '../../../services/rest/rest.service';
import {
  bearingSearchSuccess,
  searchBearing,
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
        //   catchError((_e) => of(getBearingLoadLatestFailure())
      )
    );
  });

  constructor(
    private readonly actions$: Actions,
    private readonly restService: RestService
  ) {}
}
