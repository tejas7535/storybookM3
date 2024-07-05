/* eslint-disable max-lines */
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

import { of } from 'rxjs';
import { catchError, filter, map, mergeMap, tap } from 'rxjs/operators';

import { FilterNames } from '@gq/shared/components/autocomplete-input/filter-names.enum';
import { Quotation } from '@gq/shared/models';
import { IdValue } from '@gq/shared/models/search';
import { MaterialTableItem } from '@gq/shared/models/table';
import { CustomerService } from '@gq/shared/services/rest/customer/customer.service';
import {
  CustomerSalesOrgsCurrenciesResponse,
  SalesOrgCurrency,
} from '@gq/shared/services/rest/customer/models/customer-sales-orgs-currencies-response.model';
import { MaterialService } from '@gq/shared/services/rest/material/material.service';
import {
  MaterialValidationRequest,
  MaterialValidationResponse,
} from '@gq/shared/services/rest/material/models';
import { QuotationService } from '@gq/shared/services/rest/quotation/quotation.service';
import { PLsSeriesResponse } from '@gq/shared/services/rest/search/models/pls-series-response.model';
import { SearchService } from '@gq/shared/services/rest/search/search.service';
import { translate } from '@jsverse/transloco';
import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';

import { AppRoutePath } from '../../../../app-route-path.enum';
import {
  addRowDataItems,
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
  selectAutocompleteOption,
  selectSalesOrg,
  setSelectedAutocompleteOption,
  validateMaterialsOnCustomerAndSalesOrg,
  validateMaterialsOnCustomerAndSalesOrgFailure,
  validateMaterialsOnCustomerAndSalesOrgSuccess,
} from '../../actions';
import { RolesFacade } from '../../facades';
import {
  CreateCase,
  CreateCaseResponse,
  PLsAndSeries,
  SalesOrg,
} from '../../reducers/models';
import { SectorGpsdFacade } from '../../sector-gpsd/sector-gpsd.facade';
import {
  getAutoSelectMaterial,
  getCaseRowData,
  getCreateCaseData,
  getCreateCustomerCasePayload,
  getSelectedCustomerId,
  getSelectedQuotation,
  getSelectedSalesOrg,
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

  validateAfterSalesOrgsLoaded$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(getSalesOrgsSuccess.type),
      map(() => validateMaterialsOnCustomerAndSalesOrg())
    );
  });

  loadSectorGpsdAfterSalesOrgsLoaded$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(getSalesOrgsSuccess.type),
        concatLatestFrom(() => [
          this.store.select(getSelectedCustomerId),
          this.store.select(getSelectedSalesOrg),
        ]),
        map(
          ([_action, customerId, salesOrg]: [
            ReturnType<typeof validateMaterialsOnCustomerAndSalesOrg>,
            string,
            SalesOrg,
          ]) =>
            this.sectorGpsdFacade.loadSectorGpsdByCustomerAndSalesOrg(
              customerId,
              salesOrg.id
            )
        )
      );
    },
    { dispatch: false }
  );

  validateAfterSalesOrgSelected$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(selectSalesOrg.type),
      map(() => validateMaterialsOnCustomerAndSalesOrg())
    );
  });

  loadSectorGpsdAfterSalesOrgSelected$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(selectSalesOrg.type),
        concatLatestFrom(() => [this.store.select(getSelectedCustomerId)]),
        map(
          ([action, customerId]: [ReturnType<typeof selectSalesOrg>, string]) =>
            this.sectorGpsdFacade.loadSectorGpsdByCustomerAndSalesOrg(
              customerId,
              action.salesOrgId
            )
        )
      );
    },
    { dispatch: false }
  );

  validateAfterItemAdded$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(addRowDataItems.type),
      map(() => validateMaterialsOnCustomerAndSalesOrg())
    );
  });

  /**
   * Get Validation for materialNumbers in combination with Customer and SalesOrg
   */
  validateMaterialsOnCustomerAndSalesOrg$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(validateMaterialsOnCustomerAndSalesOrg),
      concatLatestFrom(() => [
        this.store.select(getCaseRowData),
        this.store.select(getSelectedCustomerId),
        this.store.select(getSelectedSalesOrg),
      ]),
      mergeMap(
        ([_action, tableData, customerId, salesOrg]: [
          ReturnType<typeof validateMaterialsOnCustomerAndSalesOrg>,
          MaterialTableItem[],
          string,
          SalesOrg,
        ]) => {
          const request: MaterialValidationRequest = {
            customerId: { customerId, salesOrg: salesOrg?.id },
            materialNumbers: [
              ...new Set(tableData.map((el) => el.materialNumber)),
            ],
          };

          return this.materialService.validateMaterials(request).pipe(
            map((response: MaterialValidationResponse) =>
              validateMaterialsOnCustomerAndSalesOrgSuccess({
                materialValidations: response?.validatedMaterials,
              })
            ),
            catchError((_e) =>
              of(validateMaterialsOnCustomerAndSalesOrgFailure())
            )
          );
        }
      )
    );
  });

  autoSelectMaterial$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(autocompleteSuccess.type),
      concatLatestFrom(() => this.store.select(getAutoSelectMaterial)),
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
      concatLatestFrom(
        () => this.rolesFacade.userHasRegionWorldOrGreaterChinaRole$
      ),
      concatLatestFrom(([_action, userHasAccess]) =>
        this.store.select(getCreateCaseData(userHasAccess))
      ),
      map(([[_action, _userHasAccess], createCaseData]) => createCaseData),
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
      concatLatestFrom(() => this.store.select(getSelectedQuotation)),
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
      ofType(selectAutocompleteOption),
      filter(
        (action) =>
          action.filter === FilterNames.CUSTOMER ||
          action.filter === FilterNames.CUSTOMER_AND_SHIP_TO_PARTY
      ),
      mergeMap((action: any) =>
        this.customerService
          .getSalesOrgsAndCurrenciesByCustomer(action.option.id)
          .pipe(
            map(
              (
                salesOrgCurrenciesResponse: CustomerSalesOrgsCurrenciesResponse
              ) => salesOrgCurrenciesResponse?.salesOrgCurrencyList
            ),
            map((salesOrgsCurrencies: SalesOrgCurrency[]) => {
              const salesOrgs: SalesOrg[] = salesOrgsCurrencies.map(
                (item: SalesOrgCurrency, index) => ({
                  id: item.salesOrg,
                  selected: index === 0, // select the first item of the returned list
                  currency: item.currency,
                })
              );

              return getSalesOrgsSuccess({ salesOrgs });
            }),
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
          map((response) => this.transformPLsAndSeriesResponse(response)),
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
      concatLatestFrom(() => this.store.select(getCreateCustomerCasePayload)),
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
    private readonly customerService: CustomerService,
    private readonly router: Router,
    private readonly store: Store,
    private readonly materialService: MaterialService,
    private readonly snackBar: MatSnackBar,
    private readonly sectorGpsdFacade: SectorGpsdFacade,
    private readonly rolesFacade: RolesFacade
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

    this.snackBar.open(successMessage);
  }

  transformPLsAndSeriesResponse(response: PLsSeriesResponse[]): PLsAndSeries {
    const series = [
      ...new Set(response.map((item: PLsSeriesResponse) => item.series)),
    ].map((seriesElement) => ({ value: seriesElement, selected: true }));
    const gpsdGroupIds = [
      ...new Set(response.map((item: PLsSeriesResponse) => item.gpsdGroupId)),
    ].map((gpsdGroupIdElement) => ({
      value: gpsdGroupIdElement,
      selected: true,
    }));
    const plsAndSeries: PLsAndSeries = {
      series,
      pls: [],
      gpsdGroupIds,
    };

    response.forEach((element) => {
      const index = plsAndSeries.pls.findIndex(
        (item) => item.value === element.productLineId
      );
      if (index < 0) {
        plsAndSeries.pls.push({
          value: element.productLineId,
          name: element.productLine,
          selected: true,
          series: [element.series],
        });
      } else if (!plsAndSeries.pls[index].series.includes(element.series)) {
        plsAndSeries.pls[index].series.push(element.series);
      }
    });

    return plsAndSeries;
  }
}
