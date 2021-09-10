import { marbles } from 'rxjs-marbles';

import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';
import { Actions } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { ROUTER_NAVIGATED } from '@ngrx/router-store';
import { Store } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';

import { LOAD_SENSE } from '../../../../../testing/mocks';
import { RestService } from '../../../http/rest.service';
import {
  getLoadAssessmentId,
  setLoadAssessmentInterval,
} from '../../actions/load-assessment/load-assessment.actions';
import {
  getBearingLoad,
  getBearingLoadSuccess,
  getLoadAverage,
  getLoadAverageSuccess,
} from '../../actions/load-sense/load-sense.actions';
import { getShaft, getShaftSuccess } from '../../actions/shaft/shaft.actions';
import * as fromRouter from '../../reducers';
import { LoadSense } from '../../reducers/load-sense/models';
import { ShaftStatus } from '../../reducers/shaft/models';
import { getLoadAssessmentInterval } from '../../selectors';
import { LoadAssessmentEffects } from './load-assessment.effects';
import { getCenterLoad, getCenterLoadSuccess } from '../../actions';

/* eslint-disable max-lines */
describe('LoadAssessmentEffects', () => {
  let spectator: SpectatorService<LoadAssessmentEffects>;
  let actions$: any;
  let action: any;
  let store: any;
  let effects: LoadAssessmentEffects;
  let restService: RestService;

  const deviceId = 'device-id-in-url';
  const mockRoute = 'load-assessment';
  const mockUrl = `/bearing/${deviceId}/${mockRoute}`;

  const createService = createServiceFactory({
    service: LoadAssessmentEffects,
    providers: [
      provideMockActions(() => actions$),
      provideMockStore(),
      {
        provide: RestService,
        useValue: {
          getGreaseStatus: jest.fn(),
          getBearingLoad: jest.fn(),
          getCenterLoad: jest.fn(),
        },
      },
    ],
  });

  beforeEach(() => {
    spectator = createService();
    actions$ = spectator.inject(Actions);
    store = spectator.inject(Store);
    effects = spectator.inject(LoadAssessmentEffects);
    restService = spectator.inject(RestService);

    store.overrideSelector(fromRouter.getRouterState, {
      state: { params: { id: deviceId } },
    });

    store.overrideSelector(getLoadAssessmentInterval, {
      startDate: 1_599_651_508,
      endDate: 1_599_651_509,
    });
  });

  describe('router$', () => {
    it(
      'should dispatch getLoadAssessmentId',
      marbles((m) => {
        actions$ = m.hot('-a', {
          a: {
            type: ROUTER_NAVIGATED,
            payload: { routerState: { url: mockUrl } },
          },
        });

        const result = getLoadAssessmentId();
        const expected = m.cold('-b', { b: result });

        m.expect(effects.router$).toBeObservable(expected);
      })
    );
  });

  describe('setLoadAssessmentInterval$', () => {
    it(
      'should return return setLoadAssessmentInterval',
      marbles((m) => {
        action = setLoadAssessmentInterval({
          interval: {
            endDate: 1_599_651_509,
            startDate: 1_599_651_508,
          },
        });

        actions$ = m.hot('-a', { a: action });

        const expected = m.cold('-(b)', {
          b: getLoadAssessmentId(),
        });

        m.expect(effects.interval$).toBeObservable(expected);
      })
    );
  });

  describe('loadCenterLoad$', () => {
    it(
      'should do something',
      marbles((m) => {
        action = getCenterLoad({ deviceId });
        const mock = [
          {
            deviceId,
            timestamp: new Date().toISOString(),
            fx: 1,
            fy: 1,
            fz: 1,
            my: 1,
            mz: 1,
          },
        ];
        const result = getCenterLoadSuccess({ centerLoad: mock });

        store.dispatch = jest.fn();
        actions$ = m.hot('-a', { a: action });
        const response = m.cold('-a|', { a: mock });
        const expected = m.cold('--b', { b: result });
        restService.getCenterLoad = jest.fn(() => response);
        m.expect(effects.loadCenterLoad$).toBeObservable(expected);
        m.flush();
        expect(restService.getCenterLoad).toHaveBeenCalled();
      })
    );
  });

  describe('loadAssessmentId$', () => {
    it(
      'should return many actions',
      marbles((m) => {
        action = getLoadAssessmentId();

        actions$ = m.hot('-a', { a: action });

        const expected = m.cold('-(bcd)', {
          b: getLoadAverage({ deviceId }),
          c: getCenterLoad({ deviceId }),
          d: getBearingLoad({ deviceId }),
        });

        m.expect(effects.loadAssessmentId$).toBeObservable(expected);
      })
    );
  });

  describe('load$', () => {
    beforeEach(() => {
      action = getBearingLoad({ deviceId });
    });

    it(
      'should return getBearingLoadSuccess action when REST call is successful',
      marbles((m) => {
        const mockBearingLoad: LoadSense[] = [LOAD_SENSE];

        const result = getBearingLoadSuccess({
          bearingLoad: mockBearingLoad,
        });

        actions$ = m.hot('-a', { a: action });

        const response = m.cold('-a|', {
          a: mockBearingLoad,
        });
        const expected = m.cold('--b', { b: result });

        restService.getBearingLoad = jest.fn(() => response);

        m.expect(effects.load$).toBeObservable(expected);
        m.flush();

        expect(restService.getBearingLoad).toHaveBeenCalledTimes(1);
        expect(restService.getBearingLoad).toHaveBeenCalledWith({
          id: deviceId,
          startDate: 1_599_651_508,
          endDate: 1_599_651_509,
        });
      })
    );
  });

  describe('loadAverage$', () => {
    beforeEach(() => {
      action = getLoadAverage({ deviceId });
    });

    it(
      'should return getLoadAverage action when REST call is successful',
      marbles((m) => {
        const mockAverage: LoadSense = {
          lsp01Strain: 2666.925_857_162_287,
          lsp02Strain: 2862.785_029_584_374_6,
          lsp03Strain: 1029.066_039_711_919,
          lsp04Strain: 1197.045_251_857_526_6,
          lsp05Strain: 1764.050_919_953_827_1,
          lsp06Strain: 1908.154_978_691_370_6,
          lsp07Strain: 2768.886_488_567_36,
          lsp08Strain: 1786.153_885_813_422,
          lsp09Strain: 1454.445_470_021_493,
          lsp10Strain: 1301.790_787_653_976,
          lsp11Strain: 1769.612_550_842_888,
          lsp12Strain: 1569.480_195_591_359,
          lsp13Strain: 1096.408_815_157_941,
          lsp14Strain: 1427.202_836_924_007_4,
          lsp15Strain: 1066.072_787_878_487,
          lsp16Strain: 1392.789_269_937_762_4,
          deviceId: 'edge-goldwind-qa-009',
          id: 'id-load-sense-average',
          timestamp: '2020-08-02T16:18:59Z',
        };

        const result = getLoadAverageSuccess({
          loadAverage: mockAverage,
        });

        actions$ = m.hot('-a', { a: action });

        const response = m.cold('-a|', {
          a: [mockAverage],
        });
        const expected = m.cold('--b', { b: result });

        restService.getBearingLoadAverage = jest.fn(() => response);

        m.expect(effects.loadAverage$).toBeObservable(expected);
        m.flush();

        expect(restService.getBearingLoadAverage).toHaveBeenCalledTimes(1);
        expect(restService.getBearingLoadAverage).toHaveBeenCalledWith({
          id: deviceId,
          startDate: 1_599_651_508,
          endDate: 1_599_651_509,
        });
      })
    );
  });
});
