import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { Actions } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { cold, hot } from 'jasmine-marbles';
import { configureTestSuite } from 'ng-bullet';

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
  importCase,
  importCaseFailure,
  importCaseSuccess,
  pasteRowDataItems,
  validateFailure,
  validateSuccess,
} from '../../actions';
import {
  AutocompleteSearch,
  MaterialTableItem,
  CreateCaseResponse,
  IdValue,
  ImportCaseResponse,
  MaterialValidation,
  ValidationDescription,
} from '../../models';
import { initialState } from '../../reducers/create-case/create-case.reducer';
import {
  getCaseRowData,
  getCreateCaseData,
  getSelectedQuotation,
} from '../../selectors';
import { CreateCaseEffects } from './create-case.effects';

describe('Create Case Effects', () => {
  let action: any;
  let actions$: any;
  let createCaseService: CreateCaseService;
  let effects: CreateCaseEffects;
  let autocompleteService: AutocompleteService;
  let store: MockStore;
  let validationService: ValidationService;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([])],
      providers: [
        CreateCaseEffects,
        provideMockActions(() => actions$),
        provideMockStore({ initialState: { search: initialState } }),
        {
          provide: AutocompleteService,
          useValue: {
            autocomplete: jest.fn(),
          },
        },
        {
          provide: ValidationService,
          useValue: {
            validate: jest.fn(),
          },
        },
        {
          provide: CreateCaseService,
          useValue: {
            createCase: jest.fn(),
          },
        },
      ],
    });
  });

  beforeEach(() => {
    actions$ = TestBed.inject(Actions);
    actions$ = TestBed.inject(Actions);
    createCaseService = TestBed.inject(CreateCaseService);
    effects = TestBed.inject(CreateCaseEffects);
    autocompleteService = TestBed.inject(AutocompleteService);
    validationService = TestBed.inject(ValidationService);
    store = TestBed.inject(MockStore);
  });

  describe('autocomplete$', () => {
    let autocompleteSearch: AutocompleteSearch;

    test('should return autocompleteCustomerSuccess action when REST call is successful', () => {
      autocompleteSearch = new AutocompleteSearch('customer', 'Aud');
      action = autocomplete({ autocompleteSearch });
      autocompleteService.autocomplete = jest.fn(() => response);
      const options: IdValue[] = [];
      const result = autocompleteSuccess({ options, filter: 'customer' });

      actions$ = hot('-a', { a: action });

      const response = cold('-a|', {
        a: options,
      });
      const expected = cold('--b', { b: result });

      expect(effects.autocomplete$).toBeObservable(expected);
      expect(autocompleteService.autocomplete).toHaveBeenCalledTimes(1);
      expect(autocompleteService.autocomplete).toHaveBeenCalledWith(
        autocompleteSearch
      );
    });
    test('should return autocompleteQuotationSuccess action when REST call is successful', () => {
      autocompleteSearch = new AutocompleteSearch('quotation', '12345');
      action = autocomplete({ autocompleteSearch });
      autocompleteService.autocomplete = jest.fn(() => response);
      const options: IdValue[] = [];
      const result = autocompleteSuccess({ options, filter: 'quotation' });

      actions$ = hot('-a', { a: action });

      const response = cold('-a|', {
        a: options,
      });
      const expected = cold('--b', { b: result });

      expect(effects.autocomplete$).toBeObservable(expected);
      expect(autocompleteService.autocomplete).toHaveBeenCalledTimes(1);
      expect(autocompleteService.autocomplete).toHaveBeenCalledWith(
        autocompleteSearch
      );
    });

    test('should return autocompleteFailure on REST error', () => {
      const error = new Error('damn');
      const result = autocompleteFailure();

      actions$ = hot('-a', { a: action });
      const response = cold('-#|', undefined, error);
      const expected = cold('--b', { b: result });

      autocompleteService.autocomplete = jest.fn(() => response);

      expect(effects.autocomplete$).toBeObservable(expected);
      expect(autocompleteService.autocomplete).toHaveBeenCalledTimes(1);
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

      validationService.validate = jest.fn(() => response);
      const materialValidations: MaterialValidation[] = [];
      const result = validateSuccess({ materialValidations });

      actions$ = hot('-a', { a: action });
      const response = cold('-a|', {
        a: materialValidations,
      });
      const expected = cold('--b', { b: result });
      expect(effects.validate$).toBeObservable(expected);
      expect(validationService.validate).toHaveBeenCalledTimes(1);
      expect(validationService.validate).toHaveBeenCalledWith(tableData);
    });
    test('should return validateFailure on REST error', () => {
      const error = new Error('damn');
      const result = validateFailure();

      actions$ = hot('-a', { a: action });
      const response = cold('-#|', undefined, error);
      const expected = cold('--b', { b: result });

      validationService.validate = jest.fn(() => response);

      expect(effects.validate$).toBeObservable(expected);
      expect(validationService.validate).toHaveBeenCalledTimes(1);
    });
  });
  describe('createCase', () => {
    const createCaseData = {
      customerId: '123',
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
      action = createCase();

      createCaseService.createCase = jest.fn(() => response);
      const createdCase: CreateCaseResponse = { customerId: '', gqId: '' };
      const result = createCaseSuccess({ createdCase });

      actions$ = hot('-a', { a: action });
      const response = cold('-a|', {
        a: createdCase,
      });
      const expected = cold('--b', { b: result });
      expect(effects.createCase$).toBeObservable(expected);
      expect(createCaseService.createCase).toHaveBeenCalledTimes(1);
      expect(createCaseService.createCase).toHaveBeenCalledWith(createCaseData);
    });
    test('should return validateFailure on REST error', () => {
      const error = new Error('damn');
      const result = createCaseFailure();

      actions$ = hot('-a', { a: action });
      const response = cold('-#|', undefined, error);
      const expected = cold('--b', { b: result });

      createCaseService.createCase = jest.fn(() => response);

      expect(effects.createCase$).toBeObservable(expected);
      expect(createCaseService.createCase).toHaveBeenCalledTimes(1);
    });
  });

  describe('importQuotation', () => {
    const importCaseData: ImportCaseResponse = {
      customerId: '123',
      sapId: '1234687',
    };
    beforeEach(() => {
      store.overrideSelector(getSelectedQuotation, importCaseData);
    });

    test('should return importCaseSuccess when REST call is successful', () => {
      action = importCase();

      createCaseService.importCase = jest.fn(() => response);
      const quotationNumber = 'sdf-1234687';
      const result = importCaseSuccess({ quotationNumber });

      actions$ = hot('-a', { a: action });
      const response = cold('-a|', {
        a: quotationNumber,
      });
      const expected = cold('--b', { b: result });
      expect(effects.importCase$).toBeObservable(expected);
      expect(createCaseService.importCase).toHaveBeenCalledTimes(1);
      expect(createCaseService.importCase).toHaveBeenCalledWith(
        importCaseData.sapId
      );
    });

    test('should return importCaseFailure on REST error', () => {
      const error = new Error('damn');
      const result = importCaseFailure();

      actions$ = hot('-a', { a: action });
      const response = cold('-#|', undefined, error);
      const expected = cold('--b', { b: result });

      createCaseService.importCase = jest.fn(() => response);

      expect(effects.importCase$).toBeObservable(expected);
      expect(createCaseService.importCase).toHaveBeenCalledTimes(1);
    });
  });
});
