import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { of } from 'rxjs';
import { catchError, map, mergeMap, withLatestFrom } from 'rxjs/operators';

import { Actions, createEffect, ofType } from '@ngrx/effects';
import { select, Store } from '@ngrx/store';

import { AppRoutePath } from '../../../../../app/app-route-path.enum';
import { AutocompleteService } from '../../../../case-view/create-case-dialog/services/autocomplete.service';
import { CreateCaseService } from '../../../../case-view/create-case-dialog/services/create-case.service';
import { ValidationService } from '../../../../shared/services/validationService/validation.service';
import {
  autocomplete,
  autocompleteFailure,
  autocompleteSuccess,
  createCase,
  createCaseFailure,
  createCaseSuccess,
  pasteRowDataItems,
  validateFailure,
  validateSuccess,
} from '../../actions';
import {
  CaseTableItem,
  CreateCase,
  CreateCaseResponse,
  MaterialValidation,
} from '../../models';
import { CaseState } from '../../reducers/create-case/create-case.reducer';
import { getCaseRowData, getCreateCaseData } from '../../selectors';

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

  /**
   * Create Case
   */
  createCase$ = createEffect(() =>
    this.actions$.pipe(
      ofType(createCase.type),
      withLatestFrom(this.store.pipe(select(getCreateCaseData))),
      map(([_action, createCaseData]) => createCaseData),
      mergeMap((createCaseData: CreateCase) =>
        this.createCaseService.createCase(createCaseData).pipe(
          map((createdCase: CreateCaseResponse) => {
            this.router.navigate([AppRoutePath.ProcessCaseViewPath], {
              queryParams: {
                quotation_number: createdCase.gqId,
                customer_number: createdCase.customerId,
              },
            });

            return createCaseSuccess({ createdCase });
          }),
          catchError((_e) => of(createCaseFailure()))
        )
      )
    )
  );
  constructor(
    private readonly actions$: Actions,
    private readonly autocompleteService: AutocompleteService,
    private readonly createCaseService: CreateCaseService,
    private readonly router: Router,
    private readonly store: Store<CaseState>,
    private readonly validationService: ValidationService
  ) {}
}
