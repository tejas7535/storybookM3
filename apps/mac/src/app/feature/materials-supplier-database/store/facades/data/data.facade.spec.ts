import { TranslocoModule } from '@jsverse/transloco';
import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { marbles } from 'rxjs-marbles/jest';

import { getUsername } from '@schaeffler/azure-auth';

import { MaterialClass, NavigationLevel } from '@mac/msd/constants';
import {
  DataResult,
  MaterialFormValue,
  SAPMaterialsRequest,
  SteelMaterial,
} from '@mac/msd/models';
import { initialState } from '@mac/msd/store/reducers/data/data.reducer';

import * as DataActions from '../../actions/data';
import { openMultiEditDialog } from '../../actions/dialog';
import { getSAPResult } from '../../selectors';
import { DataFacade } from '.';

jest.mock('@jsverse/transloco', () => ({
  ...jest.requireActual<TranslocoModule>('@jsverse/transloco'),
  translate: jest.fn((string) => string.split('.').pop()),
}));

describe('DataFacade', () => {
  let spectator: SpectatorService<DataFacade>;
  let facade: DataFacade;
  let store: MockStore;

  const mockMaterialClassOptions = [MaterialClass.STEEL];
  const mockResult: SteelMaterial[] = [
    {
      id: 6956,
      materialClass: MaterialClass.STEEL,
      materialStandardId: 61,
      materialStandardMaterialName: 'SAE1008mod.',
      materialNumbers: [],
      materialStandardStandardDocument: '08120003E',
      manufacturerSupplierId: 212,
      manufacturerSupplierName: 'ABS',
      manufacturerSupplierPlant: 'Udine',
      manufacturerSupplierCountry: 'Italy',
      selfCertified: false,
      productCategory: 'barBright',
      productCategoryText: 'Bright bar',
      co2PerTon: 6666,
      releaseDateYear: 2022,
      releaseDateMonth: 1,
      releaseRestrictions: 'TEST',
      castingMode: 'Ingot',
      castingDiameter: '200x300',
      maxDimension: 100,
      manufacturer: false,
      blocked: false,
      minRecyclingRate: 42,
      maxRecyclingRate: 42,
    },
  ];
  const mockNavigation = {
    materialClass: MaterialClass.STEEL,
    navigationLevel: NavigationLevel.MATERIAL,
  };

  const createService = createServiceFactory({
    service: DataFacade,
    providers: [
      provideMockStore({
        initialState: {
          msd: {
            data: {
              ...initialState,
              materialClasses: mockMaterialClassOptions,
              materialClassLoading: false,
              productCategoryLoading: false,
              navigation: mockNavigation,
              agGridColumns: 'agGridColumns',
              materials: {
                steelMaterials: mockResult,
              },
              sapMaterialsRows: {
                lastRow: -1,
                totalRows: 300,
                subTotalRows: 100,
                startRow: 0,
              },
              result: {
                st: {
                  materials: mockResult,
                },
                sap: {
                  materials: [],
                },
              },
            },
            dialog: {
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

    store.dispatch = jest.fn();
  });

  it('should create', () => {
    expect(facade).toBeDefined();
  });

  describe('materialClassOptions$', () => {
    it(
      'should provide material class options',
      marbles((m) => {
        const expected = m.cold('a', {
          a: [...mockMaterialClassOptions, MaterialClass.SAP_MATERIAL],
        });

        m.expect(facade.materialClassOptions$).toBeObservable(expected);
      })
    );
  });

  describe('optionsLoading$', () => {
    it(
      'should return false',
      marbles((m) => {
        const expected = m.cold('a', {
          a: false,
        });

        m.expect(facade.optionsLoading$).toBeObservable(expected);
      })
    );
  });

  describe('resultLoading$', () => {
    it(
      'should return false',
      marbles((m) => {
        const expected = m.cold('a', {
          a: false,
        });

        m.expect(facade.resultLoading$).toBeObservable(expected);
      })
    );
  });

  describe('result$', () => {
    it(
      'should provide the result',
      marbles((m) => {
        const expected = m.cold('a', {
          a: mockResult,
        });

        m.expect(facade.result$).toBeObservable(expected);
      })
    );
  });

  describe('sapResult$', () => {
    beforeAll(() => {
      store.overrideSelector(getSAPResult, {
        data: [],
        lastRow: -1,
        totalRows: 300,
        subTotalRows: 100,
      });
    });
    it(
      'should provide the sap result',
      marbles((m) => {
        const expected = m.cold('a', {
          a: {
            data: [],
            lastRow: -1,
            totalRows: 300,
            subTotalRows: 100,
          },
        });

        m.expect(facade.sapResult$).toBeObservable(expected);
      })
    );
    afterAll(() => {
      store.resetSelectors();
    });
  });

  describe('resultCount$', () => {
    it(
      'should provide the result length',
      marbles((m) => {
        const expected = m.cold('a', {
          a: 1,
        });

        m.expect(facade.resultCount$).toBeObservable(expected);
      })
    );
  });

  describe('sapMaterialsRows$', () => {
    it(
      'should provide the result length',
      marbles((m) => {
        const expected = m.cold('a', {
          a: {
            lastRow: -1,
            totalRows: 300,
            subTotalRows: 100,
            startRow: 0,
          },
        });

        m.expect(facade.sapMaterialsRows$).toBeObservable(expected);
      })
    );
  });

  describe('hasEditorRole$', () => {
    it(
      'should return false',
      marbles((m) => {
        const expected = m.cold('a', {
          a: false,
        });

        m.expect(facade.hasEditorRole$).toBeObservable(expected);
      })
    );
  });

  describe('hasMatnrUploaderRole$', () => {
    it(
      'should return false',
      marbles((m) => {
        const expected = m.cold('a', {
          a: false,
        });

        m.expect(facade.hasMatnrUploaderRole$).toBeObservable(expected);
      })
    );
  });

  describe('navigation$', () => {
    it(
      'should return the navigation',
      marbles((m) => {
        const expected = m.cold('a', { a: mockNavigation });

        m.expect(facade.navigation$).toBeObservable(expected);
      })
    );
  });

  describe('materialClass$', () => {
    it(
      'should provide the materialClass',
      marbles((m) => {
        const expected = m.cold('a', {
          a: MaterialClass.STEEL,
        });

        m.expect(facade.materialClass$).toBeObservable(expected);
      })
    );
  });

  describe('agGridFilters$', () => {
    it(
      'should provide the agGridFilters',
      marbles((m) => {
        const expected = m.cold('a', {
          a: {},
        });

        m.expect(facade.agGridFilter$).toBeObservable(expected);
      })
    );
  });

  describe('agGridColumns$', () => {
    it(
      'should provide the agGridColumns',
      marbles((m) => {
        const expected = m.cold('a', {
          a: 'agGridColumns',
        });

        m.expect(facade.agGridColumns$).toBeObservable(expected);
      })
    );
  });

  describe('shareQueryParams$', () => {
    it(
      'should provide the agGridFilters',
      marbles((m) => {
        const expected = m.cold('a', {
          a: {
            materialClass: MaterialClass.STEEL,
            navigationLevel: NavigationLevel.MATERIAL,
            agGridFilter: '{}',
          },
        });

        m.expect(facade.shareQueryParams$).toBeObservable(expected);
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

        m.expect(facade.editMaterialInformation).toBeObservable(expected);
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

        m.expect(facade.editMaterial).toBeObservable(expected);
      })
    );
  });

  describe('selectedMaterialData$', () => {
    it(
      'should provide the selectedMaterialData$',
      marbles((m) => {
        const expected = m.cold('a', [{} as DataResult]);

        m.expect(facade.selectedMaterialData$).toBeObservable(expected);
      })
    );
  });

  describe('isBulkEditAllowed$', () => {
    it(
      'should provide the isBulkEditAllowed$',
      marbles((m) => {
        const expected = m.cold('a', { a: true });

        m.expect(facade.isBulkEditAllowed$).toBeObservable(expected);
      })
    );
  });

  describe('hasMinimizedDialog', () => {
    it(
      'should return a boolean indicating if a dialog is minimized',
      marbles((m) => {
        const expected = m.cold('a', {
          a: true,
        });

        m.expect(facade.hasMinimizedDialog$).toBeObservable(expected);
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

  describe('username$', () => {
    it(
      'should provide username',
      marbles((m) => {
        const username = 'tester';
        store.overrideSelector(getUsername, username);
        const expected = m.cold('a', {
          a: username,
        });

        m.expect(facade.username$).toBeObservable(expected);
      })
    );
  });

  describe('fetchClassOptions', () => {
    it('should dispatch fetchClassOptions action', () => {
      const action = DataActions.fetchClassOptions();
      facade.fetchClassOptions();
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });
  });

  describe('fetchResult', () => {
    it('should dispatch fetchResult action', () => {
      const action = DataActions.fetchResult();
      facade.fetchResult();
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });
  });

  describe('setAgGridFilter', () => {
    it('should dispatch setAgGridFilter action', () => {
      const filterModel = {};
      const action = DataActions.setAgGridFilter({ filterModel });
      facade.setAgGridFilter(filterModel);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });
  });

  describe('setAgGridColumns', () => {
    it('should dispatch setAgGridColumns action', () => {
      const agGridColumns = 'agGridColumns';
      const action = DataActions.setAgGridColumns({ agGridColumns });
      facade.setAgGridColumns(agGridColumns);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });
  });

  describe('deleteEntity', () => {
    it('should dispatch deleteEntity action', () => {
      const id = 1;
      const action = DataActions.deleteEntity({ id });
      facade.deleteEntity(id);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });
  });

  describe('fetchSAPMaterials', () => {
    it('should dispatch fetchSAPMaterials action', () => {
      const request = { startRow: 0, endRow: 100 } as SAPMaterialsRequest;
      const action = DataActions.fetchSAPMaterials({ request });
      facade.fetchSAPMaterials(request);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });
  });

  describe('openMultiEditDialog', () => {
    it('should dispatch openMultiEditDialog action', () => {
      const rows = [{} as DataResult];
      const combinedRows = {} as DataResult;
      const action = openMultiEditDialog({ rows, combinedRows });
      facade.openMultiEditDialog(rows, combinedRows);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });
  });

  describe('setNavigation', () => {
    it('should dispatch setNavigation action', () => {
      const materialClass = MaterialClass.STEEL;
      const navigationLevel = NavigationLevel.MATERIAL;
      const action = DataActions.setNavigation({
        materialClass,
        navigationLevel,
      });
      facade.setNavigation(materialClass, navigationLevel);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });
  });

  describe('errorSnackBar', () => {
    it('should dispatch errorSnackBar action', () => {
      const message = 'test';
      const action = DataActions.errorSnackBar({ message });
      facade.errorSnackBar(message);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });
  });
});
