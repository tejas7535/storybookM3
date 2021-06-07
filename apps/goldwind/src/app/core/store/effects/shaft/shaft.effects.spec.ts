import { marbles } from 'rxjs-marbles';

import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';
import { Actions, EffectsMetadata, getEffectsMetadata } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { ROUTER_NAVIGATED } from '@ngrx/router-store';
import { Store } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';

import { UPDATE_SETTINGS } from '../../../../shared/constants';
import { RestService } from '../../../http/rest.service';
import {
  getShaft,
  getShaftFailure,
  getShaftId,
  getShaftSuccess,
  stopGetShaft,
} from '../../actions/shaft/shaft.actions';
import * as fromRouter from '../../reducers';
import { ShaftStatus } from '../../reducers/shaft/models';
import { ShaftEffects } from './shaft.effects';

describe('Shaft Effects', () => {
  let spectator: SpectatorService<ShaftEffects>;
  let actions$: any;
  let action: any;
  let store: any;
  let metadata: EffectsMetadata<ShaftEffects>;
  let effects: ShaftEffects;
  let restService: RestService;

  const deviceId = 'my-device-id';
  const mockUrl = `/bearing/${deviceId}/condition-monitoring`;
  const mockLeaveUrl = '/overview';

  const createService = createServiceFactory({
    service: ShaftEffects,
    providers: [
      provideMockActions(() => actions$),
      provideMockStore(),
      {
        provide: RestService,
        useValue: {
          getShaftLatest: jest.fn(),
        },
      },
    ],
  });

  beforeEach(() => {
    spectator = createService();
    actions$ = spectator.inject(Actions);
    store = spectator.inject(Store);
    effects = spectator.inject(ShaftEffects);
    metadata = getEffectsMetadata(effects);
    restService = spectator.inject(RestService);

    store.overrideSelector(fromRouter.getRouterState, {
      state: { params: { id: deviceId } },
    });
  });

  describe('router$', () => {
    test('should not return an action', () => {
      expect(metadata.router$).toEqual({
        dispatch: false,
        useEffectsErrorHandler: true,
      });
    });

    test(
      'should dispatch getShaftId',
      marbles((m) => {
        store.dispatch = jest.fn();
        actions$ = m.hot('-a', {
          a: {
            type: ROUTER_NAVIGATED,
            payload: { routerState: { url: mockUrl } },
          },
        });

        const expected = m.cold('-b', {
          b: 'condition-monitoring' as any,
        });

        m.expect(effects.router$).toBeObservable(expected);
        m.flush();

        expect(store.dispatch).toHaveBeenCalledWith(getShaftId());
      })
    );

    test(
      'should dispatch stopGetShaft when leaving the bearing route',
      marbles((m) => {
        store.dispatch = jest.fn();
        actions$ = m.hot('-a', {
          a: {
            type: ROUTER_NAVIGATED,
            payload: { routerState: { url: mockLeaveUrl } },
          },
        });

        const expected = m.cold('-b', {
          b: 'overview' as any,
        });

        m.expect(effects.router$).toBeObservable(expected);
        m.flush();

        expect(store.dispatch).toHaveBeenCalledWith(stopGetShaft());
      })
    );
  });

  describe('shaftId$', () => {
    test(
      'should return getShaft',
      marbles((m) => {
        action = getShaftId();

        actions$ = m.hot('-a', { a: action });

        const expected = m.cold('-(b)', {
          b: getShaft({ deviceId }),
        });

        m.expect(effects.shaftId$).toBeObservable(expected);
      })
    );
  });

  describe('continueShaftId$', () => {
    test(
      'should return getShaft',
      marbles((m) => {
        effects['isPollingActive'] = true;
        action = getShaftFailure();

        actions$ = m.hot('-a', { a: action });

        const expected = {
          b: getShaft({ deviceId }),
        };

        m.expect(effects.continueShaftId$).toBeObservable(
          `- ${UPDATE_SETTINGS.shaft.refresh}s b`,
          expected
        );
      })
    );
  });

  describe('stopShaft$', () => {
    test('should not return an action', () => {
      expect(metadata.stopShaft$).toEqual({
        dispatch: false,
        useEffectsErrorHandler: true,
      });
    });
    test(
      'should set isPollingActive to false',
      marbles((m) => {
        effects['isPollingActive'] = true;
        action = stopGetShaft();

        actions$ = m.hot('-a', { a: action });
        const expected = m.cold('-b', { b: undefined });
        m.expect(effects.stopShaft$).toBeObservable(expected);
        m.flush();

        expect(effects['isPollingActive']).toBe(false);
      })
    );
  });

  describe('shaft$', () => {
    beforeEach(() => {
      action = getShaft({ deviceId });
    });

    test(
      'should return getShaftSuccess action when REST call is successful',
      marbles((m) => {
        const SHAFT_MOCK: ShaftStatus = {
          deviceId: 'fakedeviceid',
          timestamp: '2020-11-12T18:31:56.954003Z',
          rsm01ShaftSpeed: 3,
          rsm01Shaftcountervalue: 666,
        };

        const result = getShaftSuccess({
          shaft: SHAFT_MOCK,
        });

        actions$ = m.hot('-a', { a: action });

        const response = m.cold('-a|', {
          a: [SHAFT_MOCK],
        });
        const expected = m.cold('--b', { b: result });

        restService.getShaftLatest = jest.fn(() => response);

        m.expect(effects.shaft$).toBeObservable(expected);
        m.flush();

        expect(restService.getShaftLatest).toHaveBeenCalledTimes(1);
        expect(restService.getShaftLatest).toHaveBeenCalledWith(deviceId);
      })
    );
  });
});
