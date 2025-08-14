import { QuotationDetail } from '@gq/shared/models';
import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { marbles } from 'rxjs-marbles';

import { activeCaseFeature } from './active-case.reducer';
import { RfqItemsFacade } from './rfq-items.facade';

describe('rfqItemsFacade', () => {
  let facade: RfqItemsFacade;
  let spectator: SpectatorService<RfqItemsFacade>;
  let mockStore: MockStore;

  const createService = createServiceFactory({
    service: RfqItemsFacade,
    providers: [provideMockStore({})],
  });

  beforeEach(() => {
    spectator = createService();
    facade = spectator.service;
    mockStore = spectator.inject(MockStore);
  });
  test('should be created', () => {
    expect(facade).toBeTruthy();
  });

  describe('Observables', () => {
    test(
      'should provide hasRfqItems$',
      marbles((m) => {
        mockStore.overrideSelector(activeCaseFeature.hasRfqItems, true);
        m.expect(facade.hasRfqItems$).toBeObservable(m.cold('a', { a: true }));
      })
    );

    test(
      'should provide rfqItems$',
      marbles((m) => {
        const quotationDetails = [
          { gqPositionId: 1 } as unknown as QuotationDetail,
          { gqPositionId: 2 } as unknown as QuotationDetail,
        ];
        mockStore.overrideSelector(
          activeCaseFeature.getRfqItems,
          quotationDetails
        );
        m.expect(facade.rfqItems$).toBeObservable(
          m.cold('a', { a: quotationDetails })
        );
      })
    );
  });
});
