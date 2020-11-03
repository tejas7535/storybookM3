import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';
import { Actions, EffectsMetadata, getEffectsMetadata } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { ROUTER_NAVIGATED } from '@ngrx/router-store';
import { Store } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { cold, hot } from 'jasmine-marbles';

import { getAccessToken } from '@schaeffler/auth';

import { RestService } from '../../../http/rest.service';
import {
  getData,
  getDataId,
  getDataSuccess,
  setDataInterval,
} from '../../actions/data-view/data-view.actions';
import {
  getDataInterval,
  getDeviceId,
} from '../../selectors/data-view/data-view.selector';
import { DataViewEffects } from './data-view.effects';

describe('Search Effects', () => {
  let spectator: SpectatorService<DataViewEffects>;
  let actions$: any;
  let action: any;
  let store: any;
  let metadata: EffectsMetadata<DataViewEffects>;
  let effects: DataViewEffects;
  let restService: RestService;

  const mockUrl = '/bearing/666/data-view';
  const mockDeviceID = '123-456-789';

  const createService = createServiceFactory({
    service: DataViewEffects,
    providers: [
      provideMockActions(() => actions$),
      provideMockStore(),
      {
        provide: RestService,
        useValue: {
          getData: jest.fn(),
        },
      },
    ],
  });

  beforeEach(() => {
    spectator = createService();
    actions$ = spectator.inject(Actions);
    store = spectator.inject(Store);
    effects = spectator.inject(DataViewEffects);
    metadata = getEffectsMetadata(effects);
    restService = spectator.inject(RestService);

    store.overrideSelector(getAccessToken, 'mockedAccessToken');
    store.overrideSelector(getDataInterval, {
      startDate: 1599651508,
      endDate: 1599651509,
    });
    store.overrideSelector(getDeviceId, mockDeviceID);
  });

  describe('router$', () => {
    test('should not return an action', () => {
      expect(metadata.router$).toEqual({
        dispatch: false,
        useEffectsErrorHandler: true,
      });
    });

    test('should dispatch getDataId', () => {
      store.dispatch = jest.fn();
      actions$ = hot('-a', {
        a: {
          type: ROUTER_NAVIGATED,
          payload: { routerState: { url: mockUrl } },
        },
      });

      const expected = cold('-b', { b: 'data-view' });

      expect(effects.router$).toBeObservable(expected);
      expect(store.dispatch).toHaveBeenCalledWith(getDataId()); // will also be moved
    });
  });

  describe('interval$', () => {
    test('should return getDataId', () => {
      const mockInterval = {
        startDate: 1599651508,
        endDate: 1599651509,
      };

      action = setDataInterval({ interval: mockInterval });

      actions$ = hot('-a', { a: action });

      const expected = cold('-(b)', {
        b: getDataId(),
      });

      expect(effects.interval$).toBeObservable(expected);
    });
  });

  describe('edmId$', () => {
    test('should return getData', () => {
      action = getDataId();

      actions$ = hot('-a', { a: action });

      const expected = cold('-(b)', {
        b: getData({ deviceId: '123-456-789' }),
      });

      expect(effects.dataId$).toBeObservable(expected);
    });
  });

  describe('data$', () => {
    beforeEach(() => {
      action = getData({
        deviceId: mockDeviceID,
      });
    });

    test('should return getDataSuccess action when REST call is successful', () => {
      const mockResult = [
        {
          type: 'Load',
          description: 'Radial Load y',
          abreviation: 'F_y',
          actualValue: 1635.0,
          minValue: 1700.0,
          maxValue: 1900.0,
        },
      ];

      const result = getDataSuccess({
        result: mockResult,
      });

      actions$ = hot('-a', { a: action });

      const response = cold('-a|', {
        a: mockResult,
      });
      const expected = cold('--b', { b: result });

      restService.getData = jest.fn(() => response);

      expect(effects.data$).toBeObservable(expected);
      expect(restService.getData).toHaveBeenCalledTimes(1);
      expect(restService.getData).toHaveBeenCalledWith({
        id: mockDeviceID,
        startDate: 1599651508,
        endDate: 1599651509,
      });
    });
  });
});
