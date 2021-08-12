import { marbles } from 'rxjs-marbles';

import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';
import { Actions, EffectsMetadata, getEffectsMetadata } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { ROUTER_NAVIGATED } from '@ngrx/router-store';
import { Store } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';

import { RestService } from '../../../http/rest.service';
import {
  getGreaseHeatMapLatest,
  getGreaseHeatMapSuccess,
  getGreaseStatusId,
  stopGetGreaseStatusLatest,
} from '../../actions/grease-status/grease-status.actions';
import * as fromRouter from '../../reducers';
import {
  GCMHeatmapClassification,
  GCMHeatmapEntry,
} from '../../../../shared/models';
import { HeatmapStatusEffects } from './gc-heatmap.effects';
import { BearingRoutePath } from '../../../../bearing/bearing-route-path.enum';

/* eslint-disable max-lines */
describe('HeatmapStatusEffects', () => {
  let spectator: SpectatorService<HeatmapStatusEffects>;
  let actions$: any;
  let action: any;
  let store: any;
  let metadata: EffectsMetadata<HeatmapStatusEffects>;
  let effects: HeatmapStatusEffects;
  let restService: RestService;

  const deviceId = 'device-id-in-url';
  const mockRoute = BearingRoutePath.MaintenanceAsseesmentPath;
  const mockUrl = `/bearing/${deviceId}/${mockRoute}`;
  const mockLeaveUrl = '/overview';

  const createService = createServiceFactory({
    service: HeatmapStatusEffects,
    providers: [
      provideMockActions(() => actions$),
      provideMockStore(),
      {
        provide: RestService,
        useValue: {
          getGreaseStatusLatest: jest.fn(),
        },
      },
    ],
  });

  beforeEach(() => {
    spectator = createService();
    actions$ = spectator.inject(Actions);
    store = spectator.inject(Store);
    effects = spectator.inject(HeatmapStatusEffects);
    metadata = getEffectsMetadata(effects);
    restService = spectator.inject(RestService);

    store.overrideSelector(fromRouter.getRouterState, {
      state: { params: { id: deviceId } },
    });
  });

  describe('router$', () => {
    it(
      'should dispatch getGreaseStatusId',
      marbles((m) => {
        actions$ = m.hot('-a', {
          a: {
            type: ROUTER_NAVIGATED,
            payload: { routerState: { url: mockUrl } },
          },
        });

        const result = getGreaseStatusId({ source: mockRoute });
        const expected = m.cold('-b', { b: result });

        m.expect(effects.router$).toBeObservable(expected);
      })
    );
    it(
      'should dispatch getGreaseStatusId on mainteance route',
      marbles((m) => {
        actions$ = m.hot('-a', {
          a: {
            type: ROUTER_NAVIGATED,
            payload: {
              routerState: {
                url: `/bearing/${deviceId}/${BearingRoutePath.MaintenanceAsseesmentPath}/`,
              },
            },
          },
        });

        const result = getGreaseStatusId({
          source: `${BearingRoutePath.MaintenanceAsseesmentPath}`,
        });
        const expected = m.cold('-b', { b: result });

        m.expect(effects.router$).toBeObservable(expected);
      })
    );
    it(
      'should dispatch stopGetGreaseStatusLatest when leaving the condition monitoring route',
      marbles((m) => {
        actions$ = m.hot('-a', {
          a: {
            type: ROUTER_NAVIGATED,
            payload: { routerState: { url: mockLeaveUrl } },
          },
        });

        const result = stopGetGreaseStatusLatest();
        const expected = m.cold('-b', { b: result });

        m.expect(effects.router$).toBeObservable(expected);
      })
    );
  });

  describe('heatmapLatest$', () => {
    beforeEach(() => {
      action = getGreaseHeatMapLatest({ deviceId });
    });
    it(
      'should return getGreaseHeatMap action when REST call is successful',
      marbles((m) => {
        const gcmheatmap: GCMHeatmapEntry[] = [
          {
            timestamp: Date.now().toLocaleString(),
            gcm01DeteriorationClassification: GCMHeatmapClassification.ERROR,
            gcm01DeteriorationMax: 0,
            gcm01WaterContentClassification: GCMHeatmapClassification.ERROR,
            gcm01WaterContentMax: 0,
            gcm01TemperatureOpticsClassification:
              GCMHeatmapClassification.ERROR,
            gcm01TemperatureOpticsMax: 0,
            gcm02DeteriorationClassification: GCMHeatmapClassification.ERROR,
            gcm02DeteriorationMax: 0,
            gcm02WaterContentClassification: GCMHeatmapClassification.ERROR,
            gcm02WaterContentMax: 0,
            gcm02TemperatureOpticsClassification:
              GCMHeatmapClassification.ERROR,
            gcm02TemperatureOpticsMax: 0,
          },
        ];

        const result = getGreaseHeatMapSuccess({ gcmheatmap });

        actions$ = m.hot('-a', { a: action });

        const response = m.cold('-a|', {
          a: gcmheatmap,
        });
        const expected = m.cold('--b', { b: result });

        restService.getGreaseHeatMap = jest.fn(() => response);

        m.expect(effects.heatmapLatest$).toBeObservable(expected);
        m.flush();

        expect(restService.getGreaseHeatMap).toHaveBeenCalledTimes(1);
        // TODO: expect(restService.getGreaseHeatMap).toHaveBeenCalledWith(deviceId);
      })
    );
  });
});
