import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { marbles } from 'rxjs-marbles';

import {
  getPlantMaterialDetails,
  getPlantMaterialDetailsLoading,
} from '../selectors';
import { PlantMaterialDetailsFacade } from './plant-material-details.facade';
describe('PlantMaterialDetailsFacade', () => {
  let service: PlantMaterialDetailsFacade;
  let spectator: SpectatorService<PlantMaterialDetailsFacade>;
  let mockStore: MockStore;

  const createService = createServiceFactory({
    service: PlantMaterialDetailsFacade,
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
      'should provide plantMaterialDetailsLoading$',
      marbles((m) => {
        mockStore.overrideSelector(getPlantMaterialDetailsLoading, true);
        m.expect(service.plantMaterialDetailsLoading$).toBeObservable(
          m.cold('a', { a: true })
        );
      })
    );

    test(
      'should provide plantMaterialDetails$',
      marbles((m) => {
        mockStore.overrideSelector(getPlantMaterialDetails, []);
        m.expect(service.plantMaterialDetails$).toBeObservable(
          m.cold('a', { a: [] })
        );
      })
    );
  });
});
