import { createServiceFactory, SpectatorService } from '@ngneat/spectator';
import { Actions } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { ROUTER_NAVIGATED } from '@ngrx/router-store';
import { Store } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { marbles } from 'rxjs-marbles';

import {
  getMaintenanceAssessmentId,
  setMaintenanceAssessmentInterval,
  getMaintenanceAssessmentDataSuccess,
  MaintenanceAssessmentEffects,
} from '../..';
import { RestService } from '../../../http/rest.service';
import * as fromRouter from '../../reducers';
import { getMaintenanceAssessmentInterval } from '../../selectors/maintenance-assessment/maintenance-assessment.selector';
import { BearingRoutePath } from '../../../../bearing/bearing-route-path.enum';

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
          getMaintenaceSensors: jest.fn(),
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
        const result = getMaintenanceAssessmentDataSuccess({ data: [] });

        actions$ = m.hot('-a', { a: action });

        const response = m.cold('-a|', {
          a: [],
        });
        restService.getMaintenaceSensors = jest.fn(() => response);

        const expected = m.cold('--b', { b: result });

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
});
