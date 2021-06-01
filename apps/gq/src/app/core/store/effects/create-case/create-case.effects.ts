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
import {
  CreateCase,
  CreateCaseResponse,
  SalesOrg,
} from '../../../../core/store/reducers/create-case/models';
import { FilterNames } from '../../../../shared/autocomplete-input/filter-names.enum';
import { Quotation } from '../../../../shared/models';
import { IdValue } from '../../../../shared/models/search';
import {
  MaterialTableItem,
  MaterialValidation,
} from '../../../../shared/models/table';
import { HelperService } from '../../../../shared/services/helper-service/helper-service.service';
import { MaterialService } from '../../../../shared/services/rest-services/material-service/material.service';
import { QuotationService } from '../../.././../shared/services/rest-services/quotation-service/quotation.service';
import { SearchService } from '../../.././../shared/services/rest-services/search-service/search.service';
import {
  autocomplete,
  autocompleteFailure,
  autocompleteSuccess,
  createCase,
  createCaseFailure,
  createCaseSuccess,
  getPLsAndSeries,
  getPLsAndSeriesFailure,
  getPLsAndSeriesSuccess,
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
        this.searchService.autocomplete(action.autocompleteSearch).pipe(
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
        this.materialService.validateMaterials(tableData).pipe(
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
        this.quotationService.createCase(createCaseData).pipe(
          tap((createdCase: CreateCaseResponse) => {
            this.router.navigate([AppRoutePath.ProcessCaseViewPath], {
              queryParams: {
                quotation_number: createdCase.gqId,
                customer_number: createdCase.customerId,
                sales_org: createdCase.salesOrg,
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
          catchError((errorMessage) => of(createCaseFailure({ errorMessage })))
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
      map(([_action, idValue]) => idValue),
      mergeMap((importedCase: IdValue) =>
        this.quotationService.importCase(importedCase.id).pipe(
          tap((quotation: Quotation) => {
            this.router.navigate([AppRoutePath.ProcessCaseViewPath], {
              queryParams: {
                quotation_number: quotation.gqId,
                customer_number: quotation.customer.identifier.customerId,
                sales_org: quotation.customer.identifier.salesOrg,
              },
            });
            const successMessage = translate(
              'caseView.snackBarMessages.importSuccess'
            );
            this.snackBarService.showSuccessMessage(successMessage);
          }),
          map((quotation: Quotation) =>
            importCaseSuccess({ gqId: quotation.gqId })
          ),
          catchError((errorMessage) => of(importCaseFailure({ errorMessage })))
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
        this.searchService.getSalesOrgs(action.option.id).pipe(
          map((salesOrgs: SalesOrg[]) => getSalesOrgsSuccess({ salesOrgs })),
          catchError((errorMessage) =>
            of(getSalesOrgsFailure({ errorMessage }))
          )
        )
      )
    )
  );

  /*
   * Get Product lines and Series
   */
  getPLsAndSeries$ = createEffect(() =>
    this.actions$.pipe(
      ofType(getPLsAndSeries),
      mergeMap((action) =>
        this.searchService.getPlsAndSeries(action.customerFilters).pipe(
          map((response) =>
            HelperService.transformPLsAndSeriesResponse(response)
          ),
          map((plsAndSeries) => getPLsAndSeriesSuccess({ plsAndSeries })),
          catchError((errorMessage) =>
            of(getPLsAndSeriesFailure({ errorMessage }))
          )
        )
      )
    )
  );

  constructor(
    private readonly actions$: Actions,
    private readonly searchService: SearchService,
    private readonly quotationService: QuotationService,
    private readonly router: Router,
    private readonly store: Store<CaseState>,
    private readonly materialService: MaterialService,
    private readonly snackBarService: SnackBarService
  ) {}
}
