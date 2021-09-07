import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { map, mergeMap } from 'rxjs';
import { withLatestFrom } from 'rxjs/operators';

import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';

import { RestService } from '../../../services/rest/rest.service';
import {
  bearingSearchSuccess,
  searchBearing,
  selectBearing,
  updateRouteParams,
} from '../../actions/bearing/bearing.actions';
import { getSelectedBearing } from '../../selectors';

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

  bearingSelected$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(selectBearing),
      map(() => {
        return updateRouteParams();
      })
    );
  });

  updateRouteParams$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(updateRouteParams),
        withLatestFrom(this.store.select(getSelectedBearing)),
        map(([_action, bearing]) => {
          if (bearing) {
            this.router.navigate([], {
              relativeTo: this.route,
              queryParams: { bearing },
              queryParamsHandling: 'merge',
            });
          }
        })
      );
    },
    { dispatch: false }
  );

  constructor(
    private readonly actions$: Actions,
    private readonly restService: RestService,
    private readonly store: Store,
    private readonly router: Router,
    private readonly route: ActivatedRoute
  ) {}
}
