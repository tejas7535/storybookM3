import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { marbles } from 'rxjs-marbles';

import { MATERIAL_INFORMATION_EXTENDED_MOCK } from '../../../../testing/mocks/models/fpricing/material-information.mock';
import { getQuotationCurrency } from '../active-case';
import { FPricingActions } from './f-pricing.actions';
import { FPricingFacade } from './f-pricing.facade';
import { fPricingFeature, initialState } from './f-pricing.reducer';

describe('Service: FPricingFacade', () => {
  let service: FPricingFacade;
  let spectator: SpectatorService<FPricingFacade>;
  let mockStore: MockStore;

  const createService = createServiceFactory({
    service: FPricingFacade,
    providers: [provideMockStore({})],
  });

  beforeEach(() => {
    spectator = createService();
    service = spectator.service;
    mockStore = spectator.inject(MockStore);
    mockStore.dispatch = jest.fn();
    jest.resetAllMocks();
  });
  test('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('should provide Observables', () => {
    test(
      'should provide fPricingDataComplete$',
      marbles((m) => {
        mockStore.overrideSelector(fPricingFeature.selectFPricingState, {
          ...initialState,
          gqPositionId: '1234',
          referencePrice: 100_000,
        });

        mockStore.overrideSelector(getQuotationCurrency, 'EUR');
        m.expect(service.fPricingDataComplete$).toBeObservable(
          m.cold('a', {
            a: {
              ...initialState,
              gqPositionId: '1234',
              referencePrice: 100_000,
              currency: 'EUR',
            },
          })
        );
      })
    );
    test(
      'should provide referencePrice$',
      marbles((m) => {
        mockStore.overrideSelector(
          fPricingFeature.selectReferencePrice,
          100_000
        );
        m.expect(service.referencePrice$).toBeObservable(
          m.cold('a', { a: 100_000 })
        );
      })
    );
    test(
      'should provide allApproversLoading',
      marbles((m) => {
        mockStore.overrideSelector(
          fPricingFeature.getMaterialInformationExtended,
          MATERIAL_INFORMATION_EXTENDED_MOCK
        );
        m.expect(service.materialInformation$).toBeObservable(
          m.cold('a', { a: MATERIAL_INFORMATION_EXTENDED_MOCK })
        );
      })
    );
  });

  // #########################################
  // ##########     methods     ##############
  // #########################################
  describe('loadDataForPricingAssistant', () => {
    test('should dispatch loadFPricingData', () => {
      const gqPositionId = '1234';
      const action = FPricingActions.loadFPricingData({ gqPositionId });

      service.loadDataForPricingAssistant(gqPositionId);

      expect(mockStore.dispatch).toHaveBeenCalledWith(action);
    });
  });
});
