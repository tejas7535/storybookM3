import { Injectable } from '@angular/core';

import { of } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';

import { Actions, createEffect, ofType, OnInitEffects } from '@ngrx/effects';
import { Action } from '@ngrx/store';

import { DataService } from '../../../http/data.service';
import { getThing, getThingFailure, getThingSuccess } from '../../actions';

@Injectable()
export class ThingEffects implements OnInitEffects {
  /**
   * Load Thing
   */
  thing$ = createEffect(() =>
    this.actions$.pipe(
      ofType(getThing.type),
      map((action: any) => action.thingId),
      mergeMap((thingId) =>
        this.dataService.getIotThings(thingId).pipe(
          map((thing) => getThingSuccess({ thing })),
          catchError((_e) => of(getThingFailure()))
        )
      )
    )
  );

  constructor(
    private readonly actions$: Actions,
    private readonly dataService: DataService
  ) {}

  /**
   * Get mock thing initially
   */
  ngrxOnInitEffects(): Action {
    return getThing({ thingId: 123 });
  }
}
