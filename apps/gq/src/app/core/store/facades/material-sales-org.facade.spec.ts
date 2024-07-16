import { MaterialSalesOrg } from '@gq/shared/models/quotation-detail/material-sales-org.model';
import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { marbles } from 'rxjs-marbles';

import {
  getMaterialSalesOrg,
  getMaterialSalesOrgDataAvailable,
  getMaterialSalesOrgLoading,
} from '../selectors/material-sales-org/material-sales-org.selector';
import { MaterialSalesOrgFacade } from './material-sales-org.facade';

describe('MaterialSalesOrgFacade', () => {
  let service: MaterialSalesOrgFacade;
  let spectator: SpectatorService<MaterialSalesOrgFacade>;
  let mockStore: MockStore;

  const createService = createServiceFactory({
    service: MaterialSalesOrgFacade,
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
      'should provide materialSalesOrgLoading$',
      marbles((m) => {
        mockStore.overrideSelector(getMaterialSalesOrgLoading, true);
        m.expect(service.materialSalesOrgLoading$).toBeObservable(
          m.cold('a', { a: true })
        );
      })
    );

    test(
      'should provide materialSalesOrg$',
      marbles((m) => {
        mockStore.overrideSelector(getMaterialSalesOrg, {} as MaterialSalesOrg);
        m.expect(service.materialSalesOrg$).toBeObservable(
          m.cold('a', { a: {} as MaterialSalesOrg })
        );
      })
    );

    test(
      'should provide materialSalesOrgDataAvailable$',
      marbles((m) => {
        mockStore.overrideSelector(getMaterialSalesOrgDataAvailable, true);
        m.expect(service.materialSalesOrgDataAvailable$).toBeObservable(
          m.cold('a', { a: true })
        );
      })
    );
  });
});
