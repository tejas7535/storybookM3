import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { marbles } from 'rxjs-marbles';

import {
  ExtendedSapPriceConditionDetail,
  SapPriceConditionDetail,
} from '../reducers/models';
import {
  getExtendedSapPriceConditionDetails,
  getSapPriceDetails,
  getSapPriceDetailsLoading,
} from '../selectors/sap-price-details/sap-price-details.selector';
import { SapPriceDetailsFacade } from './sap-price-details.facade';
describe('SapPriceDetailsFacade', () => {
  let service: SapPriceDetailsFacade;
  let spectator: SpectatorService<SapPriceDetailsFacade>;
  let mockStore: MockStore;

  const createService = createServiceFactory({
    service: SapPriceDetailsFacade,
    providers: [provideMockStore({})],
  });

  beforeEach(() => {
    spectator = createService();
    service = spectator.service;
    mockStore = spectator.inject(MockStore);

    jest.resetAllMocks();
  });

  describe('should provide Observables', () => {
    test(
      'should provide getSapPriceDetailsLoading$',
      marbles((m) => {
        mockStore.overrideSelector(getSapPriceDetailsLoading, true);
        m.expect(service.sapPriceDetailsLoading$).toBeObservable(
          m.cold('a', { a: true })
        );
      })
    );

    test(
      'should provide getSapPriceDetails$',
      marbles((m) => {
        mockStore.overrideSelector(
          getSapPriceDetails,
          {} as SapPriceConditionDetail[]
        );
        m.expect(service.sapPriceDetails$).toBeObservable(
          m.cold('a', { a: {} as SapPriceConditionDetail[] })
        );
      })
    );

    test(
      'should provide getExtendedSapPriceConditionDetails$',
      marbles((m) => {
        mockStore.overrideSelector(
          getExtendedSapPriceConditionDetails,
          {} as ExtendedSapPriceConditionDetail[]
        );
        m.expect(service.extendedSapPriceConditionDetails$).toBeObservable(
          m.cold('a', { a: {} as ExtendedSapPriceConditionDetail[] })
        );
      })
    );
  });
});
