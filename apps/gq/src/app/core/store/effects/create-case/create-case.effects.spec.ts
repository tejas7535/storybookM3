import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';
import { Actions } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { cold, hot } from 'jasmine-marbles';

import { ENV_CONFIG } from '@schaeffler/http';
import { SnackBarModule, SnackBarService } from '@schaeffler/snackbar';

import { QUOTATION_MOCK } from '../../../../../testing/mocks';
import { FilterNames } from '../../../../shared/autocomplete-input/filter-names.enum';
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
  AutocompleteSearch,
  CreateCase,
  CreateCaseResponse,
  IdValue,
  MaterialTableItem,
  MaterialValidation,
  SalesOrg,
  ValidationDescription,
} from '../../models';
import { initialState } from '../../reducers/create-case/create-case.reducer';
import {
  getCaseRowData,
  getCreateCaseData,
  getSelectedQuotation,
} from '../../selectors';
import { CreateCaseEffects } from './create-case.effects';

jest.mock('@ngneat/transloco', () => ({
  ...jest.requireActual('@ngneat/transloco'),
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

    test('should return autocompleteCustomerSuccess action when REST call is successful', () => {
      autocompleteSearch = new AutocompleteSearch(FilterNames.CUSTOMER, 'Aud');
      action = autocomplete({ autocompleteSearch });
      searchService.autocomplete = jest.fn(() => response);
      const options: IdValue[] = [];
      const result = autocompleteSuccess({
        options,
        filter: FilterNames.CUSTOMER,
      });

      actions$ = hot('-a', { a: action });

      const response = cold('-a|', {
        a: options,
      });
      const expected = cold('--b', { b: result });

      expect(effects.autocomplete$).toBeObservable(expected);
      expect(searchService.autocomplete).toHaveBeenCalledTimes(1);
      expect(searchService.autocomplete).toHaveBeenCalledWith(
        autocompleteSearch
      );
    });
    test('should return autocompleteQuotationSuccess action when REST call is successful', () => {
      autocompleteSearch = new AutocompleteSearch(
        FilterNames.SAP_QUOTATION,
        '12345'
      );
      action = autocomplete({ autocompleteSearch });
      searchService.autocomplete = jest.fn(() => response);
      const options: IdValue[] = [];
      const result = autocompleteSuccess({
        options,
        filter: FilterNames.SAP_QUOTATION,
      });

      actions$ = hot('-a', { a: action });

      const response = cold('-a|', {
        a: options,
      });
      const expected = cold('--b', { b: result });

      expect(effects.autocomplete$).toBeObservable(expected);
      expect(searchService.autocomplete).toHaveBeenCalledTimes(1);
      expect(searchService.autocomplete).toHaveBeenCalledWith(
        autocompleteSearch
      );
    });

    test('should return autocompleteFailure on REST error', () => {
      const error = new Error('damn');
      const result = autocompleteFailure();

      actions$ = hot('-a', { a: action });
      const response = cold('-#|', undefined, error);
      const expected = cold('--b', { b: result });

      searchService.autocomplete = jest.fn(() => response);

      expect(effects.autocomplete$).toBeObservable(expected);
      expect(searchService.autocomplete).toHaveBeenCalledTimes(1);
    });
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

    test('should return validateSuccess when REST call is successful', () => {
      action = pasteRowDataItems({ items: [], pasteDestination: {} });

      validationService.validateMaterials = jest.fn(() => response);
      const materialValidations: MaterialValidation[] = [];
      const result = validateSuccess({ materialValidations });

      actions$ = hot('-a', { a: action });
      const response = cold('-a|', {
        a: materialValidations,
      });
      const expected = cold('--b', { b: result });
      expect(effects.validate$).toBeObservable(expected);
      expect(validationService.validateMaterials).toHaveBeenCalledTimes(1);
      expect(validationService.validateMaterials).toHaveBeenCalledWith(
        tableData
      );
    });
    test('should return validateFailure on REST error', () => {
      const error = new Error('damn');
      const result = validateFailure();

      actions$ = hot('-a', { a: action });
      const response = cold('-#|', undefined, error);
      const expected = cold('--b', { b: result });

      validationService.validateMaterials = jest.fn(() => response);

      expect(effects.validate$).toBeObservable(expected);
      expect(validationService.validateMaterials).toHaveBeenCalledTimes(1);
    });
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
        },
      ],
    };
    beforeEach(() => {
      store.overrideSelector(getCreateCaseData, createCaseData);
    });

    test('should return validateSuccess when REST call is successful', () => {
      router.navigate = jest.fn();
      snackBarService.showSuccessMessage = jest.fn();
      action = createCase();

      quotationService.createCase = jest.fn(() => response);
      const createdCase: CreateCaseResponse = {
        customerId: '',
        gqId: '',
        salesOrg: '',
      };
      const result = createCaseSuccess({ createdCase });

      actions$ = hot('-a', { a: action });
      const response = cold('-a|', {
        a: createdCase,
      });
      const expected = cold('--b', { b: result });
      expect(effects.createCase$).toBeObservable(expected);
      expect(quotationService.createCase).toHaveBeenCalledTimes(1);
      expect(quotationService.createCase).toHaveBeenCalledWith(createCaseData);
      expect(router.navigate).toHaveBeenCalledTimes(1);
      expect(snackBarService.showSuccessMessage).toHaveBeenCalledTimes(1);
    });
    test('should return validateFailure on REST error', () => {
      const errorMessage = 'errorMessage';

      const result = createCaseFailure({ errorMessage });

      actions$ = hot('-a', { a: action });
      const response = cold('-#|', undefined, errorMessage);
      const expected = cold('--b', { b: result });

      quotationService.createCase = jest.fn(() => response);

      expect(effects.createCase$).toBeObservable(expected);
      expect(quotationService.createCase).toHaveBeenCalledTimes(1);
    });
  });

  describe('importQuotation', () => {
    const importCaseData: IdValue = {
      value: QUOTATION_MOCK.customer.identifiers.customerId,
      id: `${QUOTATION_MOCK.gqId}`,
      selected: false,
    };
    beforeEach(() => {
      store.overrideSelector(getSelectedQuotation, importCaseData);
    });

    test('should return importCaseSuccess when REST call is successful', () => {
      router.navigate = jest.fn();
      snackBarService.showSuccessMessage = jest.fn();
      action = importCase();

      quotationService.importCase = jest.fn(() => response);
      const result = importCaseSuccess({ gqId: QUOTATION_MOCK.gqId });

      actions$ = hot('-a', { a: action });
      const response = cold('-a|', {
        a: QUOTATION_MOCK,
      });
      const expected = cold('--b', { b: result });
      expect(effects.importCase$).toBeObservable(expected);
      expect(quotationService.importCase).toHaveBeenCalledTimes(1);
      expect(quotationService.importCase).toHaveBeenCalledWith(
        `${QUOTATION_MOCK.gqId}`
      );
      expect(router.navigate).toHaveBeenCalledTimes(1);
      expect(snackBarService.showSuccessMessage).toHaveBeenCalledTimes(1);
    });

    test('should return importCaseFailure on REST error', () => {
      const errorMessage = 'errorMessage';
      const result = importCaseFailure({ errorMessage });

      actions$ = hot('-a', { a: action });
      const response = cold('-#|', undefined, errorMessage);
      const expected = cold('--b', { b: result });

      quotationService.importCase = jest.fn(() => response);

      expect(effects.importCase$).toBeObservable(expected);
      expect(quotationService.importCase).toHaveBeenCalledTimes(1);
    });
  });

  describe('getSalesOrgs', () => {
    test('should return getSalesOrgsSuccess when REST call is successful', () => {
      const option = new IdValue('id', 'value', true);
      const filter = FilterNames.CUSTOMER;
      action = selectAutocompleteOption({ option, filter });
      searchService.getSalesOrgs = jest.fn(() => response);
      const salesOrgs = [new SalesOrg('id', true)];
      const result = getSalesOrgsSuccess({ salesOrgs });

      actions$ = hot('-a', { a: action });
      const response = cold('-a|', {
        a: salesOrgs,
      });

      const expected = cold('--b', { b: result });
      expect(effects.getSalesOrgs$).toBeObservable(expected);
      expect(searchService.getSalesOrgs).toHaveBeenCalledTimes(1);
      expect(searchService.getSalesOrgs).toHaveBeenCalledWith(option.id);
    });

    test('should return getSalesOrgsFailure on REST error', () => {
      const errorMessage = `Hello, i'm an error`;
      const result = getSalesOrgsFailure({ errorMessage });

      actions$ = hot('-a', { a: action });
      const response = cold('-#|', undefined, errorMessage);
      const expected = cold('--b', { b: result });

      searchService.getSalesOrgs = jest.fn(() => response);

      expect(effects.getSalesOrgs$).toBeObservable(expected);
      expect(searchService.getSalesOrgs).toHaveBeenCalledTimes(1);
    });
  });
});
