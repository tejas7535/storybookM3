import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';
import { TranslocoModule } from '@ngneat/transloco';
import { Actions } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import moment from 'moment';
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
                databaseUploadStatus: {
                  status: SapMaterialsDatabaseUploadStatus.RUNNING,
                },
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
          a: { status: SapMaterialsDatabaseUploadStatus.RUNNING },
        });

        m.expect(facade.sapMaterialsDatabaseUploadStatus$).toBeObservable(
          expected
        );
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

  describe('openDialog', () => {
    it('should openDialog', () => {
      facade.openDialog();

      expect(store.dispatch).toHaveBeenCalledWith(DialogActions.openDialog());
    });
  });

  describe('openEditDialog', () => {
    it('should openEditDialog', () => {
      const props = {
        row: {} as DataResult,
        column: 'column',
      };

      facade.openEditDialog(props);

      expect(store.dispatch).toHaveBeenCalledWith(
        DialogActions.openEditDialog(props)
      );
    });
  });

  describe('materialDialogOpened', () => {
    it('should materialDialogOpened', () => {
      facade.materialDialogOpened();

      expect(store.dispatch).toHaveBeenCalledWith(
        DialogActions.materialDialogOpened()
      );
    });
  });

  describe('materialDialogCanceled', () => {
    it('should materialDialogCanceled', () => {
      facade.materialDialogCanceled();

      expect(store.dispatch).toHaveBeenCalledWith(
        DialogActions.materialDialogCanceled()
      );
    });
  });

  describe('materialDialogConfirmed', () => {
    it('should materialDialogConfirmed', () => {
      const standard = mockMaterialStandard;
      const supplier = mockManufacturerSupplier;
      const material = {} as MaterialRequest;

      facade.materialDialogConfirmed(standard, supplier, material);

      expect(store.dispatch).toHaveBeenCalledWith(
        DialogActions.materialDialogConfirmed({ standard, supplier, material })
      );
    });
  });

  describe('resetMaterialRecord', () => {
    it('should resetMaterialRecord', () => {
      const error = false;
      const createAnother = false;

      facade.resetMaterialRecord(error, createAnother);

      expect(store.dispatch).toHaveBeenCalledWith(
        DialogActions.resetMaterialRecord({ error, createAnother })
      );
    });
  });

  describe('addCustomSupplierName', () => {
    it('should addCustomSupplierName', () => {
      const supplierName = 'supplier';

      facade.addCustomSupplierName(supplierName);

      expect(store.dispatch).toHaveBeenCalledWith(
        DialogActions.addCustomSupplierName({ supplierName })
      );
    });
  });

  describe('addCustomSupplierPlant', () => {
    it('should addCustomSupplierPlant', () => {
      const supplierPlant = 'plant';

      facade.addCustomSupplierPlant(supplierPlant);

      expect(store.dispatch).toHaveBeenCalledWith(
        DialogActions.addCustomSupplierPlant({ supplierPlant })
      );
    });
  });

  describe('addCustomMaterialStandardDocument', () => {
    it('should addCustomMaterialStandardDocument', () => {
      const standardDocument = 'document';

      facade.addCustomMaterialStandardDocument(standardDocument);

      expect(store.dispatch).toHaveBeenCalledWith(
        DialogActions.addCustomMaterialStandardDocument({ standardDocument })
      );
    });
  });

  describe('addCustomMaterialStandardName', () => {
    it('should addCustomMaterialStandardName', () => {
      const materialName = 'material';

      facade.addCustomMaterialStandardName(materialName);

      expect(store.dispatch).toHaveBeenCalledWith(
        DialogActions.addCustomMaterialStandardName({ materialName })
      );
    });
  });

  describe('manufacturerSupplierDialogOpened', () => {
    it('should manufacturerSupplierDialogOpened', () => {
      facade.manufacturerSupplierDialogOpened();

      expect(store.dispatch).toHaveBeenCalledWith(
        DialogActions.manufacturerSupplierDialogOpened()
      );
    });
  });

  describe('manufacturerSupplierDialogConfirmed', () => {
    it('should manufacturerSupplierDialogConfirmed', () => {
      const supplier = mockManufacturerSupplier;

      facade.manufacturerSupplierDialogConfirmed(supplier);

      expect(store.dispatch).toHaveBeenCalledWith(
        DialogActions.manufacturerSupplierDialogConfirmed({ supplier })
      );
    });
  });

  describe('addCustomSupplierBusinessPartnerId', () => {
    it('should addCustomSupplierBusinessPartnerId', () => {
      const supplierBusinessPartnerId = 1;

      facade.addCustomSupplierBusinessPartnerId(supplierBusinessPartnerId);

      expect(store.dispatch).toHaveBeenCalledWith(
        DialogActions.addCustomSupplierBusinessPartnerId({
          supplierBusinessPartnerId,
        })
      );
    });
  });

  describe('materialStandardDialogOpened', () => {
    it('should materialStandardDialogOpened', () => {
      facade.materialStandardDialogOpened();

      expect(store.dispatch).toHaveBeenCalledWith(
        DialogActions.materialStandardDialogOpened()
      );
    });
  });

  describe('materialStandardDialogConfirmed', () => {
    it('should materialStandardDialogConfirmed', () => {
      const standard = mockMaterialStandard;

      facade.materialStandardDialogConfirmed(standard);

      expect(store.dispatch).toHaveBeenCalledWith(
        DialogActions.materialStandardDialogConfirmed({ standard })
      );
    });
  });

  describe('updateCreateMaterialDialogValues', () => {
    it('should updateCreateMaterialDialogValues', () => {
      const form = {} as MaterialFormValue;

      facade.updateCreateMaterialDialogValues(form);

      expect(store.dispatch).toHaveBeenCalledWith(
        DialogActions.updateCreateMaterialDialogValues({ form })
      );
    });
  });

  describe('fetchCastingDiameters', () => {
    it('should fetchCastingDiameters', () => {
      const supplierId = 1;
      const castingMode = 'mode';

      facade.fetchCastingDiameters(supplierId, castingMode);

      expect(store.dispatch).toHaveBeenCalledWith(
        DialogActions.fetchCastingDiameters({ supplierId, castingMode })
      );
    });
  });

  describe('addCustomReferenceDocument', () => {
    it('should addCustomReferenceDocument', () => {
      const referenceDocument = 'document';

      facade.addCustomReferenceDocument(referenceDocument);

      expect(store.dispatch).toHaveBeenCalledWith(
        DialogActions.addCustomReferenceDocument({ referenceDocument })
      );
    });
  });

  describe('addCustomCastingDiameter', () => {
    it('should addCustomCastingDiameter', () => {
      const castingDiameter = 'diameter';

      facade.addCustomCastingDiameter(castingDiameter);

      expect(store.dispatch).toHaveBeenCalledWith(
        DialogActions.addCustomCastingDiameter({ castingDiameter })
      );
    });
  });

  describe('uploadSapMaterials', () => {
    it('should uploadSapMaterials', () => {
      const upload = {
        owner: 'owner',
        date: moment(),
        maturity: 1,
        file: new File([''], 'test.csv'),
      };

      facade.uploadSapMaterials(upload);

      expect(store.dispatch).toHaveBeenCalledWith(
        DialogActions.uploadSapMaterials({ upload })
      );
    });
  });

  describe('clearRejectedSapMaterials', () => {
    it('should clearRejectedSapMaterials', () => {
      facade.clearRejectedSapMaterials();

      expect(store.dispatch).toHaveBeenCalledWith(
        DialogActions.clearRejectedSapMaterials()
      );
    });
  });

  describe('sapMaterialsUploadStatusReset', () => {
    it('should sapMaterialsUploadStatusReset', () => {
      facade.sapMaterialsUploadStatusReset();

      expect(store.dispatch).toHaveBeenCalledWith(
        DialogActions.sapMaterialsUploadStatusReset()
      );
    });
  });

  describe('downloadRejectedSapMaterials', () => {
    it('should downloadRejectedSapMaterials', () => {
      facade.downloadRejectedSapMaterials();

      expect(store.dispatch).toHaveBeenCalledWith(
        DialogActions.downloadRejectedSapMaterials()
      );
    });
  });

  describe('resetSteelMakingProcessInUse', () => {
    it('should resetSteelMakingProcessInUse', () => {
      facade.resetSteelMakingProcessInUse();

      expect(store.dispatch).toHaveBeenCalledWith(
        DialogActions.resetSteelMakingProcessInUse()
      );
    });
  });

  describe('fetchSteelMakingProcessesInUse', () => {
    it('should fetchSteelMakingProcessesInUse', () => {
      const supplierId = 1;
      const castingMode = 'mode';
      const castingDiameter = 'diameter';

      facade.fetchSteelMakingProcessesInUse(
        supplierId,
        castingMode,
        castingDiameter
      );

      expect(store.dispatch).toHaveBeenCalledWith(
        DialogActions.fetchSteelMakingProcessesInUse({
          supplierId,
          castingMode,
          castingDiameter,
        })
      );
    });
  });

  describe('addCustomDataOwner', () => {
    it('should addCustomDataOwner', () => {
      const dataOwner = 'owner';

      facade.addCustomDataOwner(dataOwner);

      expect(store.dispatch).toHaveBeenCalledWith(
        DialogActions.addCustomDataOwner({ dataOwner })
      );
    });
  });

  describe('fetchCo2ValuesForSupplierSteelMakingProcess', () => {
    it('should fetchCo2ValuesForSupplierSteelMakingProcess', () => {
      const supplierId = 1;
      const steelMakingProcess = 'process';
      const productCategory = 'tube';

      facade.fetchCo2ValuesForSupplierSteelMakingProcess(
        supplierId,
        steelMakingProcess,
        productCategory
      );

      expect(store.dispatch).toHaveBeenCalledWith(
        DialogActions.fetchCo2ValuesForSupplierSteelMakingProcess({
          supplierId,
          steelMakingProcess,
          productCategory,
        })
      );
    });
  });

  describe('minimizeDialog', () => {
    it('should minimizeDialog', () => {
      const id = 1;
      const value = {} as MaterialFormValue;
      const isCopy = false;
      const isBulkEdit = false;

      facade.minimizeDialog(id, value, isCopy, isBulkEdit);

      expect(store.dispatch).toHaveBeenCalledWith(
        DialogActions.minimizeDialog({ id, value, isCopy, isBulkEdit })
      );
    });
  });
});
