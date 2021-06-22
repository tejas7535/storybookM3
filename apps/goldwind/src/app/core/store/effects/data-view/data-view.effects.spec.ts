import { marbles } from 'rxjs-marbles';

import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';
import { Actions, EffectsMetadata, getEffectsMetadata } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { ROUTER_NAVIGATED } from '@ngrx/router-store';
import { Store } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';

import { RestService } from '../../../http/rest.service';
import {
  getData,
  getDataId,
  getDataSuccess,
  setDataInterval,
} from '../../actions/data-view/data-view.actions';
import * as fromRouter from '../../reducers';
import { getDataInterval } from '../../selectors/data-view/data-view.selector';
import { DataViewEffects } from './data-view.effects';

describe('Search Effects', () => {
  let spectator: SpectatorService<DataViewEffects>;
  let actions$: any;
  let action: any;
  let store: any;
  let metadata: EffectsMetadata<DataViewEffects>;
  let effects: DataViewEffects;
  let restService: RestService;

  const deviceId = '123-456-789';
  const mockUrl = `/bearing/${deviceId}/data-view`;

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

    store.overrideSelector(getDataInterval, {
      startDate: 1_599_651_508,
      endDate: 1_599_651_509,
    });
    store.overrideSelector(fromRouter.getRouterState, {
      state: { params: { id: deviceId } },
    });
  });

  describe('router$', () => {
    it('should not return an action', () => {
      expect(metadata.router$).toEqual({
        dispatch: false,
        useEffectsErrorHandler: true,
      });
    });

    it(
      'should dispatch getDataId',
      marbles((m) => {
        store.dispatch = jest.fn();
        actions$ = m.hot('-a', {
          a: {
            type: ROUTER_NAVIGATED,
            payload: { routerState: { url: mockUrl } },
          },
        });

        const expected = m.cold('-b', { b: 'data-view' });

        m.expect(effects.router$).toBeObservable(expected);
        m.flush();

        expect(store.dispatch).toHaveBeenCalledWith(getDataId()); // will also be moved
      })
    );
  });

  describe('interval$', () => {
    it(
      'should return getDataId',
      marbles((m) => {
        const mockInterval = {
          startDate: 1_599_651_508,
          endDate: 1_599_651_509,
        };

        action = setDataInterval({ interval: mockInterval });

        actions$ = m.hot('-a', { a: action });

        const expected = m.cold('-(b)', {
          b: getDataId(),
        });

        m.expect(effects.interval$).toBeObservable(expected);
      })
    );
  });

  describe('edmId$', () => {
    it(
      'should return getData',
      marbles((m) => {
        action = getDataId();

        actions$ = m.hot('-a', { a: action });

        const expected = m.cold('-(b)', {
          b: getData({ deviceId: '123-456-789' }),
        });

        m.expect(effects.dataId$).toBeObservable(expected);
      })
    );
  });

  describe('data$', () => {
    beforeEach(() => {
      action = getData({
        deviceId,
      });
    });

    it(
      'should return getDataSuccess action when REST call is successful',
      marbles((m) => {
        const mockResult = [
          {
            type: 'Load',
            description: 'Radial Load y',
            abreviation: 'F_y',
            actualValue: 1635,
            minValue: 1700,
            maxValue: 1900,
          },
        ];

        const result = getDataSuccess({
          result: mockResult,
        });

        actions$ = m.hot('-a', { a: action });

        const response = m.cold('-a|', {
          a: mockResult,
        });
        const expected = m.cold('--b', { b: result });

        restService.getData = jest.fn(() => response);

        m.expect(effects.data$).toBeObservable(expected);
        m.flush();

        expect(restService.getData).toHaveBeenCalledTimes(1);
        expect(restService.getData).toHaveBeenCalledWith({
          id: deviceId,
          startDate: 1_599_651_508,
          endDate: 1_599_651_509,
        });
      })
    );
  });
});
