/* eslint-disable max-lines */
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router, RouterModule } from '@angular/router';

import { of } from 'rxjs';

import { AppRoutePath } from '@gq/app-route-path.enum';
import { FilterNames } from '@gq/shared/components/autocomplete-input/filter-names.enum';
import { AutocompleteSearch, IdValue } from '@gq/shared/models/search';
import {
  MaterialQuantities,
  MaterialTableItem,
  MaterialValidation,
  VALIDATION_CODE,
  ValidationDescription,
} from '@gq/shared/models/table';
import { FeatureToggleConfigService } from '@gq/shared/services/feature-toggle/feature-toggle-config.service';
import { CustomerService } from '@gq/shared/services/rest/customer/customer.service';
import { CustomerSalesOrgsCurrenciesResponse } from '@gq/shared/services/rest/customer/models/customer-sales-orgs-currencies-response.model';
import { MaterialService } from '@gq/shared/services/rest/material/material.service';
import {
  AddDetailsValidationRequest,
  AddDetailsValidationResponse,
  Severity,
} from '@gq/shared/services/rest/material/models';
import { QuotationService } from '@gq/shared/services/rest/quotation/quotation.service';
import { CreateCustomerCase } from '@gq/shared/services/rest/search/models/create-customer-case.model';
import { PLsSeriesRequest } from '@gq/shared/services/rest/search/models/pls-series-request.model';
import { PLsSeriesResponse } from '@gq/shared/services/rest/search/models/pls-series-response.model';
import { SearchService } from '@gq/shared/services/rest/search/search.service';
import { translate } from '@jsverse/transloco';
import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';
import { Actions } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { createSelector } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { MockProvider } from 'ng-mocks';
import { marbles } from 'rxjs-marbles';

import { CUSTOMER_MOCK } from '../../../../../testing/mocks/models/';
import { QUOTATION_MOCK } from '../../../../../testing/mocks/models/quotation';
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
import { RolesFacade } from '../../facades';
import { initialState } from '../../reducers/create-case/create-case.reducer';
import { CreateCaseHeaderData } from '../../reducers/create-case/models/create-case-header-data.interface';
import { CreateCaseOgp } from '../../reducers/create-case/models/create-case-ogp.interface';
import { CreateCustomerCaseOgp } from '../../reducers/create-case/models/create-customer-case-ogp.interface';
import {
  CaseFilterItem,
  CreateCase,
  CreateCaseResponse,
  PLsAndSeries,
  SalesIndication,
  SalesOrg,
} from '../../reducers/models';
import {
  getAutoSelectMaterial,
  getCaseRowData,
  getCreateCustomerCasePayload,
  getSelectedCustomerId,
  getSelectedQuotation,
  getSelectedSalesOrg,
} from '../../selectors';
import * as fromSelectors from '../../selectors/create-case/create-case.selector';
import { CreateCaseEffects } from './create-case.effects';
import { CreationType } from './creation-type.enum';

