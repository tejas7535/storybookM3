/* eslint-disable max-lines */
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { marbles } from 'rxjs-marbles/jest';

import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';
import { TranslocoModule } from '@ngneat/transloco';
import { Actions } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';

import { ENV_CONFIG } from '@schaeffler/http';
import { SnackBarModule, SnackBarService } from '@schaeffler/snackbar';

import { CUSTOMER_MOCK, QUOTATION_MOCK } from '../../../../../testing/mocks';
import { FilterNames } from '../../../../shared/autocomplete-input/filter-names.enum';
import { AutocompleteSearch, IdValue } from '../../../../shared/models/search';
import {
  MaterialTableItem,
  MaterialValidation,
  ValidationDescription,
} from '../../../../shared/models/table';
import { HelperService } from '../../../../shared/services/helper-service/helper-service.service';
import { MaterialService } from '../../../../shared/services/rest-services/material-service/material.service';
import { QuotationService } from '../../../../shared/services/rest-services/quotation-service/quotation.service';
import { PLsSeriesRequest } from '../../../../shared/services/rest-services/search-service/models/pls-series-request.model';
import { PLsSeriesResponse } from '../../../../shared/services/rest-services/search-service/models/pls-series-response.model';
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
  validateFailure,
  validateSuccess,
} from '../../actions';
import { initialState } from '../../reducers/create-case/create-case.reducer';
import {
  CreateCase,
  CreateCaseResponse,
  SalesOrg,
} from '../../reducers/create-case/models';
import { PLsAndSeries } from '../../reducers/create-case/models/pls-and-series.model';
import { SalesIndication } from '../../reducers/transactions/models/sales-indication.enum';
import {
  getCaseRowData,
  getCreateCaseData,
  getCreateCustomerCasePayload,
  getSelectedQuotation,
} from '../../selectors';
import { CreateCaseEffects } from './create-case.effects';

jest.mock('@ngneat/transloco', () => ({
  ...jest.requireActual<TranslocoModule>('@ngneat/transloco'),
  translate: jest.fn(() => 'translate it'),
}));
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
  let snackBarService: SnackBarService;

  const createService = createServiceFactory({
    service: CreateCaseEffects,
    imports: [SnackBarModule, RouterTestingModule, HttpClientTestingModule],
    providers: [
      SnackBarService,
      provideMockActions(() => actions$),
      provideMockStore({ initialState: { search: initialState } }),
      {
        provide: ENV_CONFIG,
        useValue: {
          environment: {
            baseUrl: '',
          },
        },
      },
    ],
  });

  beforeEach(() => {
    spectator = createService();
    actions$ = spectator.inject(Actions);
    actions$ = spectator.inject(Actions);
    effects = spectator.inject(CreateCaseEffects);
    router = spectator.inject(Router);
    store = spectator.inject(MockStore);

    quotationService = spectator.inject(QuotationService);
    searchService = spectator.inject(SearchService);
    validationService = spectator.inject(MaterialService);
    snackBarService = spectator.inject(SnackBarService);
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
  describe('validate', () => {
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
    beforeEach(() => {
      store.overrideSelector(getCaseRowData, tableData);
    });

    test(
      'should return validateSuccess when REST call is successful',
      marbles((m) => {
        action = pasteRowDataItems({ items: [] });

        const materialValidations: MaterialValidation[] = [];
        const result = validateSuccess({ materialValidations });

        actions$ = m.hot('-a', { a: action });
        const response = m.cold('-a|', {
          a: materialValidations,
        });

        validationService.validateMaterials = jest.fn(() => response);
        const expected = m.cold('--b', { b: result });
        m.expect(effects.validate$).toBeObservable(expected);
        m.flush();

        expect(validationService.validateMaterials).toHaveBeenCalledTimes(1);
        expect(validationService.validateMaterials).toHaveBeenCalledWith(
          tableData
        );
      })
    );

    test(
      'should return validateFailure on REST error',
      marbles((m) => {
        const error = new Error('damn');
        const result = validateFailure();

        actions$ = m.hot('-a', { a: action });
        const response = m.cold('-#|', undefined, error);
        const expected = m.cold('--b', { b: result });

        validationService.validateMaterials = jest.fn(() => response);

        m.expect(effects.validate$).toBeObservable(expected);
        m.flush();

        expect(validationService.validateMaterials).toHaveBeenCalledTimes(1);
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
      'should return validateSuccess when REST call is successful',
      marbles((m) => {
        router.navigate = jest.fn();
        snackBarService.showSuccessMessage = jest.fn();
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
        expect(snackBarService.showSuccessMessage).toHaveBeenCalledTimes(1);
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
        snackBarService.showSuccessMessage = jest.fn();
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
        expect(snackBarService.showSuccessMessage).toHaveBeenCalledTimes(1);
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
      'should return getSalesOrgsSuccess when REST call is successful',
      marbles((m) => {
        const option = new IdValue('id', 'value', true);
        const filter = FilterNames.CUSTOMER;
        action = selectAutocompleteOption({ option, filter });
        const salesOrgs = [new SalesOrg('id', true)];
        const result = getSalesOrgsSuccess({ salesOrgs });

        actions$ = m.hot('-a', { a: action });
        const response = m.cold('-a|', {
          a: salesOrgs,
        });
        searchService.getSalesOrgs = jest.fn(() => response);

        const expected = m.cold('--b', { b: result });
        m.expect(effects.getSalesOrgs$).toBeObservable(expected);
        m.flush();

        expect(searchService.getSalesOrgs).toHaveBeenCalledTimes(1);
        expect(searchService.getSalesOrgs).toHaveBeenCalledWith(option.id);
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

        searchService.getSalesOrgs = jest.fn(() => response);

        m.expect(effects.getSalesOrgs$).toBeObservable(expected);
        m.flush();
        expect(searchService.getSalesOrgs).toHaveBeenCalledTimes(1);
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
        };
        const plsSeriesResponse: PLsSeriesResponse[] = [
          { series: '1', productLine: 'one', productLineId: '1' },
        ];
        const plsAndSeries: PLsAndSeries = {
          pls: [{ name: 'one', series: ['1'], value: '1', selected: true }],
          series: [{ selected: true, value: '1' }],
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
    test('should navigate and display snackbar', () => {
      router.navigate = jest.fn();
      snackBarService.showSuccessMessage = jest.fn();

      effects.navigateAfterCaseCreate('1', '2', 3);

      expect(router.navigate).toHaveBeenCalledTimes(1);
      expect(snackBarService.showSuccessMessage).toHaveBeenCalledTimes(1);
    });
  });
});
