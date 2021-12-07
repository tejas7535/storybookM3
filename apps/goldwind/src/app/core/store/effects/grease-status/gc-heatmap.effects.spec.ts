import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';
import { Actions, EffectsMetadata, getEffectsMetadata } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { ROUTER_NAVIGATED } from '@ngrx/router-store';
import { Store } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { marbles } from 'rxjs-marbles';

import { BearingRoutePath } from '../../../../bearing/bearing-route-path.enum';
import {
  GCMHeatmapClassification,
  GCMHeatmapEntry,
} from '../../../../shared/models';
import { RestService } from '../../../http/rest.service';
import {
  getGreaseHeatMapLatest,
  getGreaseHeatMapSuccess,
} from '../../actions/grease-status/gc-heatmap.actions';
import {
  getGreaseStatusId,
  stopGetGreaseStatusLatest,
} from '../../actions/grease-status/grease-status.actions';
import * as fromRouter from '../../reducers';
import { getMaintenanceAssessmentInterval } from '../../selectors/maintenance-assessment/maintenance-assessment.selector';
import { HeatmapStatusEffects } from './gc-heatmap.effects';

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
    store.overrideSelector(getMaintenanceAssessmentInterval, {
      startDate: 1_599_651_508,
      endDate: 1_599_651_509,
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
            gcm01DeteriorationMaxClassification: GCMHeatmapClassification.ERROR,
            gcm01DeteriorationMax: 0,
            gcm01WaterContentMaxClassification: GCMHeatmapClassification.ERROR,
            gcm01WaterContentMax: 0,
            gcm01TemperatureOpticsMaxClassification:
              GCMHeatmapClassification.ERROR,
            gcm01TemperatureOpticsMax: 0,
            gcm02DeteriorationMaxClassification: GCMHeatmapClassification.ERROR,
            gcm02DeteriorationMax: 0,
            gcm02WaterContentMaxClassification: GCMHeatmapClassification.ERROR,
            gcm02WaterContentMax: 0,
            gcm02TemperatureOpticsMaxClassification:
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
