import { SpectatorService } from '@ngneat/spectator';
import { createServiceFactory } from '@ngneat/spectator/jest';
import { TranslocoModule } from '@ngneat/transloco';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { marbles } from 'rxjs-marbles';

import { ManufacturerSupplier, MaterialStandard } from '@mac/msd/models';
import { initialState } from '@mac/msd/store/reducers/dialog/dialog.reducer';

import { DialogFacade } from '.';

jest.mock('@ngneat/transloco', () => ({
  ...jest.requireActual<TranslocoModule>('@ngneat/transloco'),
  translate: jest.fn((string) => string),
}));

describe('DialogFacade', () => {
  let spectator: SpectatorService<DialogFacade>;
  let facade: DialogFacade;
  let store: MockStore;

  const mockProductCategoryOptions = [{ id: 'tube', title: 'Tube' }];
  const mockMaterialStandard: MaterialStandard = {
    id: 1,
    materialName: 'material',
    standardDocument: 'document',
    materialNumber: 'number',
  };
  const mockManufacturerSupplier: ManufacturerSupplier = {
    id: 1,
    name: 'supplier',
    plant: 'plant',
  };

  const createService = createServiceFactory({
    service: DialogFacade,
    providers: [
      provideMockStore({
        initialState: {
          msd: {
            data: {
              productCategoryOptions: mockProductCategoryOptions,
              producCategoriesLoading: false,
            },
            dialog: {
              ...initialState,
              dialogOptions: {
                materialStandardsLoading: false,
                manufacturerSuppliersLoading: false,
                ratingsLoading: false,
                steelMakingProcessesLoading: false,
                co2ClassificationsLoading: false,
                castingModesLoading: false,
                ratings: ['rating'],
                co2Classifications: [{ id: 'c1', title: 'classification' }],
                castingModes: ['mode'],
                steelMakingProcesses: ['process'],
                materialStandards: [mockMaterialStandard],
                manufacturerSuppliers: [mockManufacturerSupplier],
                castingDiameters: ['diameter'],
                customCastingDiameters: ['customDiameter'],
                castingDiametersLoading: false,
              },
              createMaterial: {
                createMaterialLoading: false,
                createMaterialSuccess: false,
              },
            },
          },
          'azure-auth': {
            accountInfo: {},
          },
        },
      }),
    ],
  });

  beforeEach(() => {
    spectator = createService();
    facade = spectator.service;
    store = spectator.inject(MockStore);
  });

  it('should create', () => {
    expect(facade).toBeDefined();
  });

  describe('dialogLoading$', () => {
    it(
      'should return false',
      marbles((m) => {
        const expected = m.cold('a', {
          a: false,
        });

        m.expect(facade.dialogLoading$).toBeObservable(expected);
      })
    );
  });

  describe('createMaterialLoading$', () => {
    it(
      'should return false',
      marbles((m) => {
        const expected = m.cold('a', {
          a: false,
        });

        m.expect(facade.dialogLoading$).toBeObservable(expected);
      })
    );
  });

  describe('standardDocuments$', () => {
    it(
      'should provide the standard documents',
      marbles((m) => {
        const expected = m.cold('a', {
          a: [
            {
              id: 1,
              title: 'document',
              data: { materialNames: [{ id: 1, materialName: 'material' }] },
            },
          ],
        });

        m.expect(facade.standardDocuments$).toBeObservable(expected);
      })
    );
  });

  describe('materialNames$', () => {
    it(
      'should provide the material names',
      marbles((m) => {
        const expected = m.cold('a', {
          a: [
            {
              id: 1,
              title: 'material',
              data: {
                standardDocuments: [{ id: 1, standardDocument: 'document' }],
              },
            },
          ],
        });

        m.expect(facade.materialNames$).toBeObservable(expected);
      })
    );
  });

  describe('suppliers$', () => {
    it(
      'should provide the suppliers',
      marbles((m) => {
        const expected = m.cold('a', {
          a: [{ id: 1, title: 'supplier', data: { plant: 'plant' } }],
        });

        m.expect(facade.suppliers$).toBeObservable(expected);
      })
    );
  });

  describe('supplierPlants$', () => {
    it(
      'should provide the supplier plants',
      marbles((m) => {
        const expected = m.cold('a', {
          a: [
            {
              id: 'plant',
              title: 'plant',
              data: { supplierId: 1, supplierName: 'supplier' },
            },
          ],
        });

        m.expect(facade.supplierPlants$).toBeObservable(expected);
      })
    );
  });

  describe('castingModes$', () => {
    it(
      'should provide the casting modes',
      marbles((m) => {
        const expected = m.cold('a', {
          a: ['mode'],
        });

        m.expect(facade.castingModes$).toBeObservable(expected);
      })
    );
  });

  describe('co2Classifications$', () => {
    it(
      'should provide the co2 classifications',
      marbles((m) => {
        const expected = m.cold('a', {
          a: [{ id: 'c1', title: 'classification' }],
        });

        m.expect(facade.co2Classification$).toBeObservable(expected);
      })
    );
  });

  describe('ratings$', () => {
    it(
      'should provide the ratings',
      marbles((m) => {
        const expected = m.cold('a', {
          a: [
            { id: 'rating', title: 'rating' },
            {
              id: undefined,
              title: 'materialsSupplierDatabase.mainTable.dialog.none',
            },
          ],
        });

        m.expect(facade.ratings$).toBeObservable(expected);
      })
    );
  });

  describe('steelMakingProcesses$', () => {
    it(
      'should provide the steel making processes',
      marbles((m) => {
        const expected = m.cold('a', {
          a: [{ id: 'process', title: 'process' }],
        });

        m.expect(facade.steelMakingProcess$).toBeObservable(expected);
      })
    );
  });

  describe('categories$', () => {
    it(
      'should provide the product categories',
      marbles((m) => {
        const expected = m.cold('a', {
          a: mockProductCategoryOptions,
        });

        m.expect(facade.categories$).toBeObservable(expected);
      })
    );
  });

  describe('castingDiameters$', () => {
    it(
      'should provide the casting diameters',
      marbles((m) => {
        const expected = m.cold('a', {
          a: [
            { id: 'customDiameter', title: 'customDiameter' },
            { id: 'diameter', title: 'diameter' },
          ],
        });

        m.expect(facade.castingDiameters$).toBeObservable(expected);
      })
    );
  });

  describe('castingDiametersLoading$', () => {
    it(
      'should return false',
      marbles((m) => {
        const expected = m.cold('a', {
          a: false,
        });

        m.expect(facade.castingDiametersLoading$).toBeObservable(expected);
      })
    );
  });

  describe('createMaterialRecord$', () => {
    it(
      'should return undefined',
      marbles((m) => {
        const expected = m.cold('a', {
          a: undefined,
        });

        m.expect(facade.createMaterialRecord$).toBeObservable(expected);
      })
    );
  });

  describe('dispatch', () => {
    it('should dispatch each action', () => {
      store.dispatch = jest.fn();
      facade.dispatch({ type: 'mock action' });

      expect(store.dispatch).toHaveBeenCalledWith({ type: 'mock action' });
    });
  });
});
