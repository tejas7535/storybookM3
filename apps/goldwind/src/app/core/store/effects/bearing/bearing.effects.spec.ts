import { TestBed } from '@angular/core/testing';

import { Actions, EffectsMetadata, getEffectsMetadata } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { ROUTER_NAVIGATED } from '@ngrx/router-store';
import { Store } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { cold, hot } from 'jasmine-marbles';
import { configureTestSuite } from 'ng-bullet';

import { getAccessToken } from '@schaeffler/auth';

import { BEARING_MOCK } from '../../../../../testing/mocks';
import { DataService } from '../../../http/data.service';
import { StompService } from '../../../http/stomp.service';
import {
  getBearing,
  getBearingId,
  getBearingSuccess,
} from '../../actions/bearing/bearing.actions';
import * as fromRouter from '../../reducers';
import { BearingEffects } from './bearing.effects';

describe('Search Effects', () => {
  let actions$: any;
  let action: any;
  let store: any;
  let metadata: EffectsMetadata<BearingEffects>;
  let effects: BearingEffects;
  let dataService: DataService;

  const mockUrl = '/bearing/666/condition-monitoring';

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      providers: [
        BearingEffects,
        provideMockActions(() => actions$),
        provideMockStore(),
        {
          provide: DataService,
          useValue: {
            getBearing: jest.fn(),
            getEdm: jest.fn(),
          },
        },
        {
          provide: StompService,
          useValue: {
            connect: jest.fn(),
            getTopicBroadcast: jest.fn(),
          },
        },
      ],
    });
  });

  beforeEach(() => {
    actions$ = TestBed.inject(Actions);
    store = TestBed.inject(Store);
    effects = TestBed.inject(BearingEffects);
    metadata = getEffectsMetadata(effects);
    dataService = TestBed.inject(DataService);

    store.overrideSelector(getAccessToken, 'mockedAccessToken');
    store.overrideSelector(fromRouter.getRouterState, {
      state: { params: { id: 666 } },
    });
  });

  describe('router$', () => {
    test('should not return an action', () => {
      expect(metadata.router$).toEqual({
        dispatch: false,
        useEffectsErrorHandler: true,
      });
    });

    test('should dispatch getBearingId, connectStomp, subscribeBroadcast and for now getBearingEdmId', () => {
      store.dispatch = jest.fn();
      actions$ = hot('-a', {
        a: {
          type: ROUTER_NAVIGATED,
          payload: { routerState: { url: mockUrl } },
        },
      });

      const expected = cold('-b', { b: 'bearing' });

      expect(effects.router$).toBeObservable(expected);
      expect(store.dispatch).toHaveBeenCalledWith(getBearingId());
    });
  });

  describe('bearingId$', () => {
    test('should not return an action', () => {
      expect(metadata.bearingId$).toEqual({
        dispatch: false,
        useEffectsErrorHandler: true,
      });
    });

    test('should dispatch getBearing', () => {
      store.dispatch = jest.fn();
      actions$ = hot('-a', { a: getBearingId() });

      const expected = cold('-b', { b: 666 });

      expect(effects.bearingId$).toBeObservable(expected);
      expect(store.dispatch).toHaveBeenCalledWith(
        getBearing({
          bearingId: 666,
        })
      );
    });
  });

  describe('bearing$', () => {
    beforeEach(() => {
      action = getBearing({ bearingId: 123 });
    });

    test('should return getBearingSuccess action when REST call is successful', () => {
      const result = getBearingSuccess({
        bearing: BEARING_MOCK,
      });

      actions$ = hot('-a', { a: action });

      const response = cold('-a|', {
        a: BEARING_MOCK,
      });
      const expected = cold('--b', { b: result });

      dataService.getBearing = jest.fn(() => response);

      expect(effects.bearing$).toBeObservable(expected);
      expect(dataService.getBearing).toHaveBeenCalledTimes(1);
      expect(dataService.getBearing).toHaveBeenCalledWith(123);
    });
  });
});
