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
import { Store } from '@ngrx/store';

import { SnackBarService } from '@schaeffler/snackbar';

import { AppRoutePath } from '../../../../app-route-path.enum';
import { FilterNames } from '../../../../shared/autocomplete-input/filter-names.enum';
import { Quotation } from '../../../../shared/models';
import { IdValue } from '../../../../shared/models/search';
import {
  MaterialTableItem,
  MaterialValidation,
} from '../../../../shared/models/table';
import { HelperService } from '../../../../shared/services/helper-service/helper-service.service';
import { MaterialService } from '../../../../shared/services/rest-services/material-service/material.service';
import { QuotationService } from '../../../../shared/services/rest-services/quotation-service/quotation.service';
import { SearchService } from '../../../../shared/services/rest-services/search-service/search.service';
import {
  autocomplete,
  autocompleteFailure,
  autocompleteSuccess,
  createCase,
  createCaseFailure,
  createCaseSuccess,
  createCustomerCase,
  createCustomerCaseFailure,
  createCustomerCaseSuccess,
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
  setSelectedAutocompleteOption,
  validateFailure,
  validateSuccess,
} from '../../actions';
import {
  CreateCase,
  CreateCaseResponse,
  SalesOrg,
} from '../../reducers/create-case/models';
import {
  getAutoSelectMaterial,
  getCaseRowData,
  getCreateCaseData,
  getCreateCustomerCasePayload,
  getSelectedQuotation,
} from '../../selectors';
import { CreationType } from './creation-type.enum';

/**
 * Effect class for all tagging related actions which trigger side effects
 */
@Injectable()
export class CreateCaseEffects {
  /**
   * Get possible values for a form field
   *
   */
  autocomplete$ = createEffect(() => {
    return this.actions$.pipe(
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
    );
  });
  /**
   * Get Validation for materialnumbers
   */
  validate$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(pasteRowDataItems.type),
      withLatestFrom(this.store.select(getCaseRowData)),
      map(([_action, tableData]) => tableData),
      mergeMap((tableData: MaterialTableItem[]) =>
        this.materialService.validateMaterials(tableData).pipe(
          map((materialValidations: MaterialValidation[]) =>
            validateSuccess({ materialValidations })
          ),
          catchError((_e) => of(validateFailure()))
        )
      )
    );
  });

  autoSelectMaterial$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(autocompleteSuccess.type),
      withLatestFrom(this.store.select(getAutoSelectMaterial)),
      filter(([_action, caseFilterItem]) => !!caseFilterItem),
      map(([_action, caseFilterItem]) =>
        setSelectedAutocompleteOption({
          filter: caseFilterItem.filter,
          option: caseFilterItem.options[0],
        })
      )
    );
  });

  /**
   * Create Case
   */
  createCase$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(createCase.type),
      withLatestFrom(this.store.select(getCreateCaseData)),
      map(([_action, createCaseData]) => createCaseData),
      mergeMap((createCaseData: CreateCase) =>
        this.quotationService.createCase(createCaseData).pipe(
          tap((createdCase: CreateCaseResponse) => {
            this.navigateAfterCaseCreate(
              createdCase.customerId,
              createdCase.salesOrg,
              createdCase.gqId,
              CreationType.CREATE_CASE
            );
          }),
          map((createdCase: CreateCaseResponse) =>
            createCaseSuccess({ createdCase })
          ),
          catchError((errorMessage) => of(createCaseFailure({ errorMessage })))
        )
      )
    );
  });

  /**
   * Import Case from SAP
   */
  importCase$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(importCase.type),
      withLatestFrom(this.store.select(getSelectedQuotation)),
      map(([_action, idValue]) => idValue),
      mergeMap((importedCase: IdValue) =>
        this.quotationService.importCase(importedCase.id).pipe(
          tap((quotation: Quotation) => {
            this.navigateAfterCaseCreate(
              quotation.customer.identifier.customerId,
              quotation.customer.identifier.salesOrg,
              quotation.gqId,
              quotation.reImported ? CreationType.REIMPORT : CreationType.IMPORT
            );
          }),
          map((quotation: Quotation) =>
            importCaseSuccess({ gqId: quotation.gqId })
          ),
          catchError((errorMessage) => of(importCaseFailure({ errorMessage })))
        )
      )
    );
  });

  /**
   * Get Sales Orgs for customer
   */
  getSalesOrgs$ = createEffect(() => {
    return this.actions$.pipe(
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
    );
  });

  /*
   * Get Product lines and Series
   */
  getPLsAndSeries$ = createEffect(() => {
    return this.actions$.pipe(
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
    );
  });

  /*
   * Create Customer Case
   */
  createCustomerCase$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(createCustomerCase),
      withLatestFrom(this.store.select(getCreateCustomerCasePayload)),
      map(([_action, requestPayload]) => requestPayload),
      mergeMap((requestPayload) =>
        this.quotationService.createCustomerCase(requestPayload).pipe(
          tap((response) =>
            this.navigateAfterCaseCreate(
              response.customerId,
              response.salesOrg,
              response.gqId,
              CreationType.CREATE_CASE
            )
          ),
          map(() => createCustomerCaseSuccess()),
          catchError((errorMessage) =>
            of(createCustomerCaseFailure({ errorMessage }))
          )
        )
      )
    );
  });

  constructor(
    private readonly actions$: Actions,
    private readonly searchService: SearchService,
    private readonly quotationService: QuotationService,
    private readonly router: Router,
    private readonly store: Store,
    private readonly materialService: MaterialService,
    private readonly snackBarService: SnackBarService
  ) {}

  navigateAfterCaseCreate(
    customerId: string,
    salesOrg: string,
    gqId: number,
    creationType: CreationType
  ): void {
    this.router.navigate([AppRoutePath.ProcessCaseViewPath], {
      queryParams: {
        quotation_number: gqId,
        customer_number: customerId,
        sales_org: salesOrg,
      },
    });
    let translationKey = '';
    if (creationType === CreationType.CREATE_CASE) {
      translationKey = 'createSuccess';
    } else if (creationType === CreationType.IMPORT) {
      translationKey = 'importSuccess';
    } else {
      translationKey = 'reimportSucess';
    }

    const successMessage = translate(
      `caseView.snackBarMessages.${translationKey}`
    );

    this.snackBarService.showSuccessMessage(successMessage);
  }
}
