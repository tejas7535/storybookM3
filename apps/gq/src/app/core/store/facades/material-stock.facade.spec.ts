import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { marbles } from 'rxjs-marbles';

import { MaterialStock } from '../reducers/models';
import { getMaterialStock, getMaterialStockLoading } from '../selectors';
import { MaterialStockFacade } from './material-stock.facade';
describe('MaterialStockFacade', () => {
  let service: MaterialStockFacade;
  let spectator: SpectatorService<MaterialStockFacade>;
  let mockStore: MockStore;

  const createService = createServiceFactory({
    service: MaterialStockFacade,
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
      'should provide materialStockLoading$',
      marbles((m) => {
        mockStore.overrideSelector(getMaterialStockLoading, true);
        m.expect(service.materialStockLoading$).toBeObservable(
          m.cold('a', { a: true })
        );
      })
    );

    test(
      'should provide materialStock$',
      marbles((m) => {
        mockStore.overrideSelector(getMaterialStock, {} as MaterialStock);
        m.expect(service.materialStock$).toBeObservable(
          m.cold('a', { a: {} as MaterialStock })
        );
      })
    );
  });
});
