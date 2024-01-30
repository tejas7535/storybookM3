import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';
import { Actions } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { marbles } from 'rxjs-marbles';

import { ErrorService, RestService } from '@ga/core/services';
import {
  advancedBearingSelectionSuccess,
  bearingSearchSuccess,
  modelCreateFailure,
  modelCreateSuccess,
  searchBearing,
  searchBearingForAdvancedSelection,
  selectBearing,
} from '@ga/core/store/actions';
import { MODEL_MOCK_ID } from '@ga/testing/mocks';

import {
  advancedBearingSelectionCountSuccess,
  getSelectedBearing,
  searchBearingForAdvancedSelectionCount,
} from '../..';
import { initialState as BearingState } from '../../reducers/bearing-selection/bearing-selection.reducer';
import { BearingSelectionEffects } from './bearing-selection.effects';

describe('BearingSelectionEffects', () => {
  let action: any;
  let actions$: any;
  let effects: BearingSelectionEffects;
  let spectator: SpectatorService<BearingSelectionEffects>;
  let restService: RestService;
  let errorService: ErrorService;
  let store: MockStore;

  const createService = createServiceFactory({
    service: BearingSelectionEffects,
    imports: [RouterTestingModule],
    providers: [
      provideMockActions(() => actions$),
      {
        provide: RestService,
        useValue: {
          getBearingSearch: jest.fn(),
          getBearingExtendedSearch: jest.fn(),
        },
      },
      {
        provide: ErrorService,
        useValue: {
          openGenericSnackBar: jest.fn(),
        },
      },
      {
        provide: Router,
        useValue: {
          navigate: jest.fn(),
        },
      },
      provideMockStore({}),
    ],
  });

  beforeEach(() => {
    spectator = createService();
    actions$ = spectator.inject(Actions);
    effects = spectator.inject(BearingSelectionEffects);
    store = spectator.inject(MockStore);
    restService = spectator.inject(RestService);
    errorService = spectator.inject(ErrorService);
  });

  describe('bearingSearch$', () => {
    it(
      'should fetch the bearing list',
      marbles((m) => {
        action = searchBearing({ query: 'the query' });

        actions$ = m.hot('-a', { a: action });

        const resultList = [
          { designation: 'bearing', isValid: true },
          { designation: 'bear', isValid: true },
          { designation: 'ring', isValid: true },
          { designation: 'ringbear', isValid: true },
        ];

        const response = m.cold('-a|', { a: resultList });
        restService.getBearingSearch = jest.fn(() => response);

        const result = bearingSearchSuccess({ resultList });
        const expected = m.cold('--b', { b: result });

        m.expect(effects.bearingSearch$).toBeObservable(expected);
        m.flush();

        expect(restService.getBearingSearch).toHaveBeenCalledWith('the query');
      })
    );
  });

  describe('searchBearingForAdvancedSelection$', () => {
    it(
      'should fetch the extended search bearing list',
      marbles((m) => {
        action = searchBearingForAdvancedSelection({
          selectionFilters: BearingState.advancedBearingSelection.filters,
        });

        actions$ = m.hot('-a', { a: action });

        const resultList = [
          { designation: 'bear', isValid: true },
          { designation: 'grylls', isValid: true },
          { designation: 'drinks', isValid: true },
          { designation: 'pi$$', isValid: true },
          // all valid
        ];

        const response = m.cold('-a|', { a: resultList });
        restService.getBearingExtendedSearch = jest.fn(() => response);

        const result = advancedBearingSelectionSuccess({ resultList });
        const expected = m.cold('--b', { b: result });

        m.expect(effects.searchBearingForAdvancedSelection$).toBeObservable(
          expected
        );
        m.flush();

        expect(restService.getBearingExtendedSearch).toHaveBeenCalledWith(
          BearingState.advancedBearingSelection.filters
        );
      })
    );
  });

  describe('searchBearingForAdvancedSelectionCount$', () => {
    it(
      'should fetch the extended search bearing list',
      marbles((m) => {
        action = searchBearingForAdvancedSelectionCount({
          selectionFilters: BearingState.advancedBearingSelection.filters,
        });

        actions$ = m.hot('-a', { a: action });

        const resultsCount = 2;

        const response = m.cold('-a|', { a: resultsCount });
        restService.getBearingExtendedSearchCount = jest.fn(() => response);

        const result = advancedBearingSelectionCountSuccess({ resultsCount });
        const expected = m.cold('--b', { b: result });

        m.expect(
          effects.searchBearingForAdvancedSelectionCount$
        ).toBeObservable(expected);
        m.flush();

        expect(restService.getBearingExtendedSearch).toHaveBeenCalledWith(
          BearingState.advancedBearingSelection.filters
        );
      })
    );
  });

  describe('createModel$', () => {
    it(
      'should fetch modelId and return success action',
      marbles((m) => {
        const mockBearing = 'mockBearing';
        store.overrideSelector(getSelectedBearing, mockBearing);

        action = selectBearing({ bearing: mockBearing });

        actions$ = m.hot('-a', { a: action });

        const response = m.cold('-a|', { a: MODEL_MOCK_ID });
        restService.putModelCreate = jest.fn(() => response);

        const result = modelCreateSuccess({ modelId: MODEL_MOCK_ID });
        const expected = m.cold('--b', { b: result });

        m.expect(effects.createModel$).toBeObservable(expected);
        m.flush();

        expect(restService.putModelCreate).toHaveBeenCalledTimes(1);
        expect(restService.putModelCreate).toHaveBeenCalledWith(mockBearing);
        expect(errorService.openGenericSnackBar).not.toHaveBeenCalled();
      })
    );

    it(
      'should fetch modelId and return failure action',
      marbles((m) => {
        const mockBearing = 'mockBearing';
        store.overrideSelector(getSelectedBearing, mockBearing);

        action = selectBearing({ bearing: mockBearing });

        actions$ = m.hot('-a', { a: action });

        // eslint-disable-next-line unicorn/no-null
        const response = m.cold('-a|', { a: null });
        restService.putModelCreate = jest.fn(() => response);

        const result = modelCreateFailure();
        const expected = m.cold('--b', { b: result });

        m.expect(effects.createModel$).toBeObservable(expected);
        m.flush();

        expect(restService.putModelCreate).toHaveBeenCalledTimes(1);
        expect(restService.putModelCreate).toHaveBeenCalledWith(mockBearing);
      })
    );
  });
});
