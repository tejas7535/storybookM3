import { TestBed } from '@angular/core/testing';

import { Actions, EffectsMetadata, getEffectsMetadata } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { ROUTER_NAVIGATED } from '@ngrx/router-store';
import { Store } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { cold, hot } from 'jasmine-marbles';
import { configureTestSuite } from 'ng-bullet';

import { DataService } from '../../../http/data.service';
import {
  getGreaseStatus,
  getGreaseStatusId,
  getGreaseStatusSuccess,
} from '../../actions/grease-status/grease-status.actions';
import { getGreaseSensorId } from '../../selectors/grease-status/grease-status.selector';
import { GreaseStatusEffects } from './grease-status.effects';

describe('Search Effects', () => {
  let actions$: any;
  let action: any;
  let store: any;
  let metadata: EffectsMetadata<GreaseStatusEffects>;
  let effects: GreaseStatusEffects;
  let dataService: DataService;

  const mockUrl = '/bearing/sensor-id-in-url/grease-status';
  const mockGreaseSensorId = 'ee7bffbe-2e87-49f0-b763-ba235dd7c876';

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      providers: [
        GreaseStatusEffects,
        provideMockActions(() => actions$),
        provideMockStore(),
        {
          provide: DataService,
          useValue: {
            getGreaseStatus: jest.fn(),
          },
        },
      ],
    });
  });

  beforeEach(() => {
    actions$ = TestBed.inject(Actions);
    store = TestBed.inject(Store);
    effects = TestBed.inject(GreaseStatusEffects);
    metadata = getEffectsMetadata(effects);
    dataService = TestBed.inject(DataService);

    store.overrideSelector(getGreaseSensorId, mockGreaseSensorId);
  });

  describe('router$', () => {
    test('should not return an action', () => {
      expect(metadata.router$).toEqual({
        dispatch: false,
        useEffectsErrorHandler: true,
      });
    });

    test('should dispatch getGreaseStatusId', () => {
      store.dispatch = jest.fn();
      actions$ = hot('-a', {
        a: {
          type: ROUTER_NAVIGATED,
          payload: { routerState: { url: mockUrl } },
        },
      });

      const expected = cold('-b', { b: 'grease-status' });

      expect(effects.router$).toBeObservable(expected);
      expect(store.dispatch).toHaveBeenCalledWith(getGreaseStatusId());
    });
  });

  describe('greaseStatusId$', () => {
    test('should not return an action', () => {
      expect(metadata.greaseStatusId$).toEqual({
        dispatch: false,
        useEffectsErrorHandler: true,
      });
    });

    test('should dispatch getGreaseStatus', () => {
      store.dispatch = jest.fn();
      actions$ = hot('-a', { a: getGreaseStatusId() });

      const expected = cold('-b', { b: mockGreaseSensorId });

      expect(effects.greaseStatusId$).toBeObservable(expected);
      expect(store.dispatch).toHaveBeenCalledWith(
        getGreaseStatus({
          greaseStatusId: mockGreaseSensorId,
        })
      );
    });
  });

  describe('greaseStatus$', () => {
    beforeEach(() => {
      action = getGreaseStatus({ greaseStatusId: mockGreaseSensorId });
    });

    test('should return getGreaseStatusSuccess action when REST call is successful', () => {
      const mockGreaseStatus = [
        {
          id: 1,
          sensorId: '123-abc-456',
          endDate: '2020-08-12T18:09:25',
          startDate: '2020-08-12T18:09:19',
          sampleRatio: 9999,
          waterContentPercent: 69,
          deteriorationPercent: 96,
          temperatureCelsius: 9000,
          isAlarm: true,
        },
      ];

      const result = getGreaseStatusSuccess({
        greaseStatus: mockGreaseStatus,
      });

      actions$ = hot('-a', { a: action });

      const response = cold('-a|', {
        a: mockGreaseStatus,
      });
      const expected = cold('--b', { b: result });

      dataService.getGreaseStatus = jest.fn(() => response);

      expect(effects.greaseStatus$).toBeObservable(expected);
      expect(dataService.getGreaseStatus).toHaveBeenCalledTimes(1);
      expect(dataService.getGreaseStatus).toHaveBeenCalledWith(
        mockGreaseSensorId
      );
    });
  });
});
