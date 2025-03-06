/* eslint-disable max-lines */
import { inject, Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

import { of } from 'rxjs';
import {
  catchError,
  delay,
  distinctUntilChanged,
  filter,
  map,
  mergeMap,
  tap,
} from 'rxjs/operators';

import { ShipToPartyFacade } from '@gq/core/store/ship-to-party/ship-to-party.facade';
import { FilterNames } from '@gq/shared/components/autocomplete-input/filter-names.enum';
import { MATERIAL_FILTERS } from '@gq/shared/constants/material-filters.const';
import { Quotation } from '@gq/shared/models';
import { IdValue } from '@gq/shared/models/search';
import { MaterialTableItem } from '@gq/shared/models/table';
import { FeatureToggleConfigService } from '@gq/shared/services/feature-toggle/feature-toggle-config.service';
import { CustomerService } from '@gq/shared/services/rest/customer/customer.service';
import {
  CustomerSalesOrgsCurrenciesResponse,
  SalesOrgCurrency,
} from '@gq/shared/services/rest/customer/models/customer-sales-orgs-currencies-response.model';
import { MaterialService } from '@gq/shared/services/rest/material/material.service';
import {
  AddDetailsValidationRequest,
  AddDetailsValidationResponse,
  ValidatedDetail,
} from '@gq/shared/services/rest/material/models';
import { QuotationService } from '@gq/shared/services/rest/quotation/quotation.service';
import { PLsSeriesResponse } from '@gq/shared/services/rest/search/models/pls-series-response.model';
import { SearchService } from '@gq/shared/services/rest/search/search.service';
import { TableService } from '@gq/shared/services/table/table.service';
import { translate } from '@jsverse/transloco';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concatLatestFrom } from '@ngrx/operators';
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
  createCustomerOgpCase,
  createCustomerOgpCaseFailure,
  createCustomerOgpCaseSuccess,
  createOgpCase,
  createOgpCaseFailure,
  createOgpCaseSuccess,
  getPLsAndSeries,
  getPLsAndSeriesFailure,
  getPLsAndSeriesSuccess,
  getSalesOrgsFailure,
  getSalesOrgsForShipToPartySuccess,
  getSalesOrgsSuccess,
  importCase,
  importCaseFailure,
  importCaseSuccess,
  navigateToCaseOverView,
  selectAutocompleteOption,
  selectSalesOrg,
  setSelectedAutocompleteOption,
  validateMaterialsOnCustomerAndSalesOrg,
  validateMaterialsOnCustomerAndSalesOrgFailure,
  validateMaterialsOnCustomerAndSalesOrgSuccess,
} from '../../actions';
import { CreateCaseFacade } from '../../create-case/create-case.facade';
import { RolesFacade } from '../../facades';
import { CreateCaseOgp } from '../../reducers/create-case/models/create-case-ogp.interface';
import { CreateCustomerCaseOgp } from '../../reducers/create-case/models/create-customer-case-ogp.interface';
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
  private readonly actions$: Actions = inject(Actions);
  private readonly searchService: SearchService = inject(SearchService);
  private readonly quotationService: QuotationService =
    inject(QuotationService);
  private readonly customerService: CustomerService = inject(CustomerService);
  private readonly router: Router = inject(Router);
  private readonly store: Store = inject(Store);
  private readonly materialService: MaterialService = inject(MaterialService);
  private readonly snackBar: MatSnackBar = inject(MatSnackBar);
  private readonly sectorGpsdFacade: SectorGpsdFacade =
    inject(SectorGpsdFacade);
  private readonly rolesFacade: RolesFacade = inject(RolesFacade);
  private readonly featureToggleService: FeatureToggleConfigService = inject(
    FeatureToggleConfigService
  );
  private readonly shipToPartyFacade: ShipToPartyFacade =
    inject(ShipToPartyFacade);

  private readonly createCaseFacade: CreateCaseFacade =
    inject(CreateCaseFacade);

  /**
   * Get possible values for a form field
   *
   */
  autocomplete$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(autocomplete.type),
      mergeMap((action: any) => {
        const httpRes$ = MATERIAL_FILTERS.includes(
          action.autocompleteSearch.filter
        )
          ? this.materialService.autocompleteMaterial(action.autocompleteSearch)
          : this.searchService.autocomplete(action.autocompleteSearch);

        return httpRes$.pipe(
          map((options) =>
            autocompleteSuccess({
              options,
              filter: action.autocompleteSearch.filter,
            })
          ),
          catchError((_e) => of(autocompleteFailure()))
        );
      })
    );
  });

  validateAfterSalesOrgsLoaded$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(getSalesOrgsSuccess.type),
      map(() => validateMaterialsOnCustomerAndSalesOrg())
    );
  });

  validateAfterSalesOrgSelected$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(selectSalesOrg.type),
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

  loadShipToPartyByCustomerAndSalesOrg$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(selectSalesOrg.type, getSalesOrgsSuccess.type),
        concatLatestFrom(() => [
          this.store.select(getSelectedCustomerId),
          this.store.select(getSelectedSalesOrg),
        ]),
        map(([_action, customerId, salesOrg]) => {
          if (customerId && salesOrg) {
            this.shipToPartyFacade.loadShipToPartyByCustomerAndSalesOrg(
              customerId,
              salesOrg.id
            );
          }
        })
      );
    },
    { dispatch: false }
  );

  loadQuotationToByCustomerAndSalesOrg$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(selectSalesOrg.type, getSalesOrgsSuccess.type),
        concatLatestFrom(() => [
          this.store.select(getSelectedCustomerId),
          this.store.select(getSelectedSalesOrg),
        ]),
        distinctUntilChanged(),
        map(([_action, customerId, salesOrg]) => {
          if (customerId && salesOrg) {
            this.createCaseFacade.getQuotationToDate({
              customerId,
              salesOrg: salesOrg.id,
            });
          }
        })
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
      filter(([_action, tableData]) => !!tableData && tableData.length > 0),
      mergeMap(
        ([_action, tableData, customerId, salesOrg]: [
          ReturnType<typeof validateMaterialsOnCustomerAndSalesOrg>,
          MaterialTableItem[],
          string,
          SalesOrg,
        ]) => {
          const request: AddDetailsValidationRequest =
            this.materialService.mapToAddDetailsValidationRequest(
              { customerId, salesOrg: salesOrg.id },
              tableData
            );

          return this.materialService.validateDetailsToAdd(request).pipe(
            map((response: AddDetailsValidationResponse) => {
              // map the new Response to the MaterialValidation Model
              const materialValidations = response.validatedDetails.map(
                (detail: ValidatedDetail) => {
                  return this.materialService.mapValidatedDetailToMaterialValidation(
                    detail
                  );
                }
              );

              return validateMaterialsOnCustomerAndSalesOrgSuccess({
                materialValidations,
                // TODO: condition can be removed when old case creation is removed see https://jira.schaeffler.com/browse/GQUOTE-5048
                isNewCaseCreation: this.featureToggleService.isEnabled(
                  'createManualCaseAsView'
                ),
              });
            }),
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
   * Create Case Ogp
   */
  // TODO: condition can be removed when old case creation is removed see https://jira.schaeffler.com/browse/GQUOTE-5048
  createCaseOgp$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(createOgpCase),
      concatLatestFrom(() => [
        this.rolesFacade.userHasRegionWorldOrGreaterChinaRole$,
        this.store.select(getCaseRowData),
      ]),
      mergeMap(
        ([action, userHasRegionGreaterChinaRole, rowData]: [
          ReturnType<typeof createOgpCase>,
          boolean,
          any[],
        ]) => {
          const materials = TableService.createMaterialQuantitiesFromTableItems(
            rowData,
            0
          );
          const requestData: CreateCaseOgp = {
            headerInformation: {
              ...action.createCaseData,
              offerTypeId: userHasRegionGreaterChinaRole
                ? action.createCaseData.offerTypeId
                : undefined,
            },
            materialQuantities: materials,
          };

          return this.quotationService.createOgpCase(requestData).pipe(
            tap((createdCase: CreateCaseResponse) => {
              this.navigateAfterCaseCreate(
                createdCase.customerId,
                createdCase.salesOrg,
                createdCase.gqId,
                CreationType.CREATE_CASE
              );
            }),
            map((createdCase: CreateCaseResponse) =>
              createOgpCaseSuccess({ createdCase })
            ),
            catchError((errorMessage) =>
              of(createOgpCaseFailure({ errorMessage }))
            )
          );
        }
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
   * Get Sales Orgs for customer and ship to party
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
              if (action.filter === FilterNames.CUSTOMER_AND_SHIP_TO_PARTY) {
                return getSalesOrgsForShipToPartySuccess({ salesOrgs });
              }

              if (action.filter === FilterNames.CUSTOMER_AND_SHIP_TO_PARTY) {
                return getSalesOrgsForShipToPartySuccess({ salesOrgs });
              }

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
  // TODO: can be removed when old case creation is removed see https://jira.schaeffler.com/browse/GQUOTE-5048
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

  createCustomerOgpCase$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(createCustomerOgpCase),
      concatLatestFrom(() => [
        this.rolesFacade.userHasRegionWorldOrGreaterChinaRole$,
        this.store.select(getCreateCustomerCasePayload),
      ]),
      mergeMap(([action, userHasRegionGreaterChinaRole, requestPayload]) => {
        const requestData: CreateCustomerCaseOgp = {
          headerInformation: {
            ...action.createCaseData,
            offerTypeId: userHasRegionGreaterChinaRole
              ? action.createCaseData.offerTypeId
              : undefined,
          },
          gpsdGroupIds: requestPayload.gpsdGroupIds,
          productLines: requestPayload.productLines,
          salesIndications: requestPayload.salesIndications,
          series: requestPayload.series,
          historicalDataLimitInYear: requestPayload.historicalDataLimitInYear,
          includeQuotationHistory: requestPayload.includeQuotationHistory,
        };

        return this.quotationService.createCustomerOgpCase(requestData).pipe(
          tap((createdCase: CreateCaseResponse) =>
            this.navigateAfterCaseCreate(
              createdCase.customerId,
              createdCase.salesOrg,
              createdCase.gqId,
              CreationType.CREATE_CASE
            )
          ),
          map((createdCase: CreateCaseResponse) =>
            createCustomerOgpCaseSuccess({ createdCase })
          ),
          catchError((errorMessage) =>
            of(createCustomerOgpCaseFailure({ errorMessage }))
          )
        );
      })
    );
  });

  navigateBackToCaseOverviewPage$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(navigateToCaseOverView),
        delay(200),
        map(() => this.router.navigate([AppRoutePath.CaseViewPath]))
      );
    },
    { dispatch: false }
  );

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
