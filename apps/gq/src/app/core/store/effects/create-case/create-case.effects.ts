import { Injectable } from '@angular/core';

import { of } from 'rxjs';
import { catchError, map, mergeMap, withLatestFrom } from 'rxjs/operators';

import { Actions, createEffect, ofType } from '@ngrx/effects';
import { select, Store } from '@ngrx/store';

import { AutocompleteService } from '../../../../case-view/create-case-dialog/services/autocomplete.service';
import { ValidationService } from '../../../../shared/services/validationService/validation.service';
import {
  autocomplete,
  autocompleteFailure,
  autocompleteSuccess,
  pasteRowDataItems,
  validateFailure,
  validateSuccess,
} from '../../actions';
import { CaseTableItem, MaterialValidation } from '../../models';
import { CaseState } from '../../reducers/create-case/create-case.reducer';
import { getCaseRowData } from '../../selectors';

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
  /**
   * Get Validation for materialnumbers
   */
  validate$ = createEffect(() =>
    this.actions$.pipe(
      ofType(pasteRowDataItems.type),
      withLatestFrom(this.store.pipe(select(getCaseRowData))),
      map(([_action, tableData]) => tableData),
      mergeMap((tableData: CaseTableItem[]) =>
        this.validationService.validate(tableData).pipe(
          map((materialValidations: MaterialValidation[]) =>
            validateSuccess({ materialValidations })
          ),
          catchError((_e) => of(validateFailure()))
        )
      )
    )
  );

  constructor(
    private readonly actions$: Actions,
    private readonly autocompleteService: AutocompleteService,
    private readonly store: Store<CaseState>,
    private readonly validationService: ValidationService
  ) {}
}
