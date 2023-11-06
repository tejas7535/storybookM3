import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { marbles } from 'rxjs-marbles';

import { MATERIAL_INFORMATION_EXTENDED_MOCK } from '../../../../testing/mocks/models/fpricing/material-information.mock';
import { FPricingFacade } from './f-pricing.facade';
import { fPricingFeature } from './f-pricing.reducer';

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

    jest.resetAllMocks();
  });
  test('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('should provide materialInformation$', () => {
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
});
