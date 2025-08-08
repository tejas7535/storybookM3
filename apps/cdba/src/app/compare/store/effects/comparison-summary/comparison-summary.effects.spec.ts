import { HttpErrorResponse, HttpStatusCode } from '@angular/common/http';

import {
  createServiceFactory,
  mockProvider,
  SpectatorService,
} from '@ngneat/spectator/jest';
import { Actions } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { marbles } from 'rxjs-marbles';

import { ComparisonService } from '@cdba/compare/comparison-summary-tab/service/comparison.service';
import {
  AUTH_STATE_MOCK,
  BOM_IDENTIFIER_MOCK,
  COMPARE_STATE_MOCK,
} from '@cdba/testing/mocks';
import { COMPARISON_MOCK } from '@cdba/testing/mocks/models/comparison-summary.mock';

import {
  areBomIdentifiersForSelectedBomItemsLoaded,
  getBomIdentifiersForSelectedBomItems,
} from '../..';
import {
  loadBomSuccess,
  loadComparisonSummary,
  loadComparisonSummaryFailure,
  loadComparisonSummarySuccess,
} from '../../actions';
import { ComparisonSummaryEffects } from './comparison-summary.effects';

describe('ComparisonSummaryEffects', () => {
  let spectator: SpectatorService<ComparisonSummaryEffects>;
  let action: any;
  let actions$: any;
  let effects: ComparisonSummaryEffects;
  let comparisonService: ComparisonService;
  let store: MockStore;

  const createService = createServiceFactory({
    service: ComparisonSummaryEffects,
    providers: [
      mockProvider(ComparisonService),
      provideMockActions(() => actions$),
      provideMockStore({
        initialState: {
          'azure-auth': AUTH_STATE_MOCK,
          compare: COMPARE_STATE_MOCK,
        },
      }),
    ],
  });

  beforeEach(() => {
    spectator = createService();
    actions$ = spectator.inject(Actions);
    effects = spectator.inject(ComparisonSummaryEffects);
    comparisonService = spectator.inject(ComparisonService);
    store = spectator.inject(MockStore);

    store.overrideSelector(getBomIdentifiersForSelectedBomItems, [
      BOM_IDENTIFIER_MOCK,
      BOM_IDENTIFIER_MOCK,
    ]);
  });

  describe('loadComparisonSummary$', () => {
    it(
      'should return success',
      marbles((m) => {
        action = loadComparisonSummary();
        actions$ = m.hot('-a', { a: action });

        const response = m.cold('-a|', {
          a: COMPARISON_MOCK,
        });

        comparisonService.getComparison = jest.fn(() => response);

        const result = loadComparisonSummarySuccess({
          comparison: COMPARISON_MOCK,
        });
        const expected = m.cold('--b', { b: result });

        m.expect(effects.loadComparisonSummary$).toBeObservable(expected);
        m.flush();
      })
    );

    it(
      'should return failure',
      marbles((m) => {
        action = loadComparisonSummary();
        actions$ = m.hot('-a', { a: action });

        const error = new HttpErrorResponse({
          status: HttpStatusCode.InternalServerError,
          error: { detail: 'Internal Server Error' },
        });

        const response = m.cold('-#|', undefined, error);
        const result = loadComparisonSummaryFailure({
          errorMessage: 'Internal Server Error',
          statusCode: 500,
        });
        const expected = m.cold('--b', { b: result });

        comparisonService.getComparison = jest.fn(() => response);

        m.expect(effects.loadComparisonSummary$).toBeObservable(expected);
        m.flush();
      })
    );
  });

  describe('triggerDataLoad$', () => {
    it(
      'should not load comparison when only one bom identifier is loaded',
      marbles((m) => {
        store.overrideSelector(
          areBomIdentifiersForSelectedBomItemsLoaded,
          false
        );

        actions$ = m.hot('-a', { a: loadBomSuccess });

        const expected = m.cold('--');

        m.expect(effects.triggerDataLoad$).toBeObservable(expected);
        m.flush();
      })
    );

    it(
      'should load comparison when both bom identifiers are loaded',
      marbles((m) => {
        store.overrideSelector(
          areBomIdentifiersForSelectedBomItemsLoaded,
          true
        );
        const expectedAction = loadComparisonSummary();

        actions$ = m.hot('-a', { a: loadBomSuccess });

        const expected = m.cold('-b', { b: expectedAction });

        m.expect(effects.triggerDataLoad$).toBeObservable(expected);
        m.flush();
      })
    );
  });
});
