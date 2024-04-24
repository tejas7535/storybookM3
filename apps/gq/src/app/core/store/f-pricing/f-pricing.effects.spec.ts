import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { ActiveCaseFacade } from '@gq/core/store/active-case/active-case.facade';
import { PriceSource } from '@gq/shared/models';
import {
  FPricingCalculationsRequest,
  FPricingCalculationsResponse,
  FPricingData,
  UpdateFPricingDataResponse,
} from '@gq/shared/models/f-pricing';
import { ComparableKNumbers } from '@gq/shared/models/f-pricing/comparable-k-numbers.interface';
import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';
import { Actions } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { MockProvider } from 'ng-mocks';
import { marbles } from 'rxjs-marbles';

import { UpdateQuotationDetail } from '../active-case/models';
import {
  FPricingComparableMaterials,
  Material,
} from '../reducers/transactions/models/f-pricing-comparable-materials.interface';
import { FPricingActions } from './f-pricing.actions';
import { FPricingEffects } from './f-pricing.effects';
import { fPricingFeature, initialState } from './f-pricing.reducer';

describe('FPricingEffects', () => {
  let actions$: any;
  let spectator: SpectatorService<FPricingEffects>;
  let effects: FPricingEffects;
  let snackBar: MatSnackBar;
  let store: any;

  const createService = createServiceFactory({
    service: FPricingEffects,
    imports: [HttpClientTestingModule, MatSnackBarModule],
    providers: [
      provideMockActions(() => actions$),
      provideMockStore({ initialState: { fPricing: initialState } }),
      MockProvider(ActiveCaseFacade),
    ],
  });

  beforeEach(() => {
    spectator = createService();
    effects = spectator.service;
    actions$ = spectator.inject(Actions);
    snackBar = spectator.inject(MatSnackBar);
    store = spectator.inject(MockStore);
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

  describe('triggerInitialCalculations$', () => {
    test(
      'should dispatch triggerFPricingCalculations',
      marbles((m) => {
        const action = FPricingActions.loadFPricingDataSuccess({
          data: {} as FPricingData,
        });
        const result = FPricingActions.triggerFPricingCalculations();

        const expected = m.cold('b', { b: result });

        actions$ = m.hot('a', { a: action });
        m.expect(effects.triggerInitialCalculations$).toBeObservable(expected);
        m.flush();
      })
    );
  });

  describe('getFPricingCalculations$', () => {
    test(
      'should dispatch triggerFPricingCalculationsSuccess',
      marbles((m) => {
        const requestData = {
          referencePrice: 100,
          relativeMvdSurcharge: 0.5,
          relativeTvdSurcharge: 0.5,
          sanityCheck: {
            lastCustomerPrice: 12,
            maxMargin: 300,
            minMargin: 200,
            sqv: 12,
          },
        } as FPricingCalculationsRequest;

        store.overrideSelector(
          fPricingFeature.getDataForTriggerCalculations,
          requestData
        );
        const response = {
          absoluteMvdSurcharge: 120,
          absoluteTvdSurcharge: 20,
          gpm: 0.5,
          finalPrice: 100_000,
          sanityCheck: {
            maxPrice: 300,
            minPrice: 200,
            priceBeforeSanityCheck: 60,
            value: 12,
          },
        } as FPricingCalculationsResponse;
        const action = FPricingActions.triggerFPricingCalculations();

        effects['fPricingService'].getFPricingCalculations = () =>
          m.cold('a', { a: response });

        const result = FPricingActions.triggerFPricingCalculationsSuccess({
          response: {
            ...response,
            gpm: response.gpm * 100,
            sanityCheck: {
              ...response.sanityCheck,
              sqv: requestData.sanityCheck.sqv,
              lastCustomerPrice: requestData.sanityCheck.lastCustomerPrice,
              priceAfterSanityCheck: response.finalPrice,
            },
          },
        });
        const expected = m.cold('b', { b: result });

        actions$ = m.hot('a', { a: action });
        m.expect(effects.getFPricingCalculations$).toBeObservable(expected);
        m.flush();
      })
    );

    test(
      'Should dispatch error action',
      marbles((m) => {
        const error = new Error('Error');

        const action = FPricingActions.triggerFPricingCalculations();
        const result = FPricingActions.triggerFPricingCalculationsFailure({
          error,
        });

        actions$ = new Actions(m.cold('a', { a: action }));

        effects['fPricingService'].getFPricingCalculations = () =>
          m.cold('-#', {}, error);

        const expected = m.cold('--b', { b: result });

        actions$ = m.hot('-a', { a: action });
        m.expect(effects.getFPricingCalculations$).toBeObservable(expected);
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
  describe('updateGqPrice$', () => {
    test(
      'should call the activeCaseFacades method updateQuotationDetails',
      marbles((m) => {
        const gqPositionId = '1234567890';
        const price = 450;

        const updateQuotationDetail: UpdateQuotationDetail = {
          gqPositionId,
          priceSource: PriceSource.GQ,
          price,
        };

        const action = FPricingActions.updateFPricingSuccess({
          response: {
            gqPositionId,
            marketValueDriverSelections: [],
            finalPrice: price,
          } as UpdateFPricingDataResponse,
        });
        effects['activeCaseFacade'].updateQuotationDetails = jest.fn();
        actions$ = m.hot('a', { a: action });
        effects.updateGqPrice$.subscribe(() => {
          expect(
            effects['activeCaseFacade'].updateQuotationDetails
          ).toHaveBeenCalledWith([updateQuotationDetail]);
        });
        m.flush();
      })
    );
  });

  describe('updateManualPrice$', () => {
    test(
      'Should call the ActiveCaseFacade updateQuotationDetails method',
      marbles((m) => {
        const gqPositionId = '1234567890';
        const action = FPricingActions.updateManualPrice({
          gqPositionId,
          comment: 'test',
        });

        actions$ = m.hot('a', { a: action });
        effects['activeCaseFacade'].updateQuotationDetails = jest.fn();

        effects.updateManualPrice$.subscribe(() => {
          expect(
            effects['activeCaseFacade'].updateQuotationDetails
          ).toHaveBeenCalled();
        });
        m.flush();
      })
    );
  });
});
