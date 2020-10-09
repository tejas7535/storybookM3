import { Injectable } from '@angular/core';

import { of } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';

import { Actions, createEffect, ofType } from '@ngrx/effects';

import { AutocompleteService } from '../../../../pricing-view/input-section/services/autocomplete.service';
import {
  autocomplete,
  autocompleteCustomerSuccess,
  autocompleteFailure,
  autocompleteQuotationSuccess,
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
          map((options) => {
            switch (action.autocompleteSearch.filter) {
              case 'customer':
                return autocompleteCustomerSuccess({ options });
              case 'quotation':
                return autocompleteQuotationSuccess({ options });
              default:
                return autocompleteFailure();
            }
          }),
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
