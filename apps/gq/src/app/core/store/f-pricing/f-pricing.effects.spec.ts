import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import {
  FPricingData,
  UpdateFPricingDataResponse,
} from '@gq/shared/models/f-pricing';
import { ComparableKNumbers } from '@gq/shared/models/f-pricing/comparable-k-numbers.interface';
import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';
import { Actions } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { marbles } from 'rxjs-marbles';

import {
  FPricingComparableMaterials,
  Material,
} from '../reducers/transactions/models/f-pricing-comparable-materials.interface';
import { FPricingActions } from './f-pricing.actions';
import { FPricingEffects } from './f-pricing.effects';
import { initialState } from './f-pricing.reducer';

describe('FPricingEffects', () => {
  let actions$: any;
  let spectator: SpectatorService<FPricingEffects>;
  let effects: FPricingEffects;
  let snackBar: MatSnackBar;

  const createService = createServiceFactory({
    service: FPricingEffects,
    imports: [HttpClientTestingModule, MatSnackBarModule],
    providers: [
      provideMockActions(() => actions$),
      provideMockStore({ initialState: { fPricing: initialState } }),
    ],
  });

  beforeEach(() => {
    spectator = createService();
    effects = spectator.service;
    actions$ = spectator.inject(Actions);
    snackBar = spectator.inject(MatSnackBar);
  });

  it('should be created', () => {
    expect(effects).toBeTruthy();
  });

  describe('getFPricingData$', () => {
    test(
      'should dispatch loadFPricingDataSuccess',
      marbles((m) => {
        const gqPositionId = '1234';
        const response = {
          gqPositionId: '1234',
          referencePrice: 100_000,
        } as FPricingData;
        const action = FPricingActions.loadFPricingData({ gqPositionId });

        effects['fPricingService'].getFPricingData = () =>
          m.cold('a', { a: response });

        const result = FPricingActions.loadFPricingDataSuccess({
          data: response,
        });
        const expected = m.cold('b', { b: result });

        actions$ = m.hot('a', { a: action });
        m.expect(effects.getFPricingData$).toBeObservable(expected);
        m.flush();
      })
    );

    test(
      'Should dispatch error action',
      marbles((m) => {
        const gqPositionId = '1234';
        const error = new Error('Error');

        const action = FPricingActions.loadFPricingData({ gqPositionId });
        const result = FPricingActions.loadFPricingDataFailure({ error });

        actions$ = new Actions(m.cold('a', { a: action }));

        effects['fPricingService'].getFPricingData = () =>
          m.cold('-#', {}, error);

        const expected = m.cold('--b', { b: result });

        actions$ = m.hot('-a', { a: action });
        m.expect(effects.getFPricingData$).toBeObservable(expected);
        m.flush();
      })
    );
  });

  describe('getComparableTransactions$', () => {
    test(
      'should dispatch loadComparableTransactionsSuccess',
      marbles((m) => {
        const gqPositionId = '1234';
        const response = {
          gqPositionId,
          fPricingComparableMaterials: [
            {
              gqPositionId: '1234',
              material: {} as Material,
              transactions: [],
              similarityScore: 0,
            } as FPricingComparableMaterials,
          ],
        } as ComparableKNumbers;
        const action = FPricingActions.loadComparableTransactions({
          gqPositionId,
        });

        effects['fPricingService'].getComparableTransactions = () =>
          m.cold('a', { a: response });

        const result = FPricingActions.loadComparableTransactionsSuccess({
          data: response.fPricingComparableMaterials,
        });
        const expected = m.cold('b', { b: result });

        actions$ = m.hot('a', { a: action });
        m.expect(effects.getComparableTransactions$).toBeObservable(expected);
        m.flush();
      })
    );

    test(
      'Should dispatch error action',
      marbles((m) => {
        const gqPositionId = '1234';
        const error = new Error('Error');

        const action = FPricingActions.loadComparableTransactions({
          gqPositionId,
        });
        const result = FPricingActions.loadComparableTransactionsFailure({
          error,
        });

        actions$ = new Actions(m.cold('a', { a: action }));

        effects['fPricingService'].getComparableTransactions = () =>
          m.cold('-#', {}, error);

        const expected = m.cold('--b', { b: result });

        actions$ = m.hot('-a', { a: action });
        m.expect(effects.getComparableTransactions$).toBeObservable(expected);
        m.flush();
      })
    );
  });

  describe('updateFPricingData', () => {
    test(
      'should dispatch updateFPricingSuccess',
      marbles((m) => {
        snackBar.open = jest.fn();
        const gqPositionId = '1234';
        const response = {
          gqPositionId,
          marketValueDriverSelections: [],
        } as UpdateFPricingDataResponse;
        const action = FPricingActions.updateFPricing({ gqPositionId });

        effects['fPricingService'].updateFPricingData = () =>
          m.cold('a', { a: response });

        const result = FPricingActions.updateFPricingSuccess({
          response,
        });

        const expected = m.cold('b', { b: result });

        actions$ = m.hot('a', { a: action });
        m.expect(effects.updateFPricingData$).toBeObservable(expected);
        m.flush();
        expect(snackBar.open).toHaveBeenCalled();
      })
    );

    test(
      'should dispatch updateFPricingFailure',
      marbles((m) => {
        snackBar.open = jest.fn();
        const gqPositionId = '1234';
        const error = new Error('Error');

        const action = FPricingActions.updateFPricing({ gqPositionId });
        const result = FPricingActions.updateFPricingFailure({ error });

        actions$ = new Actions(m.cold('a', { a: action }));

        effects['fPricingService'].updateFPricingData = () =>
          m.cold('-#', {}, error);

        const expected = m.cold('--b', { b: result });

        actions$ = m.hot('-a', { a: action });
        m.expect(effects.updateFPricingData$).toBeObservable(expected);
        m.flush();
        expect(snackBar.open).toHaveBeenCalled();
      })
    );
  });
});
