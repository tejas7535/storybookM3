import { TestBed } from '@angular/core/testing';

import { Actions } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { cold, hot } from 'jasmine-marbles';
import { configureTestSuite } from 'ng-bullet';

import { AutocompleteService } from '../../../../pricing-view/input-section/services/autocomplete.service';
import {
  autocomplete,
  autocompleteFailure,
  autocompleteSuccess,
} from '../../actions';
import { AutocompleteSearch, IdValue } from '../../models';
import { initialState } from '../../reducers/search/search.reducer';
import { SearchEffects } from './search.effects';

describe('Search Effects', () => {
  let action: any;
  let actions$: any;
  let effects: SearchEffects;
  let autocompleteService: AutocompleteService;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      providers: [
        SearchEffects,
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
    effects = TestBed.inject(SearchEffects);
    autocompleteService = TestBed.inject(AutocompleteService);
  });

  describe('autocomplete$', () => {
    let autocompleteSearch: AutocompleteSearch;

    beforeEach(() => {
      autocompleteSearch = new AutocompleteSearch('customer', 'Aud');
      action = autocomplete({ autocompleteSearch });
    });

    test('should return autocompleteSuccess action when REST call is successful', () => {
      autocompleteService.autocomplete = jest.fn(() => response);
      const options: IdValue[] = [];
      const filter = autocompleteSearch.filter;
      const result = autocompleteSuccess({ options, filter });

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
