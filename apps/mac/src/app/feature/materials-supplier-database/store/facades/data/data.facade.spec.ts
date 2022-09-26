import { SpectatorService } from '@ngneat/spectator';
import { createServiceFactory } from '@ngneat/spectator/jest';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { marbles } from 'rxjs-marbles/jest';

import { DataResult, MaterialFormValue } from '@mac/msd/models';
import { initialState } from '@mac/msd/store/reducers/data/data.reducer';

import { DataFacade } from '.';

describe('DataFacade', () => {
  let spectator: SpectatorService<DataFacade>;
  let facade: DataFacade;
  let store: MockStore;

  const mockMaterialClassOptions = [{ id: 'st', title: 'Steel' }];
  const mockProductCategoryOptions = [{ id: 'tube', title: 'Tube' }];
  const mockResult: DataResult[] = [
    {
      id: 6956,
      materialClass: 'st',
      materialClassText: 'Steel',
      materialStandardId: 61,
      materialStandardMaterialName: 'SAE1008mod.',
      materialNumbers: [],
      materialStandardStandardDocument: '08120003E',
      manufacturerSupplierId: 212,
      manufacturerSupplierName: 'ABS',
      manufacturerSupplierPlant: 'Udine',
      manufacturerSupplierSelfCertified: false,
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
    },
  ];
  const mockFilters = {
    materialClass: { id: 'st', title: 'Steel' },
    agGridFilter: '{}',
    loading: false,
  };

  const createService = createServiceFactory({
    service: DataFacade,
    providers: [
      provideMockStore({
        initialState: {
          msd: {
            data: {
              ...initialState,
              materialClassOptions: mockMaterialClassOptions,
              productCategoryOptions: mockProductCategoryOptions,
              result: mockResult,
              materialClassLoading: false,
              productCategoryLoading: false,
              filter: mockFilters,
              agGridColumns: 'agGridColumns',
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

  describe('productCategoryOptions$', () => {
    it(
      'should provide product category options',
      marbles((m) => {
        const expected = m.cold('a', {
          a: mockProductCategoryOptions,
        });

        m.expect(facade.productCategoryOptions$).toBeObservable(expected);
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

  describe('filters$', () => {
    it(
      'should provide the filters',
      marbles((m) => {
        const expected = m.cold('a', {
          a: {
            materialClass: { id: 'st', title: 'Steel' },
            productCategory: undefined,
          },
        });

        m.expect(facade.filters$).toBeObservable(expected);
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
            filterForm: JSON.stringify({
              materialClass: { id: 'st', title: 'Steel' },
              productCategory: 'all',
            }),
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
