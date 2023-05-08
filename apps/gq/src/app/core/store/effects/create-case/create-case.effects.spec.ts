/* eslint-disable max-lines */

import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MATERIAL_SANITY_CHECKS } from '@angular/material/core';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';
import { translate } from '@ngneat/transloco';
import { Actions } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { marbles } from 'rxjs-marbles';

import { CUSTOMER_MOCK, QUOTATION_MOCK } from '../../../../../testing/mocks';
import { FilterNames } from '../../../../shared/components/autocomplete-input/filter-names.enum';
import { AutocompleteSearch, IdValue } from '../../../../shared/models/search';
import {
  MaterialTableItem,
  MaterialValidation,
  ValidationDescription,
} from '../../../../shared/models/table';
import { HelperService } from '../../../../shared/services/helper/helper.service';
import { CustomerService } from '../../../../shared/services/rest/customer/customer.service';
import { CustomerSalesOrgsCurrenciesResponse } from '../../../../shared/services/rest/customer/models/customer-sales-orgs-currencies-response.model';
import { MaterialService } from '../../../../shared/services/rest/material/material.service';
import { MaterialValidationRequest } from '../../../../shared/services/rest/material/models';
import { QuotationService } from '../../../../shared/services/rest/quotation/quotation.service';
import { PLsSeriesRequest } from '../../../../shared/services/rest/search/models/pls-series-request.model';
import { PLsSeriesResponse } from '../../../../shared/services/rest/search/models/pls-series-response.model';
import { SearchService } from '../../../../shared/services/rest/search/search.service';
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
import { initialState } from '../../reducers/create-case/create-case.reducer';
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
  getCreateCaseData,
  getCreateCustomerCasePayload,
  getSelectedCustomerId,
  getSelectedQuotation,
  getSelectedSalesOrg,
} from '../../selectors';
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
    imports: [MatSnackBarModule, RouterTestingModule, HttpClientTestingModule],
    providers: [
      { provide: MATERIAL_SANITY_CHECKS, useValue: false },
      provideMockActions(() => actions$),
      provideMockStore({ initialState: { search: initialState } }),
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
      'should return autocompleteFailure on REST error',
      marbles((m) => {
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

  describe('validateMaterialsOnCustomerAndSalesOrg$', () => {
    const tableData: MaterialTableItem[] = [
      {
        materialNumber: '1234',
        quantity: 20,
        info: {
          valid: false,
          description: [ValidationDescription.Not_Validated],
        },
      },
    ];

    const request: MaterialValidationRequest = {
      customerId: { customerId: '12345', salesOrg: '0615' },
      materialNumbers: ['1234'],
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

        const materialValidations: MaterialValidation[] = [];
        const result = validateMaterialsOnCustomerAndSalesOrgSuccess({
          materialValidations,
        });

        actions$ = m.hot('-a', { a: action });
        const response = m.cold('-a|', {
          a: {
            customerId: { customerId: '1234', salesOrg: '0815' },
            validatedMaterials: materialValidations,
          },
        });

        validationService.validateMaterials = jest.fn(() => response);
        const expected = m.cold('--b', { b: result });
        m.expect(
          effects.validateMaterialsOnCustomerAndSalesOrg$
        ).toBeObservable(expected);
        m.flush();

        expect(validationService.validateMaterials).toHaveBeenCalledTimes(1);
        expect(validationService.validateMaterials).toHaveBeenCalledWith(
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

        validationService.validateMaterials = jest.fn(() => response);

        m.expect(
          effects.validateMaterialsOnCustomerAndSalesOrg$
        ).toBeObservable(expected);
        m.flush();

        expect(validationService.validateMaterials).toHaveBeenCalledTimes(1);
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
      store.overrideSelector(getCreateCaseData, createCaseData);
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

        actions$ = m.hot('-a', { a: action });
        const response = m.cold('-a|', {
          a: createdCase,
        });
        quotationService.createCase = jest.fn(() => response);

        const expected = m.cold('--b', { b: result });
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
        HelperService.transformPLsAndSeriesResponse = jest.fn(
          () => plsAndSeries
        );

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
});
