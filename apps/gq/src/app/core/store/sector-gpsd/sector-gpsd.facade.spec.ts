import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { marbles } from 'rxjs-marbles';

import { selectSectorGpsd } from '../actions/create-case/create-case.actions';
import { SectorGpsdActions } from './sector-gpsd.actions';
import { SectorGpsdFacade } from './sector-gpsd.facade';
import { sectorGpsdFeature } from './sector-gpsd.reducer';

describe('SectorGpsdFacade', () => {
  let service: SectorGpsdFacade;
  let spectator: SpectatorService<SectorGpsdFacade>;
  let mockStore: MockStore;

  const createService = createServiceFactory({
    service: SectorGpsdFacade,
    providers: [provideMockStore({})],
  });

  beforeEach(() => {
    spectator = createService();
    service = spectator.service;
    mockStore = spectator.inject(MockStore);

    jest.resetAllMocks();
  });

  describe('Observables', () => {
    test(
      'should provide sectorGpsds$',
      marbles((m) => {
        mockStore.overrideSelector(sectorGpsdFeature.selectSectorGpsds, []);
        m.expect(service.sectorGpsds$).toBeObservable(m.cold('a', { a: [] }));
      })
    );
    test(
      'should provide sectorGpsdLoading$',
      marbles((m) => {
        mockStore.overrideSelector(
          sectorGpsdFeature.selectSectorGpsdLoading,
          false
        );
        m.expect(service.sectorGpsdLoading$).toBeObservable(
          m.cold('a', { a: false })
        );
      })
    );
    test(
      'should provide selectedSectorGpsd$',
      marbles((m) => {
        const selectedSectorGpsd = { name: 'test', id: 'test' };
        mockStore.overrideSelector(
          sectorGpsdFeature.getSelectedSectorGpsd,
          selectedSectorGpsd
        );
        m.expect(service.selectedSectorGpsd$).toBeObservable(
          m.cold('a', { a: selectedSectorGpsd })
        );
      })
    );
  });

  describe('methods', () => {
    test('should dispatch getAllSectorGpsds', () => {
      mockStore.dispatch = jest.fn();
      service.loadSectorGpsdByCustomerAndSalesOrg('1', '2');
      expect(mockStore.dispatch).toHaveBeenCalledWith(
        SectorGpsdActions.getAllSectorGpsds({ customerId: '1', salesOrg: '2' })
      );
    });
    test('should dispatch selectSectorGpsd', () => {
      mockStore.dispatch = jest.fn();
      const sectorGpsd = { name: 'test', id: 'test' };
      service.selectSectorGpsdForCaseCreation(sectorGpsd);
      expect(mockStore.dispatch).toHaveBeenCalledWith(
        selectSectorGpsd({ sectorGpsd })
      );
    });

    test('should dispatch resetAllSectorGpsds', () => {
      mockStore.dispatch = jest.fn();
      service.resetAllSectorGpsds();
      expect(mockStore.dispatch).toHaveBeenCalledWith(
        SectorGpsdActions.resetAllSectorGpsds()
      );
    });
  });
});
