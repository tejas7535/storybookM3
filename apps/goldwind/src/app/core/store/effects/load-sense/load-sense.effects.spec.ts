import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';
import { Actions, EffectsMetadata, getEffectsMetadata } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { ROUTER_NAVIGATED } from '@ngrx/router-store';
import { Store } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { cold, hot } from 'jasmine-marbles';

import { getAccessToken } from '@schaeffler/auth';

import { RestService } from '../../../http/rest.service';
import { getLoad, getLoadId, getLoadSuccess } from '../../actions';
import * as fromRouter from '../../reducers';
import { getLoadInterval } from '../../selectors/load-sense/load-sense.selector';
import { ConditionMonitoringEffects } from './load-sense.effects';

describe('Search Effects', () => {
  let spectator: SpectatorService<ConditionMonitoringEffects>;
  let actions$: any;
  let action: any;
  let store: any;
  let metadata: EffectsMetadata<ConditionMonitoringEffects>;
  let effects: ConditionMonitoringEffects;
  let restService: RestService;

  const mockUrl = '/bearing/666/condition-monitoring';

  const createService = createServiceFactory({
    service: ConditionMonitoringEffects,
    providers: [
      provideMockActions(() => actions$),
      provideMockStore(),
      {
        provide: RestService,
        useValue: {
          getLoad: jest.fn(),
        },
      },
    ],
  });

  beforeEach(() => {
    spectator = createService();
    actions$ = spectator.inject(Actions);
    store = spectator.inject(Store);
    effects = spectator.inject(ConditionMonitoringEffects);
    metadata = getEffectsMetadata(effects);
    restService = spectator.inject(RestService);

    store.overrideSelector(getAccessToken, 'mockedAccessToken');
    store.overrideSelector(fromRouter.getRouterState, {
      state: { params: { id: '666' } },
    });
    store.overrideSelector(getLoadInterval, {
      startDate: 1599651508,
      endDate: 1599651509,
    });
  });

  describe('router$', () => {
    test('should not return an action', () => {
      expect(metadata.router$).toEqual({
        dispatch: false,
        useEffectsErrorHandler: true,
      });
    });

    test('should dispatch getGreaseStatusId and getLoadId', () => {
      store.dispatch = jest.fn();
      actions$ = hot('-a', {
        a: {
          type: ROUTER_NAVIGATED,
          payload: { routerState: { url: mockUrl } },
        },
      });

      const expected = cold('-b', { b: 'condition-monitoring' });

      expect(effects.router$).toBeObservable(expected);
      expect(store.dispatch).toHaveBeenCalledWith(getLoadId());
    });
  });

  describe('loadId$', () => {
    test('should return getLoad', () => {
      action = getLoadId();

      actions$ = hot('-a', { a: action });

      const expected = cold('-(b)', {
        b: getLoad({ bearingId: '666' }),
      });

      expect(effects.loadId$).toBeObservable(expected);
    });
  });

  describe('load$', () => {
    beforeEach(() => {
      action = getLoad({ bearingId: '123' });
    });

    test('should return getLoadSuccess action when REST call is successful', () => {
      const mockLoadSense = [
        {
          deviceId: 'string',
          id: 'string',
          lsp01Strain: 0,
          lsp02Strain: 0,
          lsp03Strain: 0,
          lsp04Strain: 0,
          lsp05Strain: 0,
          lsp06Strain: 0,
          lsp07Strain: 0,
          lsp08Strain: 0,
          lsp09Strain: 0,
          lsp10Strain: 0,
          lsp11Strain: 0,
          lsp12Strain: 0,
          lsp13Strain: 0,
          lsp14Strain: 0,
          lsp15Strain: 0,
          lsp16Strain: 0,
          timestamp: '2020-11-04T09:39:19.499Z',
        },
      ];

      const result = getLoadSuccess({ loadSense: mockLoadSense });

      actions$ = hot('-a', { a: action });

      const response = cold('-a|', {
        a: mockLoadSense,
      });
      const expected = cold('--b', { b: result });

      restService.getLoad = jest.fn(() => response);

      expect(effects.load$).toBeObservable(expected);
      expect(restService.getLoad).toHaveBeenCalledTimes(1);
      expect(restService.getLoad).toHaveBeenCalledWith({
        id: '1',
        startDate: 1599651508,
        endDate: 1599651509,
      });
    });
  });
});
