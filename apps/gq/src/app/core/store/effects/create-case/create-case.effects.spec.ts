import { TestBed } from '@angular/core/testing';

import { Actions } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { cold, hot } from 'jasmine-marbles';
import { configureTestSuite } from 'ng-bullet';

import { AutocompleteService } from '../../../../case-view/create-case-dialog/services/autocomplete.service';
import {
  autocomplete,
  autocompleteFailure,
  autocompleteSuccess,
} from '../../actions';
import { AutocompleteSearch, IdValue } from '../../models';
import { initialState } from '../../reducers/create-case/create-case.reducer';
import { CreateCaseEffects } from './create-case.effects';

describe('Create Case Effects', () => {
  let action: any;
  let actions$: any;
  let effects: CreateCaseEffects;
  let autocompleteService: AutocompleteService;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
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
      ],
    });
  });

  beforeEach(() => {
    actions$ = TestBed.inject(Actions);
    effects = TestBed.inject(CreateCaseEffects);
    autocompleteService = TestBed.inject(AutocompleteService);
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
});