describe('Create Case Effects', () => {
  let action: any;
  let actions$: any;
  let effects: CreateCaseEffects;
  let router: Router;
  let spectator: SpectatorService<CreateCaseEffects>;
  let store: MockStore;

  let quotationService: QuotationService;
  let searchService: SearchService;
  let validationService: MaterialService;
  let customerService: CustomerService;
  let snackBar: MatSnackBar;

  const createService = createServiceFactory({
    service: CreateCaseEffects,
    imports: [MatSnackBarModule, RouterModule.forRoot([])],
    providers: [
      provideHttpClient(),
      provideHttpClientTesting(),

      provideMockActions(() => actions$),
      provideMockStore({
        initialState: { search: initialState },
      }),
      MockProvider(RolesFacade, {
        userHasRegionWorldOrGreaterChinaRole$: of(true),
      }),
      MockProvider(FeatureToggleConfigService, {
        isEnabled: jest.fn().mockReturnValue(false),
      }),
    ],
  });

  beforeEach(() => {
    spectator = createService();
    actions$ = spectator.inject(Actions);
    effects = spectator.inject(CreateCaseEffects);
    router = spectator.inject(Router);
    store = spectator.inject(MockStore);

    quotationService = spectator.inject(QuotationService);
    searchService = spectator.inject(SearchService);
    validationService = spectator.inject(MaterialService);
    customerService = spectator.inject(CustomerService);
    snackBar = spectator.inject(MatSnackBar);
  });

  describe('autocomplete$', () => {
    let autocompleteSearch: AutocompleteSearch;

    test(
      'should return autocompleteCustomerSuccess action when REST call is successful',
      marbles((m) => {
        autocompleteSearch = new AutocompleteSearch(
          FilterNames.CUSTOMER,
          'Aud'
        );
        action = autocomplete({ autocompleteSearch });
        const options: IdValue[] = [];
        const result = autocompleteSuccess({
          options,
          filter: FilterNames.CUSTOMER,
        });

        actions$ = m.hot('-a', { a: action });

        const response = m.cold('-a|', {
          a: options,
        });
        searchService.autocomplete = jest.fn(() => response);
        const expected = m.cold('--b', { b: result });

        m.expect(effects.autocomplete$).toBeObservable(expected);
        m.flush();

        expect(searchService.autocomplete).toHaveBeenCalledTimes(1);
        expect(searchService.autocomplete).toHaveBeenCalledWith(
          autocompleteSearch
        );
      })
    );

    test(
      'should return autocompleteQuotationSuccess action when REST call is successful',
      marbles((m) => {
        autocompleteSearch = new AutocompleteSearch(
          FilterNames.SAP_QUOTATION,
          '12345'
        );
        action = autocomplete({ autocompleteSearch });
        const options: IdValue[] = [];
        const result = autocompleteSuccess({
          options,
          filter: FilterNames.SAP_QUOTATION,
        });

        actions$ = m.hot('-a', { a: action });

        const response = m.cold('-a|', {
          a: options,
        });
        searchService.autocomplete = jest.fn(() => response);
        const expected = m.cold('--b', { b: result });

        m.expect(effects.autocomplete$).toBeObservable(expected);
        m.flush();

        expect(searchService.autocomplete).toHaveBeenCalledTimes(1);
        expect(searchService.autocomplete).toHaveBeenCalledWith(
          autocompleteSearch
        );
      })
    );
    test(
      'should return autocompleteMaterialNumberSuccess action when REST call is successful',
      marbles((m) => {
        autocompleteSearch = new AutocompleteSearch(
          FilterNames.MATERIAL_NUMBER,
          '12345'
        );
        action = autocomplete({ autocompleteSearch });
        const options: IdValue[] = [];
        const result = autocompleteSuccess({
          options,
          filter: FilterNames.MATERIAL_NUMBER,
        });

        actions$ = m.hot('-a', { a: action });
        const response = m.cold('-a|', {
          a: options,
        });
        validationService.autocompleteMaterial = jest.fn(() => response);
        const expected = m.cold('--b', { b: result });

        m.expect(effects.autocomplete$).toBeObservable(expected);
        m.flush();

        expect(validationService.autocompleteMaterial).toHaveBeenCalledTimes(1);
        expect(validationService.autocompleteMaterial).toHaveBeenCalledWith(
          autocompleteSearch
        );
      })
    );
    test(
      'should return autocompleteFailure on REST error',
      marbles((m) => {
        autocompleteSearch = new AutocompleteSearch(
          FilterNames.CUSTOMER,
          'Aud'
        );
        action = autocomplete({ autocompleteSearch });
        const error = new Error('damn');
        const result = autocompleteFailure();

        actions$ = m.hot('-a', { a: action });
        const response = m.cold('-#|', undefined, error);
        const expected = m.cold('--b', { b: result });

        searchService.autocomplete = jest.fn(() => response);

        m.expect(effects.autocomplete$).toBeObservable(expected);
        m.flush();

        expect(searchService.autocomplete).toHaveBeenCalledTimes(1);
      })
    );
    test(
      'should return autocompleteFailure on REST error when autocomplete for material',
      marbles((m) => {
        autocompleteSearch = new AutocompleteSearch(
          FilterNames.MATERIAL_NUMBER,
          'Aud'
        );
        action = autocomplete({ autocompleteSearch });
        const error = new Error('damn');
        const result = autocompleteFailure();

        actions$ = m.hot('-a', { a: action });
        const response = m.cold('-#|', undefined, error);
        const expected = m.cold('--b', { b: result });

        validationService.autocompleteMaterial = jest.fn(() => response);

        m.expect(effects.autocomplete$).toBeObservable(expected);
        m.flush();

        expect(validationService.autocompleteMaterial).toHaveBeenCalledTimes(1);
      })
    );
  });

  describe('Validation of Materials', () => {
    it(
      'Should call action by add Row Data Item',
      marbles((m) => {
        action = addRowDataItems({ items: [] });
        actions$ = m.hot('-a', { a: action });

        const result = validateMaterialsOnCustomerAndSalesOrg();

        const expected = m.cold('-b', { b: result });

        m.expect(effects.validateAfterItemAdded$).toBeObservable(expected);
        m.flush();
      })
    );

    it(
      'Should call action by getSalesOrgsSuccess',
      marbles((m) => {
        action = getSalesOrgsSuccess({ salesOrgs: [] });
        actions$ = m.hot('-a', { a: action });

        const result = validateMaterialsOnCustomerAndSalesOrg();

        const expected = m.cold('-b', { b: result });

        m.expect(effects.validateAfterSalesOrgsLoaded$).toBeObservable(
          expected
        );
        m.flush();
      })
    );

    it(
      'Should call action by selectSalesOrg',
      marbles((m) => {
        action = selectSalesOrg({ salesOrgId: '1' });
        actions$ = m.hot('-a', { a: action });

        const result = validateMaterialsOnCustomerAndSalesOrg();

        const expected = m.cold('-b', { b: result });

        m.expect(effects.validateAfterSalesOrgSelected$).toBeObservable(
          expected
        );
        m.flush();
      })
    );
  });

  describe('load Sector Gpsd Data', () => {
    test(
      'should trigger facade method when "getSalesOrgsSuccess" action has been emitted',
      marbles((m) => {
        action = getSalesOrgsSuccess({ salesOrgs: [] });
        store.overrideSelector(getSelectedCustomerId, '1234');
        store.overrideSelector(getSelectedSalesOrg, {
          id: '0615',
          selected: true,
        });
        effects['sectorGpsdFacade'].loadSectorGpsdByCustomerAndSalesOrg =
          jest.fn();

        actions$ = m.hot('-a', { a: action });

        effects.loadSectorGpsdAfterSalesOrgsLoaded$.subscribe(() => {
          expect(
            effects['sectorGpsdFacade'].loadSectorGpsdByCustomerAndSalesOrg
          ).toHaveBeenCalledTimes(1);
        });

        m.flush();
      })
    );
    test(
      'should trigger facade method when "selectSalesOrg" action has been emitted',
      marbles((m) => {
        action = selectSalesOrg({ salesOrgId: '14' });
        store.overrideSelector(getSelectedCustomerId, '1234');
        effects['sectorGpsdFacade'].loadSectorGpsdByCustomerAndSalesOrg =
          jest.fn();

        actions$ = m.hot('-a', { a: action });

        effects.loadSectorGpsdAfterSalesOrgsLoaded$.subscribe(() => {
          expect(
            effects['sectorGpsdFacade'].loadSectorGpsdByCustomerAndSalesOrg
          ).toHaveBeenCalledTimes(1);
          expect(
            effects['sectorGpsdFacade'].loadSectorGpsdByCustomerAndSalesOrg
          ).toBeCalledWith('1234', '14');
        });

        m.flush();
      })
    );
  });
  describe('validateMaterialsOnCustomerAndSalesOrg$', () => {
    const tableData: MaterialTableItem[] = [
      {
        id: 1,
        materialNumber: '1234',
        materialDescription: 'matDESC',
        customerMaterialNumber: '1234_customer',
        quantity: 20,
        info: {
          valid: false,
          description: [ValidationDescription.Not_Validated],
        },
      },
    ];

    const request: AddDetailsValidationRequest = {
      customerId: { customerId: '12345', salesOrg: '0615' },
      details: [
        {
          id: 1,
          data: {
            materialNumber15: '1234',
            customerMaterial: '1234_customer',
            quantity: 20,
          },
        },
      ],
    };
    beforeEach(() => {
      store.overrideSelector(getCaseRowData, tableData);
      store.overrideSelector(getSelectedCustomerId, '12345');
      store.overrideSelector(getSelectedSalesOrg, {
        id: '0615',
        selected: true,
      });
    });

    test(
      'should return validateMaterialsOnCustomerAndSalesOrgSuccess when REST call is successful',
      marbles((m) => {
        action = validateMaterialsOnCustomerAndSalesOrg();

        const materialValidations: MaterialValidation[] = [
          {
            id: 1,
            valid: true,
            deliveryUnit: 5,
            materialNumber15: tableData[0].materialNumber,
            materialDescription: tableData[0].materialDescription,
            materialPriceUnit: 1,
            materialUoM: 'PC',
            customerMaterial: tableData[0].customerMaterialNumber,
            correctedQuantity: 7,
            targetPriceSource: undefined,
            validationCodes: [
              {
                code: VALIDATION_CODE.QDV001,
                description: 'quantatiy updated',
                severity: Severity.INFO,
              },
            ],
          },
        ];
        const result = validateMaterialsOnCustomerAndSalesOrgSuccess({
          materialValidations,
          isNewCaseCreation: false,
        });
        const correctedQuantity = 7;

        actions$ = m.hot('-a', { a: action });
        const response = m.cold('-a|', {
          a: {
            customerId: { customerId: '12345', salesOrg: '0615' },
            validatedDetails: [
              {
                id: 1,
                userInput: {
                  materialNumber15: tableData[0].materialNumber,
                  quantity: tableData[0].quantity,
                  customerMaterial: tableData[0].customerMaterialNumber,
                },
                materialData: {
                  materialNumber15: tableData[0].materialNumber,
                  materialDescription: tableData[0].materialDescription,
                  materialPriceUnit: 1,
                  materialUoM: 'PC',
                },
                customerData: {
                  correctedQuantity,
                  customerMaterial: tableData[0].customerMaterialNumber,
                  deliveryUnit: 5,
                },
                valid: true,
                validationCodes: [
                  {
                    code: VALIDATION_CODE.QDV001,
                    description: 'quantatiy updated',
                    severity: Severity.INFO,
                  },
                ],
              },
            ],
          } as AddDetailsValidationResponse,
        });

        validationService.validateDetailsToAdd = jest.fn(() => response);
        const expected = m.cold('--b', { b: result });
        m.expect(
          effects.validateMaterialsOnCustomerAndSalesOrg$
        ).toBeObservable(expected);
        m.flush();

        expect(validationService.validateDetailsToAdd).toHaveBeenCalledTimes(1);
        expect(validationService.validateDetailsToAdd).toHaveBeenCalledWith(
          request
        );
      })
    );

    test(
      'should return validateFailure on REST error',
      marbles((m) => {
        const error = new Error('damn');
        const result = validateMaterialsOnCustomerAndSalesOrgFailure();

        actions$ = m.hot('-a', { a: action });
        const response = m.cold('-#|', undefined, error);
        const expected = m.cold('--b', { b: result });

        validationService.validateDetailsToAdd = jest.fn(() => response);

        m.expect(
          effects.validateMaterialsOnCustomerAndSalesOrg$
        ).toBeObservable(expected);
        m.flush();

        expect(validationService.validateDetailsToAdd).toHaveBeenCalledTimes(1);
      })
    );
  });

  describe('autoSelectMaterial$', () => {
    const caseFilterItem = {
      filter: FilterNames.MATERIAL_NUMBER,
      options: [{} as IdValue],
    } as CaseFilterItem;
    beforeEach(() => {
      action = autocompleteSuccess(caseFilterItem);
      store.overrideSelector(getAutoSelectMaterial, caseFilterItem);
    });

    it(
      'should trigger setSelectedAutocompleteOption Action',
      marbles((m) => {
        actions$ = m.hot('-a', { a: action });

        const result = setSelectedAutocompleteOption({
          filter: FilterNames.MATERIAL_NUMBER,
          option: {} as IdValue,
        });

        const expected = m.cold('-b', { b: result });

        m.expect(effects.autoSelectMaterial$).toBeObservable(expected);
        m.flush();
      })
    );
  });

  describe('createCase', () => {
    const createCaseData: CreateCase = {
      customer: {
        customerId: '1234',
        salesOrg: '0267',
      },
      materialQuantities: [
        {
          materialId: '333',
          quantity: 10,
          quotationItemId: 10,
        },
      ],
    };
    beforeEach(() => {
      jest.resetAllMocks();
      jest
        .spyOn(fromSelectors, 'getCreateCaseData')
        .mockImplementation((_userHasOfferTypeAccess: boolean = false) =>
          createSelector(() => ({
            customer: {
              customerId: '1234',
              salesOrg: '0267',
            },
            materialQuantities: [
              {
                materialId: '333',
                quantity: 10,
                quotationItemId: 10,
              },
            ],
          }))
        );
    });

    test(
      'should return validateMaterialsOnCustomerAndSalesOrgSuccess when REST call is successful',
      marbles((m) => {
        router.navigate = jest.fn();
        snackBar.open = jest.fn();
        action = createCase();

        const createdCase: CreateCaseResponse = {
          customerId: '',
          gqId: 0,
          salesOrg: '',
        };
        const result = createCaseSuccess({ createdCase });

        actions$ = m.hot('--a', { a: action });
        const response = m.cold('--a|', {
          a: createdCase,
        });
        quotationService.createCase = jest.fn(() => response);

        const expected = m.cold('----b', { b: result });
        m.expect(effects.createCase$).toBeObservable(expected);
        m.flush();

        expect(quotationService.createCase).toHaveBeenCalledTimes(1);
        expect(quotationService.createCase).toHaveBeenCalledWith(
          createCaseData
        );
        expect(router.navigate).toHaveBeenCalledTimes(1);
        expect(snackBar.open).toHaveBeenCalledTimes(1);
      })
    );

    test(
      'should return validateFailure on REST error',
      marbles((m) => {
        const errorMessage = 'errorMessage';

        const result = createCaseFailure({ errorMessage });

        actions$ = m.hot('-a', { a: action });
        const response = m.cold('-#|', undefined, errorMessage);
        const expected = m.cold('--b', { b: result });

        quotationService.createCase = jest.fn(() => response);

        m.expect(effects.createCase$).toBeObservable(expected);
        m.flush();

        expect(quotationService.createCase).toHaveBeenCalledTimes(1);
      })
    );
  });

  describe('createCaseOgp', () => {
    const materialTableItems: MaterialTableItem[] = [
      {
        materialNumber: '333',
        quantity: 10,
      },
    ];
    const createCaseData: CreateCaseHeaderData = {
      bindingPeriodValidityEndDate: '2021-12-31',
      caseName: 'caseName',
      customer: {
        customerId: 'customerId',
        salesOrg: 'salesOrg',
      },
      customCurrency: 'EUR',
      customerInquiryDate: '2021-12-31',
      quotationToDate: '2021-12-31',
      quotationToManualInput: false,
      shipToParty: {
        customerId: 'customerId',
        salesOrg: 'salesOrg',
      },
      offerTypeId: 1,
      partnerRoleId: 'partnerRoleId',
      purchaseOrderTypeId: 'purchaseOrderTypeId',
      requestedDeliveryDate: '2021-12-31',
    };
    beforeEach(() => {
      jest.resetAllMocks();
      store.overrideSelector(getCaseRowData, materialTableItems);
    });
    test(
      'should return createOgpCaseSuccess when REST call is successful',
      marbles((m) => {
        router.navigate = jest.fn();
        snackBar.open = jest.fn();
        action = createOgpCase({ createCaseData });
        const materialQuantities: MaterialQuantities[] = [
          {
            materialId: '333',
            quantity: 10,
            quotationItemId: 10,
          },
        ];
        const expectedRequest: CreateCaseOgp = {
          headerInformation: createCaseData,
          materialQuantities,
        };
        const createdCaseResponse: CreateCaseResponse = {
          customerId: '',
          gqId: 0,
          salesOrg: '',
        };
        const result = createOgpCaseSuccess({
          createdCase: createdCaseResponse,
        });

        actions$ = m.hot('--a', { a: action });
        const response = m.cold('--a|', {
          a: createdCaseResponse,
        });
        quotationService.createOgpCase = jest.fn(() => response);

        const expected = m.cold('----b', { b: result });
        m.expect(effects.createCaseOgp$).toBeObservable(expected);
        m.flush();

        expect(quotationService.createOgpCase).toHaveBeenCalledTimes(1);
        expect(quotationService.createOgpCase).toHaveBeenCalledWith(
          expectedRequest
        );
        expect(router.navigate).toHaveBeenCalledTimes(1);
        expect(snackBar.open).toHaveBeenCalledTimes(1);
      })
    );

    test(
      'should return validateFailure on REST error',
      marbles((m) => {
        const errorMessage = 'errorMessage';

        const result = createOgpCaseFailure({ errorMessage });

        actions$ = m.hot('-a', { a: action });
        const response = m.cold('-#|', undefined, errorMessage);
        const expected = m.cold('--b', { b: result });

        quotationService.createOgpCase = jest.fn(() => response);

        m.expect(effects.createCaseOgp$).toBeObservable(expected);
        m.flush();

        expect(quotationService.createOgpCase).toHaveBeenCalledTimes(1);
      })
    );
  });

  describe('importQuotation', () => {
    const importCaseData: IdValue = {
      value: QUOTATION_MOCK.customer.identifier.customerId,
      id: `${QUOTATION_MOCK.gqId}`,
      selected: false,
    };
    beforeEach(() => {
      store.overrideSelector(getSelectedQuotation, importCaseData);
    });

    test(
      'should return importCaseSuccess when REST call is successful',
      marbles((m) => {
        router.navigate = jest.fn();
        snackBar.open = jest.fn();
        action = importCase();

        const result = importCaseSuccess({ gqId: QUOTATION_MOCK.gqId });

        actions$ = m.hot('-a', { a: action });
        const response = m.cold('-a|', {
          a: QUOTATION_MOCK,
        });
        quotationService.importCase = jest.fn(() => response);

        const expected = m.cold('--b', { b: result });
        m.expect(effects.importCase$).toBeObservable(expected);
        m.flush();

        expect(quotationService.importCase).toHaveBeenCalledTimes(1);
        expect(quotationService.importCase).toHaveBeenCalledWith(
          `${QUOTATION_MOCK.gqId}`
        );
        expect(router.navigate).toHaveBeenCalledTimes(1);
        expect(snackBar.open).toHaveBeenCalledTimes(1);
        expect(translate).toHaveBeenCalledWith(
          'caseView.snackBarMessages.importSuccess'
        );
      })
    );

    test(
      'should return importCaseFailure on REST error',
      marbles((m) => {
        const errorMessage = 'errorMessage';
        const result = importCaseFailure({ errorMessage });

        actions$ = m.hot('-a', { a: action });
        const response = m.cold('-#|', undefined, errorMessage);
        const expected = m.cold('--b', { b: result });

        quotationService.importCase = jest.fn(() => response);

        m.expect(effects.importCase$).toBeObservable(expected);
        m.flush();

        expect(quotationService.importCase).toHaveBeenCalledTimes(1);
      })
    );
  });

  describe('getSalesOrgs', () => {
    test(
      'should return getSalesOrgsSuccess when REST call is successful for customer',
      marbles((m) => {
        const option = new IdValue('id', 'value', true);
        const filter = FilterNames.CUSTOMER;
        const salesOrgsCurrencies: CustomerSalesOrgsCurrenciesResponse = {
          customerId: 'id',
          salesOrgCurrencyList: [{ salesOrg: 'id', currency: 'USD' }],
        };
        const response = m.cold('-a|', {
          a: salesOrgsCurrencies,
        });
        customerService.getSalesOrgsAndCurrenciesByCustomer = jest.fn(
          () => response
        );

        action = selectAutocompleteOption({ option, filter });
        const salesOrgsOfAction = [new SalesOrg('id', true, 'USD')];
        const result = getSalesOrgsSuccess({ salesOrgs: salesOrgsOfAction });

        actions$ = m.hot('-a', { a: action });

        const expected = m.cold('--b', { b: result });
        m.expect(effects.getSalesOrgs$).toBeObservable(expected);
        m.flush();

        expect(
          customerService.getSalesOrgsAndCurrenciesByCustomer
        ).toHaveBeenCalledTimes(1);
        expect(
          customerService.getSalesOrgsAndCurrenciesByCustomer
        ).toHaveBeenCalledWith(option.id);
      })
    );
    test(
      'should return getSalesOrgsSuccess when REST call is successful for customer and shipToParty',
      marbles((m) => {
        const option = new IdValue('id', 'value', true);
        const filter = FilterNames.CUSTOMER_AND_SHIP_TO_PARTY;
        const salesOrgsCurrencies: CustomerSalesOrgsCurrenciesResponse = {
          customerId: 'id',
          salesOrgCurrencyList: [{ salesOrg: 'id', currency: 'USD' }],
        };
        const response = m.cold('-a|', {
          a: salesOrgsCurrencies,
        });
        customerService.getSalesOrgsAndCurrenciesByCustomer = jest.fn(
          () => response
        );

        action = selectAutocompleteOption({ option, filter });
        const salesOrgsOfAction = [new SalesOrg('id', true, 'USD')];
        const result = getSalesOrgsForShipToPartySuccess({
          salesOrgs: salesOrgsOfAction,
        });

        actions$ = m.hot('-a', { a: action });

        const expected = m.cold('--b', { b: result });
        m.expect(effects.getSalesOrgs$).toBeObservable(expected);
        m.flush();

        expect(
          customerService.getSalesOrgsAndCurrenciesByCustomer
        ).toHaveBeenCalledTimes(1);
        expect(
          customerService.getSalesOrgsAndCurrenciesByCustomer
        ).toHaveBeenCalledWith(option.id);
      })
    );

    test(
      'should return getSalesOrgsFailure on REST error',
      marbles((m) => {
        const errorMessage = `Hello, i'm an error`;
        const result = getSalesOrgsFailure({ errorMessage });

        actions$ = m.hot('-a', { a: action });
        const response = m.cold('-#|', undefined, errorMessage);
        const expected = m.cold('--b', { b: result });

        customerService.getSalesOrgsAndCurrenciesByCustomer = jest.fn(
          () => response
        );

        m.expect(effects.getSalesOrgs$).toBeObservable(expected);
        m.flush();
        expect(
          customerService.getSalesOrgsAndCurrenciesByCustomer
        ).toHaveBeenCalledTimes(1);
      })
    );
  });

  describe('getPLsAndSeries', () => {
    test('should return getPLsAndSeriesSuccess when REST call is successful', () => {
      marbles((m) => {
        const customerFilters: PLsSeriesRequest = {
          customer: CUSTOMER_MOCK.identifier,
          includeQuotationHistory: true,
          salesIndications: [SalesIndication.INVOICE],
          historicalDataLimitInYear: 2,
        };
        const plsSeriesResponse: PLsSeriesResponse[] = [
          {
            series: '1',
            productLine: 'one',
            productLineId: '1',
            gpsdGroupId: 'F02',
          },
        ];
        const plsAndSeries: PLsAndSeries = {
          pls: [{ name: 'one', series: ['1'], value: '1', selected: true }],
          series: [{ selected: true, value: '1' }],
          gpsdGroupIds: [{ selected: true, value: 'F02' }],
        };
        effects.transformPLsAndSeriesResponse = jest.fn(() => plsAndSeries);

        action = getPLsAndSeries({ customerFilters });
        const result = getPLsAndSeriesSuccess({ plsAndSeries });
        searchService.getPlsAndSeries = jest.fn(() => response);

        actions$ = m.hot('-a', { a: action });
        const response = m.cold('-a|', {
          a: plsSeriesResponse,
        });

        const expected = m.cold('--b', { b: result });
        m.expect(effects.getPLsAndSeries$).toBeObservable(expected);
        m.flush();
        expect(searchService.getPlsAndSeries).toHaveBeenCalledTimes(1);
        expect(searchService.getPlsAndSeries).toHaveBeenCalledWith(
          customerFilters
        );
      });
    });
    test('should return getPLsAndSeriesFailure on REST error', () => {
      marbles((m) => {
        const errorMessage = `Hello, i'm an error`;
        const result = getPLsAndSeriesFailure({ errorMessage });
        actions$ = m.hot('-a', { a: action });

        const response = m.cold('-#|', undefined, errorMessage);
        const expected = m.cold('--b', { b: result });

        searchService.getPlsAndSeries = jest.fn(() => response);
        m.expect(effects.getPLsAndSeries$).toBeObservable(expected);
        expect(searchService.getPlsAndSeries).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe('createCustomerCase', () => {
    beforeEach(() => {
      store.overrideSelector(getCreateCustomerCasePayload, {} as any);
    });
    test('should return createCustomerCaseSuccess', () => {
      marbles((m) => {
        const responseObject: CreateCaseResponse = {
          customerId: '1',
          salesOrg: '2',
          gqId: 3,
        };

        action = createCustomerCase();
        quotationService.createCustomerCase = jest.fn(() => response);
        const result = createCustomerCaseSuccess();

        actions$ = m.hot('-a', { a: action });
        const response = m.cold('-a|', {
          a: responseObject,
        });

        const expected = m.cold('--b', { b: result });

        m.expect(effects.createCustomerCase$).toBeObservable(expected);
        m.flush();
        expect(quotationService.createCustomerCase).toHaveBeenCalledTimes(1);
        expect(quotationService.createCustomerCase).toHaveBeenCalledWith({});
      });
    });

    test('should return getPLsAndSeriesFailure on REST error', () => {
      marbles((m) => {
        const errorMessage = `Hello, i'm an error`;
        const result = createCustomerCaseFailure({ errorMessage });
        actions$ = m.hot('-a', { a: action });

        const response = m.cold('-#|', undefined, errorMessage);
        const expected = m.cold('--b', { b: result });

        quotationService.createCustomerCase = jest.fn(() => response);
        m.expect(effects.createCustomerCase$).toBeObservable(expected);
        expect(quotationService.createCustomerCase).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe('createCustomerOgpCase', () => {
    const customerPayload: CreateCustomerCase = {
      gpsdGroupIds: ['groupId1', 'groupId2'],
      historicalDataLimitInYear: 0,
      includeQuotationHistory: false,
      productLines: ['productLine1', 'productLine2'],
      salesIndications: [SalesIndication.INVOICE],
      series: ['series1', 'series2'],
      customer: undefined,
    };
    const createCaseData: CreateCaseHeaderData = {
      bindingPeriodValidityEndDate: '2021-12-31',
      caseName: 'caseName',
      customer: {
        customerId: 'customerId',
        salesOrg: 'salesOrg',
      },
      customCurrency: 'EUR',
      customerInquiryDate: '2021-12-31',
      quotationToDate: '2021-12-31',
      quotationToManualInput: false,
      shipToParty: {
        customerId: 'customerId',
        salesOrg: 'salesOrg',
      },
      offerTypeId: 1,
      partnerRoleId: 'partnerRoleId',
      purchaseOrderTypeId: 'purchaseOrderTypeId',
      requestedDeliveryDate: '2021-12-31',
    };
    beforeEach(() => {
      jest.resetAllMocks();
      store.overrideSelector(getCreateCustomerCasePayload, customerPayload);
    });
    test(
      'should return createCustomerCaseSuccess when REST call was successful',
      marbles((m) => {
        router.navigate = jest.fn();
        snackBar.open = jest.fn();
        action = createCustomerOgpCase({ createCaseData });

        const expectedRequest: CreateCustomerCaseOgp = {
          headerInformation: createCaseData,
          gpsdGroupIds: customerPayload.gpsdGroupIds,
          historicalDataLimitInYear: customerPayload.historicalDataLimitInYear,
          includeQuotationHistory: customerPayload.includeQuotationHistory,
          productLines: customerPayload.productLines,
          salesIndications: customerPayload.salesIndications,
          series: customerPayload.series,
        };
        const createdCaseResponse: CreateCaseResponse = {
          customerId: '',
          gqId: 0,
          salesOrg: '',
        };
        const result = createCustomerOgpCaseSuccess({
          createdCase: createdCaseResponse,
        });

        actions$ = m.hot('--a', { a: action });
        const response = m.cold('--a|', {
          a: createdCaseResponse,
        });
        quotationService.createCustomerOgpCase = jest.fn(() => response);

        const expected = m.cold('----b', { b: result });
        m.expect(effects.createCustomerOgpCase$).toBeObservable(expected);
        m.flush();

        expect(quotationService.createCustomerOgpCase).toHaveBeenCalledTimes(1);
        expect(quotationService.createCustomerOgpCase).toHaveBeenCalledWith(
          expectedRequest
        );
        expect(router.navigate).toHaveBeenCalledTimes(1);
        expect(snackBar.open).toHaveBeenCalledTimes(1);
      })
    );

    test(
      'should return validateFailure on REST error',
      marbles((m) => {
        const errorMessage = 'errorMessage';

        const result = createCustomerOgpCaseFailure({ errorMessage });

        actions$ = m.hot('-a', { a: action });
        const response = m.cold('-#|', undefined, errorMessage);
        const expected = m.cold('--b', { b: result });

        quotationService.createCustomerOgpCase = jest.fn(() => response);

        m.expect(effects.createCustomerOgpCase$).toBeObservable(expected);
        m.flush();

        expect(quotationService.createCustomerOgpCase).toHaveBeenCalledTimes(1);
      })
    );
  });
  describe('navigateBackToCaseOverviewPage', () => {
    test(
      'should navigate to case overview page',
      marbles((m) => {
        router.navigate = jest.fn();
        action = navigateToCaseOverView();
        actions$ = m.hot('a', { a: action });
        const expected = m.cold('200ms b', { b: undefined });

        m.expect(effects.navigateBackToCaseOverviewPage$).toBeObservable(
          expected
        );

        m.flush();
        expect(router.navigate).toHaveBeenCalledTimes(1);
        expect(router.navigate).toHaveBeenCalledWith([
          AppRoutePath.CaseViewPath,
        ]);
      })
    );
  });
  describe('navigateAfterCaseCreate', () => {
    beforeEach(() => {
      router.navigate = jest.fn();
      snackBar.open = jest.fn();
    });
    test('should navigate and display snackbar for createCase', () => {
      effects.navigateAfterCaseCreate('1', '2', 3, CreationType.CREATE_CASE);

      expect(translate).toHaveBeenCalledWith(
        'caseView.snackBarMessages.createSuccess'
      );
      expect(router.navigate).toHaveBeenCalledTimes(1);
      expect(snackBar.open).toHaveBeenCalledTimes(1);
    });
    test('should navigate and display snackbar for importCase', () => {
      effects.navigateAfterCaseCreate('1', '2', 3, CreationType.IMPORT);

      expect(translate).toHaveBeenCalledWith(
        'caseView.snackBarMessages.createSuccess'
      );
      expect(router.navigate).toHaveBeenCalledTimes(1);
      expect(snackBar.open).toHaveBeenCalledTimes(1);
    });
    test('should navigate and display snackbar for reimportCase', () => {
      effects.navigateAfterCaseCreate('1', '2', 3, CreationType.REIMPORT);

      expect(translate).toHaveBeenCalledWith(
        'caseView.snackBarMessages.createSuccess'
      );
      expect(router.navigate).toHaveBeenCalledTimes(1);
      expect(snackBar.open).toHaveBeenCalledTimes(1);
    });
  });

  describe('transformPLsAndSeriesResponse', () => {
    test('should transform reponse', () => {
      const response: PLsSeriesResponse[] = [
        {
          productLine: '10',
          productLineId: '10',
          series: '20',
          gpsdGroupId: 'F02',
        },
        {
          productLine: '10',
          productLineId: '10',
          series: '30',
          gpsdGroupId: 'F03',
        },
      ];
      const result = effects.transformPLsAndSeriesResponse(response);

      const expected: PLsAndSeries = {
        pls: [
          { name: '10', selected: true, series: ['20', '30'], value: '10' },
        ],
        series: [
          { value: '20', selected: true },
          { value: '30', selected: true },
        ],
        gpsdGroupIds: [
          { value: 'F02', selected: true },
          { value: 'F03', selected: true },
        ],
      };
      expect(result).toEqual(expected);
    });
  });

  describe('load ship to parties', () => {
    test(
      'should trigger facade method when "getSalesOrgsSuccess" action has been emitted',
      marbles((m) => {
        action = getSalesOrgsSuccess({ salesOrgs: [] });
        store.overrideSelector(getSelectedCustomerId, '1234');
        store.overrideSelector(getSelectedSalesOrg, {
          id: '0615',
          selected: true,
        });

        effects['shipToPartyFacade'].loadShipToPartyByCustomerAndSalesOrg =
          jest.fn();

        actions$ = m.hot('-a', { a: action });

        effects.loadShipToPartyByCustomerAndSalesOrg$.subscribe(() => {
          expect(
            effects['shipToPartyFacade'].loadShipToPartyByCustomerAndSalesOrg
          ).toHaveBeenCalledTimes(1);
        });

        m.flush();
      })
    );

    test(
      'should trigger facade method when "selectSalesOrg" action has been emitted',
      marbles((m) => {
        action = selectSalesOrg({ salesOrgId: '1' });
        store.overrideSelector(getSelectedCustomerId, '1234');
        store.overrideSelector(getSelectedSalesOrg, {
          id: '0615',
          selected: true,
        });

        effects['shipToPartyFacade'].loadShipToPartyByCustomerAndSalesOrg =
          jest.fn();

        actions$ = m.hot('-a', { a: action });

        effects.loadShipToPartyByCustomerAndSalesOrg$.subscribe(() => {
          expect(
            effects['shipToPartyFacade'].loadShipToPartyByCustomerAndSalesOrg
          ).toHaveBeenCalledTimes(1);
        });

        m.flush();
      })
    );
  });

  describe('load quotationToDate', () => {
    test(
      'should trigger facade method when "getSalesOrgsSuccess" action has been emitted',
      marbles((m) => {
        action = getSalesOrgsSuccess({ salesOrgs: [] });
        store.overrideSelector(getSelectedCustomerId, '1234');
        store.overrideSelector(getSelectedSalesOrg, {
          id: '0615',
          selected: true,
        });

        effects['createCaseFacade'].getQuotationToDate = jest.fn();

        actions$ = m.hot('-a', { a: action });

        effects.loadQuotationToByCustomerAndSalesOrg$.subscribe(() => {
          expect(
            effects['createCaseFacade'].getQuotationToDate
          ).toHaveBeenCalledTimes(1);
        });

        m.flush();
      })
    );

    test(
      'should trigger facade method when "selectSalesOrg" action has been emitted',
      marbles((m) => {
        action = selectSalesOrg({ salesOrgId: '1' });
        store.overrideSelector(getSelectedCustomerId, '1234');
        store.overrideSelector(getSelectedSalesOrg, {
          id: '0615',
          selected: true,
        });

        effects['createCaseFacade'].getQuotationToDate = jest.fn();

        actions$ = m.hot('-a', { a: action });

        effects.loadQuotationToByCustomerAndSalesOrg$.subscribe(() => {
          expect(
            effects['createCaseFacade'].getQuotationToDate
          ).toHaveBeenCalledTimes(1);
        });

        m.flush();
      })
    );
  });
});
