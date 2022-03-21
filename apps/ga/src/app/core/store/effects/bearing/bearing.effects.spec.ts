import { RouterTestingModule } from '@angular/router/testing';

import { createServiceFactory, SpectatorService } from '@ngneat/spectator';
import { Actions } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { marbles } from 'rxjs-marbles';

import { MODEL_MOCK_ID } from '../../../../../testing/mocks/rest.service.mock';
import { RestService } from '../../../services/rest/rest.service';
import { getBearingExtendedSearchParameters, getSelectedBearing } from '../..';
import { initialState as BearingState } from '../../reducers/bearing/bearing.reducer';
import {
  bearingSearchExtendedSuccess,
  bearingSearchSuccess,
  modelCreateFailure,
  modelCreateSuccess,
  searchBearing,
  searchBearingExtended,
  selectBearing,
} from './../../actions/bearing/bearing.actions';
import { BearingEffects } from './bearing.effects';

describe('Bearing Effects', () => {
  let action: any;
  let actions$: any;
  let effects: BearingEffects;
  let spectator: SpectatorService<BearingEffects>;
  let restService: RestService;
  let store: MockStore;

  const createService = createServiceFactory({
    service: BearingEffects,
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
      provideMockStore({}),
    ],
  });

  beforeEach(() => {
    spectator = createService();
    actions$ = spectator.inject(Actions);
    effects = spectator.inject(BearingEffects);
    store = spectator.inject(MockStore);
    restService = spectator.inject(RestService);

    store.overrideSelector(
      getBearingExtendedSearchParameters,
      BearingState.extendedSearch.parameters
    );
  });

  describe('bearingSearch$', () => {
    it(
      'should fetch the bearing list',
      marbles((m) => {
        action = searchBearing({ query: 'the query' });

        actions$ = m.hot('-a', { a: action });

        const resultList = ['bearing', 'bear', 'ring', 'ringbear'];

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

  describe('extendedBearingSearch$', () => {
    it(
      'should fetch the extended search bearing list',
      marbles((m) => {
        action = searchBearingExtended();

        actions$ = m.hot('-a', { a: action });

        const resultList = ['bear', 'grylls', 'drinks', 'pi$$'];

        const response = m.cold('-a|', { a: resultList });
        restService.getBearingExtendedSearch = jest.fn(() => response);

        const result = bearingSearchExtendedSuccess({ resultList });
        const expected = m.cold('--b', { b: result });

        m.expect(effects.extendedBearingSearch$).toBeObservable(expected);
        m.flush();

        expect(restService.getBearingExtendedSearch).toHaveBeenCalledWith(
          BearingState.extendedSearch.parameters
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
