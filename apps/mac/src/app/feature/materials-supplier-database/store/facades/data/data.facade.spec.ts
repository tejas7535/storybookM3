import { SpectatorService } from '@ngneat/spectator';
import { createServiceFactory } from '@ngneat/spectator/jest';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { marbles } from 'rxjs-marbles/jest';

import { MaterialClass, NavigationLevel } from '@mac/msd/constants';
import { DataResult, MaterialFormValue, SteelMaterial } from '@mac/msd/models';
import { initialState } from '@mac/msd/store/reducers/data/data.reducer';

import { DataFacade } from '.';

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
      sapSupplierIds: [],
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
      recyclingRate: 42,
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
              result: {
                st: {
                  materials: mockResult,
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
  });

  it('should create', () => {
    expect(facade).toBeDefined();
  });

  describe('materialClassOptions$', () => {
    it(
      'should provide material class options',
      marbles((m) => {
        const expected = m.cold('a', {
          a: mockMaterialClassOptions,
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

  describe('dispatch', () => {
    it('should dispatch each action', () => {
      store.dispatch = jest.fn();
      facade.dispatch({ type: 'mock action' });

      expect(store.dispatch).toHaveBeenCalledWith({ type: 'mock action' });
    });
  });
});
