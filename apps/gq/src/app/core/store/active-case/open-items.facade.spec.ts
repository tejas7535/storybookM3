import { QuotationDetail } from '@gq/shared/models';
import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { marbles } from 'rxjs-marbles';

import { activeCaseFeature } from './active-case.reducer';
import { OpenItemsFacade } from './open-items.facade';

describe('openItemsFacade', () => {
  let facade: OpenItemsFacade;
  let spectator: SpectatorService<OpenItemsFacade>;
  let mockStore: MockStore;

  const createService = createServiceFactory({
    service: OpenItemsFacade,
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
      'should provide hasOpenItems$',
      marbles((m) => {
        mockStore.overrideSelector(activeCaseFeature.hasOpenItems, true);
        m.expect(facade.hasOpenItems$).toBeObservable(m.cold('a', { a: true }));
      })
    );

    test(
      'should provide openItems$',
      marbles((m) => {
        const quotationDetails = [
          { gqPositionId: 1 } as unknown as QuotationDetail,
          { gqPositionId: 2 } as unknown as QuotationDetail,
        ];
        mockStore.overrideSelector(
          activeCaseFeature.getOpenItems,
          quotationDetails
        );
        m.expect(facade.openItems$).toBeObservable(
          m.cold('a', { a: quotationDetails })
        );
      })
    );
  });
});
