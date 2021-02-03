import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { of } from 'rxjs';
import {
  catchError,
  filter,
  map,
  mergeMap,
  tap,
  withLatestFrom,
} from 'rxjs/operators';

import { translate } from '@ngneat/transloco';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { select, Store } from '@ngrx/store';

import { SnackBarService } from '@schaeffler/snackbar';

import { AppRoutePath } from '../../../../app-route-path.enum';
import { AutocompleteService } from '../../../../case-view/create-case-dialog/services/autocomplete.service';
import { CreateCaseService } from '../../../../case-view/create-case-dialog/services/create-case.service';
import { SalesOrgsService } from '../../../../case-view/create-case-dialog/services/sales-orgs.service';
import { FilterNames } from '../../../../shared/autocomplete-input/filter-names.enum';
import { ValidationService } from '../../../../shared/services/validationService/validation.service';
import {
  autocomplete,
  autocompleteFailure,
  autocompleteSuccess,
  createCase,
  createCaseFailure,
  createCaseSuccess,
  getSalesOrgsFailure,
  getSalesOrgsSuccess,
  importCase,
  importCaseFailure,
  importCaseSuccess,
  pasteRowDataItems,
  selectAutocompleteOption,
  validateFailure,
  validateSuccess,
} from '../../actions';
import {
  CreateCase,
  CreateCaseResponse,
  ImportCaseResponse,
  MaterialTableItem,
  MaterialValidation,
  SalesOrg,
} from '../../models';
import { CaseState } from '../../reducers/create-case/create-case.reducer';
import {
  getCaseRowData,
  getCreateCaseData,
  getSelectedQuotation,
} from '../../selectors';

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
      mergeMap((tableData: MaterialTableItem[]) =>
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
          tap((createdCase: CreateCaseResponse) => {
            this.router.navigate([AppRoutePath.ProcessCaseViewPath], {
              queryParams: {
                quotation_number: createdCase.gqId,
                customer_number: createdCase.customerId,
              },
            });
            const successMessage = translate(
              'caseView.snackBarMessages.createSuccess'
            );
            this.snackBarService.showSuccessMessage(successMessage);
          }),
          map((createdCase: CreateCaseResponse) =>
            createCaseSuccess({ createdCase })
          ),
          catchError((_e) => of(createCaseFailure()))
        )
      )
    )
  );

  /**
   * Import Case from SAP
   */
  importCase$ = createEffect(() =>
    this.actions$.pipe(
      ofType(importCase.type),
      withLatestFrom(this.store.pipe(select(getSelectedQuotation))),
      map(([_action, importCaseData]) => importCaseData),
      mergeMap((importCaseData: ImportCaseResponse) =>
        this.createCaseService.importCase(importCaseData.sapId).pipe(
          tap((gqId: number) => {
            this.router.navigate([AppRoutePath.ProcessCaseViewPath], {
              queryParams: {
                quotation_number: gqId,
                customer_number: importCaseData.customerId,
              },
            });
            const successMessage = translate(
              'caseView.snackBarMessages.importSuccess'
            );
            this.snackBarService.showSuccessMessage(successMessage);
          }),
          map((gqId: number) => importCaseSuccess({ gqId })),
          catchError((_e) => of(importCaseFailure()))
        )
      )
    )
  );

  /**
   * Get Sales Orgs for customer
   */
  getSalesOrgs$ = createEffect(() =>
    this.actions$.pipe(
      ofType(selectAutocompleteOption.type),
      filter((action: any) => action.filter === FilterNames.CUSTOMER),
      mergeMap((action: any) =>
        this.salesOrgsService.getSalesOrgs(action.option.id).pipe(
          map((salesOrgs: SalesOrg[]) => getSalesOrgsSuccess({ salesOrgs })),
          catchError((errorMessage) =>
            of(getSalesOrgsFailure({ errorMessage }))
          )
        )
      )
    )
  );

  constructor(
    private readonly actions$: Actions,
    private readonly autocompleteService: AutocompleteService,
    private readonly salesOrgsService: SalesOrgsService,
    private readonly createCaseService: CreateCaseService,
    private readonly router: Router,
    private readonly store: Store<CaseState>,
    private readonly validationService: ValidationService,
    private readonly snackBarService: SnackBarService
  ) {}
}
