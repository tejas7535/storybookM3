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
  getBearingLoadLatest,
  getBearingLoadLatestFailure,
  getBearingLoadLatestSuccess,
  getLoadId,
  stopGetLoad,
} from '../../actions/load-sense/load-sense.actions';
import * as fromRouter from '../../reducers';
import { LoadSense } from '../../reducers/load-sense/models';
import { BearingLoadEffects } from './load-sense.effects';

describe('Load Sense Effects', () => {
  let spectator: SpectatorService<BearingLoadEffects>;
  let actions$: any;
  let action: any;
  let store: any;
  let metadata: EffectsMetadata<BearingLoadEffects>;
  let effects: BearingLoadEffects;
  let restService: RestService;

  const deviceId = '123';
  const mockUrl = `/bearing/${deviceId}/condition-monitoring`;
  const mockLeaveUrl = '/overview';

  const createService = createServiceFactory({
    service: BearingLoadEffects,
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
    effects = spectator.inject(BearingLoadEffects);
    metadata = getEffectsMetadata(effects);
    restService = spectator.inject(RestService);

    store.overrideSelector(fromRouter.getRouterState, {
      state: { params: { id: deviceId } },
    });
  });

  describe('router$', () => {
    it(
      'should dispatch getLoadId',
      marbles((m) => {
        actions$ = m.hot('-a', {
          a: {
            type: ROUTER_NAVIGATED,
            payload: { routerState: { url: mockUrl } },
          },
        });

        const result = getLoadId();
        const expected = m.cold('-b', { b: result });

        m.expect(effects.router$).toBeObservable(expected);
      })
    );

    it(
      'should dispatch stopGetLoad when leaving the bearing route',
      marbles((m) => {
        actions$ = m.hot('-a', {
          a: {
            type: ROUTER_NAVIGATED,
            payload: { routerState: { url: mockLeaveUrl } },
          },
        });

        const result = stopGetLoad();
        const expected = m.cold('-b', { b: result });

        m.expect(effects.router$).toBeObservable(expected);
      })
    );
  });

  describe('stopLoad$', () => {
    it('should not return an action', () => {
      expect(metadata.stopLoad$).toEqual({
        dispatch: false,
        useEffectsErrorHandler: true,
      });
    });
    it(
      'should set isPollingActive to false',
      marbles((m) => {
        effects['isPollingActive'] = true;
        action = stopGetLoad();

        actions$ = m.hot('-a', { a: action });
        const expected = m.cold('-b', { b: undefined });
        m.expect(effects.stopLoad$).toBeObservable(expected);
        m.flush();

        expect(effects['isPollingActive']).toBe(false);
      })
    );
  });

  describe('loadId$', () => {
    it(
      'should return getLoad',
      marbles((m) => {
        action = getLoadId();

        actions$ = m.hot('-a', { a: action });

        const expected = m.cold('-(b)', {
          b: getBearingLoadLatest({ deviceId }),
        });

        m.expect(effects.loadId$).toBeObservable(expected);
      })
    );
  });

  describe('continueLoadId$', () => {
    it(
      'should return getBearingLoadLatest',
      marbles((m) => {
        effects['isPollingActive'] = true;
        action = getBearingLoadLatestFailure();

        actions$ = m.hot('-a', { a: action });

        const expected = {
          b: getBearingLoadLatest({ deviceId }),
        };

        m.expect(effects.continueLoadId$).toBeObservable(
          `- ${UPDATE_SETTINGS.shaft.refresh}s b`,
          expected
        );
      })
    );
  });
  describe('bearingLoadLatest$', () => {
    beforeEach(() => {
      action = getBearingLoadLatest({ deviceId });
    });

    it(
      'should return getBearingLoadLatestSuccess action when REST call is successful',
      marbles((m) => {
        const mockLoadSense: LoadSense = {
          deviceId: 'string',
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
        } as LoadSense;
        const result = getBearingLoadLatestSuccess({
          bearingLoadLatest: mockLoadSense,
        });

        actions$ = m.hot('-a', { a: action });

        const response = m.cold('-a|', {
          a: [mockLoadSense],
        });
        const expected = m.cold('--b', { b: result });

        restService.getBearingLoadLatest = jest.fn(() => response);

        m.expect(effects.bearingLoadLatest$).toBeObservable(expected);
        m.flush();

        expect(restService.getBearingLoadLatest).toHaveBeenCalledTimes(1);
        expect(restService.getBearingLoadLatest).toHaveBeenCalledWith(deviceId);
      })
    );
  });
});
