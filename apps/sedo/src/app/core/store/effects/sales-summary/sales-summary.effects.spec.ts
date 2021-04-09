import { HttpClientTestingModule } from '@angular/common/http/testing';

import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';
import { Actions } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { cold, hot } from 'jasmine-marbles';

import { APP_STATE_MOCK } from '../../../../../testing/mocks/app-state-mock';
import { DataService } from '../../../../shared/data.service';
import {
  loadSalesSummary,
  loadSalesSummaryFailure,
  loadSalesSummarySuccess,
} from '../../actions';
import { initialState } from '../../reducers/sales-summary/sales-summary.reducer';
import { SalesSummaryEffects } from './sales-summary.effects';

describe('ClassificationEffects', () => {
  let action: any;
  let actions$: any;
  let effects: SalesSummaryEffects;
  let spectator: SpectatorService<DataService>;
  let dataService: DataService;

  const createService = createServiceFactory({
    service: DataService,
    imports: [HttpClientTestingModule],
    providers: [
      SalesSummaryEffects,
      provideMockActions(() => actions$),
      provideMockStore({ initialState }),
      {
        provide: DataService,
        useValue: {
          getSalesSummary: jest.fn(),
        },
      },
    ],
  });

  beforeEach(() => {
    spectator = createService();
    dataService = spectator.service;
    actions$ = spectator.inject(Actions);
    effects = spectator.inject(SalesSummaryEffects);
  });

  describe('loadSalesSummary', () => {
    beforeEach(() => {
      action = loadSalesSummary();
    });
    test('should return loadClassifictionForTextSuccess', () => {
      const result = loadSalesSummarySuccess({
        salesSummaryPage: APP_STATE_MOCK.salesSummary,
      });

      actions$ = hot('-a', { a: action });
      const response = cold('-a|', {
        a: APP_STATE_MOCK.salesSummary,
      });

      const expected = cold('--b', { b: result });

      dataService.getSalesSummary = jest.fn(() => response);

      expect(effects.loadSalesSummary$).toBeObservable(expected);
      expect(dataService.getSalesSummary).toHaveBeenCalledTimes(1);
    });

    test('should return loadSalesSummaryFailure', () => {
      const error = new Error('shit happened');
      const result = loadSalesSummaryFailure();

      actions$ = hot('-a', { a: action });
      const response = cold('-#|', undefined, error);
      const expected = cold('--b', { b: result });

      dataService.getSalesSummary = jest.fn(() => response);

      expect(effects.loadSalesSummary$).toBeObservable(expected);
      expect(dataService.getSalesSummary).toHaveBeenCalledTimes(1);
    });
  });
});
