import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';
import { TranslocoModule } from '@ngneat/transloco';
import { Actions } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { marbles } from 'rxjs-marbles';

import {
  DataResult,
  ManufacturerSupplier,
  MaterialFormValue,
  MaterialRequest,
  MaterialStandard,
  SapMaterialsDatabaseUploadStatus,
} from '@mac/msd/models';
import * as DialogActions from '@mac/msd/store/actions/dialog';
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
  let actions$: Actions;

  const mockProductCategoryOptions = [{ id: 'tube', title: 'Tube' }];
  const mockMaterialStandard: MaterialStandard = {
    id: 1,
    materialName: 'material',
    standardDocument: 'document',
    materialNumber: ['1'],
  };
  const mockManufacturerSupplier: ManufacturerSupplier = {
    id: 1,
    name: 'supplier',
    plant: 'plant',
    country: 'country',
    manufacturer: false,
  };

  const createService = createServiceFactory({
    service: DialogFacade,
    providers: [
      provideMockActions(() => actions$),
      provideMockStore({
        initialState: {
          msd: {
            dialog: {
              ...initialState,
              dialogOptions: {
                materialStandardsLoading: false,
                manufacturerSuppliersLoading: false,
                productCategoriesLoading: false,
                ratingsLoading: false,
                steelMakingProcessesLoading: false,
                co2ClassificationsLoading: false,
                castingModesLoading: false,
                conditionsLoading: false,
                dataOwnersLoading: false,
                ratings: ['rating'],
                co2Classifications: [
                  {
                    id: 'c1',
                    title: 'classification',
                    tooltip: 'classification',
                    tooltipDelay: 1500,
                  },
                ],
                castingModes: ['mode'],
                steelMakingProcesses: ['process'],
                productionProcesses: [
                  {
                    id: 'process',
                    title: 'process',
                    tooltip: 'process',
                    tooltipDelay: 1500,
                  },
                ],
                conditions: [],
                materialStandards: [mockMaterialStandard],
                manufacturerSuppliers: [mockManufacturerSupplier],
                productCategories: mockProductCategoryOptions,
                castingDiameters: ['diameter'],
                customCastingDiameters: ['customDiameter'],
                castingDiametersLoading: false,
                referenceDocuments: ['reference'],
                customReferenceDocuments: ['reference2'],
                referenceDocumentsLoading: false,
                steelMakingProcessesInUse: ['BF+BOF'],
                co2Values: [
                  {
                    co2PerTon: 3,
                    co2Scope1: 1,
                    co2Scope2: 1,
                    co2Scope3: 1,
                    co2Classification: undefined,
                  },
                ],
                dataOwners: ['owner 1', 'owner 2'],
              },
              createMaterial: {
                createMaterialLoading: false,
                createMaterialSuccess: false,
              },
              editMaterial: {
                row: {} as DataResult,
                parsedMaterial: {} as MaterialFormValue,
                column: 'column',
                materialNames: [],
                materialNamesLoading: false,
                standardDocuments: [],
                standardDocumentsLoading: false,
                supplierIds: [],
                supplierIdsLoading: false,
                loadingComplete: true,
              },
              uploadSapMaterials: {
                databaseUploadStatus: SapMaterialsDatabaseUploadStatus.RUNNING,
                isUploadStatusDialogMinimized: true,
                fileUploadProgress: 25,
              },
              minimizedDialog: {
                id: undefined,
                value: {} as MaterialFormValue,
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
    actions$ = spectator.inject(Actions);

    store.dispatch = jest.fn();
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
              tooltip: 'document',
              tooltipDelay: 1500,
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
              tooltip: 'material',
              tooltipDelay: 1500,
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
          a: [
            {
              id: 1,
              title: 'supplier',
              tooltip: 'supplier',
              tooltipDelay: 1500,
              data: { plant: 'plant' },
            },
          ],
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
              tooltip: 'plant',
              tooltipDelay: 1500,
              data: {
                supplierId: 1,
                supplierName: 'supplier',
                supplierCountry: {
                  id: 'country',
                  title:
                    'materialsSupplierDatabase.mainTable.tooltip.country.country (country)',
                },
                manufacturer: false,
              },
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
          a: [
            {
              id: 'c1',
              title: 'classification',
              tooltip: 'classification',
              tooltipDelay: 1500,
            },
            {
              id: undefined,
              title: 'materialsSupplierDatabase.mainTable.dialog.none',
            },
          ],
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
            {
              id: 'rating',
              title: 'rating',
              tooltip: 'rating',
              tooltipDelay: 1500,
            },
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
          a: [
            {
              id: 'process',
              title: 'process',
              tooltip: 'process',
              tooltipDelay: 1500,
            },
          ],
        });

        m.expect(facade.steelMakingProcess$).toBeObservable(expected);
      })
    );
  });

  describe('productionProcesses$', () => {
    it(
      'should provide the production processes',
      marbles((m) => {
        const expected = m.cold('a', {
          a: [
            {
              id: 'process',
              title: 'process',
              tooltip: 'process',
              tooltipDelay: 1500,
            },
          ],
        });

        m.expect(facade.productionProcesses$).toBeObservable(expected);
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
            {
              id: 'customDiameter',
              title: 'customDiameter',
              tooltip: 'customDiameter',
              tooltipDelay: 1500,
            },
            {
              id: 'diameter',
              title: 'diameter',
              tooltip: 'diameter',
              tooltipDelay: 1500,
            },
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

  describe('referenceDocuments$', () => {
    it(
      'should return the reference documents',
      marbles((m) => {
        const expected = m.cold('a', {
          a: [
            {
              id: 'reference2',
              title: 'reference2',
              tooltip: 'reference2',
              tooltipDelay: 1500,
            },
            {
              id: 'reference',
              title: 'reference',
              tooltip: 'reference',
              tooltipDelay: 1500,
            },
          ],
        });

        m.expect(facade.referenceDocuments$).toBeObservable(expected);
      })
    );
  });

  describe('referenceDocumentsLoading$', () => {
    it(
      'should return the loading state for reference documents',
      marbles((m) => {
        const expected = m.cold('a', {
          a: false,
        });

        m.expect(facade.referenceDocumentsLoading$).toBeObservable(expected);
      })
    );
  });

  describe('steelMakingProcessInUse$', () => {
    it(
      'should return the steel making processes in use',
      marbles((m) => {
        const expected = m.cold('a', {
          a: ['BF+BOF'],
        });

        m.expect(facade.steelMakingProcessesInUse$).toBeObservable(expected);
      })
    );
  });

  describe('co2ValuesForSupplierSteelMakingProcess$', () => {
    it(
      'should return co2 values',
      marbles((m) => {
        const expected = m.cold('a', {
          a: {
            co2Values: {
              co2PerTon: 3,
              co2Scope1: 1,
              co2Scope2: 1,
              co2Scope3: 1,
              co2Classification: {
                id: undefined,
                title: 'materialsSupplierDatabase.mainTable.dialog.none',
                tooltip: 'materialsSupplierDatabase.mainTable.dialog.none',
                tooltipDelay: 1500,
              },
            },
            otherValues: 0,
          },
        });

        m.expect(facade.co2ValuesForSupplierSteelMakingProcess$).toBeObservable(
          expected
        );
      })
    );
  });

  describe('sapMaterialsDataOwners$', () => {
    it(
      'should provide data owners',
      marbles((m) => {
        const expected = m.cold('a', {
          a: [
            {
              id: 'owner 1',
              title: 'owner 1',
              tooltip: 'owner 1',
              tooltipDelay: 1500,
            },
            {
              id: 'owner 2',
              title: 'owner 2',
              tooltip: 'owner 2',
              tooltipDelay: 1500,
            },
          ],
        });

        m.expect(facade.sapMaterialsDataOwners$).toBeObservable(expected);
      })
    );
  });

  describe('uploadSapMaterialsSucceeded$', () => {
    it(
      'should succeed',
      marbles((m) => {
        const action = DialogActions.uploadSapMaterialsSuccess({
          uploadId: 'test',
        });

        const expected = m.cold('b', {
          b: action,
        });

        actions$ = m.hot('a', { a: action });

        m.expect(facade.uploadSapMaterialsSucceeded$).toBeObservable(expected);
      })
    );
  });

  describe('getSapMaterialsDatabaseUploadStatusFailed$', () => {
    it(
      'should succeed',
      marbles((m) => {
        const action =
          DialogActions.getSapMaterialsDatabaseUploadStatusFailure();

        const expected = m.cold('b', {
          b: action,
        });

        actions$ = m.hot('a', { a: action });

        m.expect(
          facade.getSapMaterialsDatabaseUploadStatusFailed$
        ).toBeObservable(expected);
      })
    );
  });

  describe('sapMaterialsDatabaseUploadStatus$', () => {
    it(
      'should provide sapMaterialsDatabaseUploadStatus',
      marbles((m) => {
        const expected = m.cold('a', {
          a: SapMaterialsDatabaseUploadStatus.RUNNING,
        });

        m.expect(facade.sapMaterialsDatabaseUploadStatus$).toBeObservable(
          expected
        );
      })
    );
  });

  describe('isSapMaterialsUploadStatusDialogMinimized$', () => {
    it(
      'should provide isSapMaterialsUploadStatusDialogMinimized',
      marbles((m) => {
        const expected = m.cold('a', {
          a: true,
        });

        m.expect(
          facade.isSapMaterialsUploadStatusDialogMinimized$
        ).toBeObservable(expected);
      })
    );
  });

  describe('sapMaterialsFileUploadProgress$', () => {
    it(
      'should provide sapMaterialsFileUploadProgress',
      marbles((m) => {
        const expected = m.cold('a', {
          a: 25,
        });

        m.expect(facade.sapMaterialsFileUploadProgress$).toBeObservable(
          expected
        );
      })
    );
  });

  describe('editMaterialInformation', () => {
    it(
      'should provide the editMaterialInformation',
      marbles((m) => {
        const expected = m.cold('a', {
          a: {
            row: {} as DataResult,
            parsedMaterial: {} as MaterialFormValue,
            column: 'column',
            materialNames: [],
            materialNamesLoading: false,
            standardDocuments: [],
            standardDocumentsLoading: false,
            supplierIds: [],
            supplierIdsLoading: false,
            loadingComplete: true,
          },
        });

        m.expect(facade.editMaterialInformation$).toBeObservable(expected);
      })
    );
  });

  describe('editMaterial', () => {
    it(
      'should provide the editMaterial',
      marbles((m) => {
        const expected = m.cold('a', {
          a: {
            row: {} as DataResult,
            parsedMaterial: {} as MaterialFormValue,
            column: 'column',
            materialNames: [],
            materialNamesLoading: false,
            standardDocuments: [],
            standardDocumentsLoading: false,
            supplierIds: [],
            supplierIdsLoading: false,
            loadingComplete: true,
          },
        });

        m.expect(facade.editMaterial$).toBeObservable(expected);
      })
    );
  });

  describe('resumeDialogData$', () => {
    it(
      'should return the resume dialog data',
      marbles((m) => {
        const expected = m.cold('a', {
          a: {
            editMaterial: {
              row: {} as DataResult,
              parsedMaterial: {} as MaterialFormValue,
              column: 'column',
              materialNames: [],
              materialNamesLoading: false,
              standardDocuments: [],
              standardDocumentsLoading: false,
              supplierIds: [],
              supplierIdsLoading: false,
              loadingComplete: true,
            },
            minimizedDialog: { id: undefined, value: {} as MaterialFormValue },
          },
        });

        m.expect(facade.resumeDialogData$).toBeObservable(expected);
      })
    );
  });

  describe('dialogError$', () => {
    it(
      'should return the error state',
      marbles((m) => {
        const expected = m.cold('a', { a: undefined });

        m.expect(facade.dialogError$).toBeObservable(expected);
      })
    );
  });

  describe('bulkEditMaterialsSucceeded$', () => {
    it(
      'should succeed',
      marbles((m) => {
        const action = DialogActions.bulkEditMaterialsSuccess();

        const expected = m.cold('b', {
          b: action,
        });

        actions$ = m.hot('a', { a: action });

        m.expect(facade.bulkEditMaterialsSucceeded$).toBeObservable(expected);
      })
    );
  });

  describe('bulkEditMaterials', () => {
    it('should bulkEditMaterials', () => {
      const materials = [{ id: 1 }, { id: 2 }] as MaterialRequest[];

      facade.bulkEditMaterials(materials);

      expect(store.dispatch).toHaveBeenCalledWith(
        DialogActions.bulkEditMaterials({ materials })
      );
    });
  });

  describe('dispatch', () => {
    it('should dispatch each action', () => {
      facade.dispatch({ type: 'mock action' });

      expect(store.dispatch).toHaveBeenCalledWith({ type: 'mock action' });
    });
  });
});
