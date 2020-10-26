import { Injectable } from '@angular/core';

import { of } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';

import { Actions, createEffect, ofType } from '@ngrx/effects';

import { AutocompleteService } from '../../../../pricing-view/input-section/services/autocomplete.service';
import {
  autocomplete,
  autocompleteFailure,
  autocompleteSuccess,
} from '../../actions';

/**
 * Effect class for all tagging related actions which trigger side effects
 */
@Injectable()
export class CreateCaseEffects {
  /**
   * Get possible values for a form field
   *
   */
  autocomplete$ = createEffect(() =>
    this.actions$.pipe(
      ofType(autocomplete.type),
      mergeMap((action: any) =>
        this.autocompleteService.autocomplete(action.autocompleteSearch).pipe(
          map((options) =>
            autocompleteSuccess({
              options,
              filter: action.autocompleteSearch.filter,
            })
          ),
          catchError((_e) => of(autocompleteFailure()))
        )
      )
    )
  );

  constructor(
    private readonly actions$: Actions,
    private readonly autocompleteService: AutocompleteService
  ) {}
}
