import { createServiceFactory, SpectatorService } from '@ngneat/spectator';
import { Actions } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { ROUTER_NAVIGATED } from '@ngrx/router-store';
import { Store } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { marbles } from 'rxjs-marbles';

import { BearingRoutePath } from '../../../../bearing/bearing-route-path.enum';
import { RestService } from '../../../http/rest.service';
import {
  getEdmMainteance,
  getGreaseStatus,
  getGreaseStatusSuccess,
  getMaintenanceAssessmentId,
  getShaft,
  getShaftSuccess,
  setMaintenanceAssessmentInterval,
} from '../..';
import * as fromRouter from '../../reducers';
import { GcmStatus } from '../../reducers/grease-status/models';
import { ShaftStatus } from '../../reducers/shaft/models';
import { getMaintenanceAssessmentInterval } from '../../selectors/maintenance-assessment/maintenance-assessment.selector';
import { MaintenanceAssessmentEffects } from '..';

describe('MaintenanceAssessmentEffects', () => {
  let spectator: SpectatorService<MaintenanceAssessmentEffects>;
  let actions$: any;
  let action: any;
  let store: any;
  let effects: MaintenanceAssessmentEffects;
  let restService: RestService;

  const deviceId = 'device-id-in-url';
  const mockRoute = BearingRoutePath.MaintenanceAsseesmentPath;
  const mockUrl = `/bearing/${deviceId}/${mockRoute}`;

  const createService = createServiceFactory({
    service: MaintenanceAssessmentEffects,
    providers: [
      provideMockActions(() => actions$),
      provideMockStore(),
      {
        provide: RestService,
        useValue: {
          getGreaseStatus: jest.fn(),
          getBearingLoad: jest.fn(),
          getShaft: jest.fn(),
        },
      },
    ],
  });

  beforeEach(() => {
    spectator = createService();
    actions$ = spectator.inject(Actions);
    store = spectator.inject(Store);
    effects = spectator.inject(MaintenanceAssessmentEffects);
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
      'should dispatch getMaintenanceAssessmentId',
      marbles((m) => {
        actions$ = m.hot('-a', {
          a: {
            type: ROUTER_NAVIGATED,
            payload: { routerState: { url: mockUrl } },
          },
        });

        const result = getMaintenanceAssessmentId();
        const expected = m.cold('-b', { b: result });

        m.expect(effects.router$).toBeObservable(expected);
      })
    );
  });
  describe('loadAssessmentId$', () => {
    it(
      'should return many actions',
      marbles((m) => {
        action = getMaintenanceAssessmentId();

        actions$ = m.hot('-a', { a: action });
        const expected = m.cold('-(bcd)', {
          b: getGreaseStatus({ deviceId }),
          c: getEdmMainteance({ deviceId }),
          d: getShaft({ deviceId }),
        });

        m.expect(effects.maintenanceAssessmentId$).toBeObservable(expected);
      })
    );
  });
  describe('setMaintenanceAssessmentInterval$', () => {
    it(
      'should return return setMaintenanceAssessmentInterval',
      marbles((m) => {
        action = setMaintenanceAssessmentInterval({
          interval: {
            endDate: 1_599_651_509,
            startDate: 1_599_651_508,
          },
        });

        actions$ = m.hot('-a', { a: action });

        const expected = m.cold('-(b)', {
          b: getMaintenanceAssessmentId(),
        });

        m.expect(effects.interval$).toBeObservable(expected);
      })
    );
  });
  describe('shaft$', () => {
    beforeEach(() => {
      action = getShaft({ deviceId });
    });

    it(
      'should return getShaftSuccess action when REST call is successful',
      marbles((m) => {
        const SHAFT_MOCK: ShaftStatus[] = [
          {
            deviceId: 'fakedeviceid',
            timestamp: '2020-11-12T18:31:56.954003Z',
            rsm01ShaftSpeed: 3,
            rsm01Shaftcountervalue: 666,
          },
        ];

        const result = getShaftSuccess({
          shaft: SHAFT_MOCK,
        });

        actions$ = m.hot('-a', { a: action });

        const response = m.cold('-a|', {
          a: SHAFT_MOCK,
        });
        const expected = m.cold('--b', { b: result });

        restService.getShaft = jest.fn(() => response);

        m.expect(effects.shaft$).toBeObservable(expected);
        m.flush();

        expect(restService.getShaft).toHaveBeenCalledTimes(1);
        expect(restService.getShaft).toHaveBeenCalledWith({
          id: deviceId,
          start: 1_599_651_508,
          end: 1_599_651_509,
        });
      })
    );
  });
  describe('greaseStatus$', () => {
    beforeEach(() => {
      action = getGreaseStatus({ deviceId });
    });

    it(
      'should return getGreaseStatusSuccess action when REST call is successful',
      marbles((m) => {
        const mockGcmStatus: GcmStatus[] = [
          {
            deviceId: '1',
            gcm01TemperatureOptics: 500,
            gcm01TemperatureOpticsMin: 1,
            gcm01TemperatureOpticsMax: 1000,
            gcm01Deterioration: 19,
            gcm01DeteriorationMin: 22,
            gcm01DeteriorationMax: 33,
            gcm01WaterContent: 0,
            gcm01WaterContentMin: 0,
            gcm01WaterContentMax: 1,
            gcm02TemperatureOptics: 0,
            gcm02TemperatureOpticsMin: 0,
            gcm02TemperatureOpticsMax: 0,
            gcm02Deterioration: 0,
            gcm02DeteriorationMin: 0,
            gcm02DeteriorationMax: 0,
            gcm02WaterContent: 0,
            gcm02WaterContentMin: 0,
            gcm02WaterContentMax: 0,
            timestamp: '2020-08-02T16:18:59Z',
          },
        ];

        const result = getGreaseStatusSuccess({
          gcmStatus: mockGcmStatus,
        });

        actions$ = m.hot('-a', { a: action });

        const response = m.cold('-a|', {
          a: mockGcmStatus,
        });
        const expected = m.cold('--b', { b: result });

        restService.getGreaseStatus = jest.fn(() => response);

        m.expect(effects.greaseStatus$).toBeObservable(expected);
        m.flush();

        expect(restService.getGreaseStatus).toHaveBeenCalledTimes(1);
        expect(restService.getGreaseStatus).toHaveBeenCalledWith({
          id: deviceId,
          start: 1_599_651_508,
          end: 1_599_651_509,
        });
      })
    );
  });
});
