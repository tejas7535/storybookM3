import { HttpErrorResponse } from '@angular/common/http';

import { of, throwError } from 'rxjs';

import { TranslocoModule } from '@jsverse/transloco';
import {
  createServiceFactory,
  mockProvider,
  SpectatorService,
} from '@ngneat/spectator/jest';
import { Actions } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { marbles } from 'rxjs-marbles';

import { ApplicationInsightsService } from '@schaeffler/application-insights';

import { MaterialClass, NavigationLevel } from '@mac/msd/constants';
import {
  ManufacturerSupplier,
  ManufacturerSupplierTableValue,
  Material,
  MaterialStandard,
  MaterialStandardTableValue,
  ProductCategoryRule,
  ProductCategoryRuleTableValue,
  SAPMaterialsRequest,
  SAPMaterialsResponse,
} from '@mac/msd/models';
import { MsdDataService } from '@mac/msd/services';
import {
  deleteEntity,
  deleteEntityFailure,
  deleteEntitySuccess,
  deleteManufacturerSupplier,
  deleteMaterial,
  deleteMaterialStandard,
  errorSnackBar,
  fetchClassOptions,
  fetchClassOptionsFailure,
  fetchClassOptionsSuccess,
  fetchManufacturerSuppliers,
  fetchManufacturerSuppliersFailure,
  fetchManufacturerSuppliersSuccess,
  fetchMaterials,
  fetchMaterialsFailure,
  fetchMaterialsSuccess,
  fetchMaterialStandards,
  fetchMaterialStandardsFailure,
  fetchMaterialStandardsSuccess,
  fetchProductCategoryRules,
  fetchProductCategoryRulesFailure,
  fetchProductCategoryRulesSuccess,
  fetchResult,
  fetchSAPMaterials,
  fetchSAPMaterialsFailure,
  fetchSAPMaterialsSuccess,
  infoSnackBar,
  setAgGridFilter,
  setAgGridFilterForNavigation,
  setNavigation,
} from '@mac/msd/store/actions/data';
import { DataFacade } from '@mac/msd/store/facades/data';
import { getNavigation } from '@mac/msd/store/selectors';

import { cleanMinimizeDialog } from '../../actions/dialog';
import { DataEffects } from './data.effects';

jest.mock('@jsverse/transloco', () => ({
  ...jest.requireActual<TranslocoModule>('@jsverse/transloco'),
  translate: jest.fn((string) => string.split('.').pop()),
}));

describe('Data Effects', () => {
  let action: any;
  let actions$: any;
  let effects: DataEffects;
  let spectator: SpectatorService<DataEffects>;
  let msdDataService: MsdDataService;
  let store: MockStore;
  let msdDataFacade: DataFacade;

  const createService = createServiceFactory({
    service: DataEffects,
    providers: [
      provideMockActions(() => actions$),
      provideMockStore({}),
      {
        provide: MsdDataService,
        useValue: {
          getMaterials: () => {},
        },
      },
      {
        provide: DataFacade,
        useValue: {
          materialClass$: of(MaterialClass.STEEL),
          filters$: of({
            materialClass: { id: 'st', title: 'Steel' },
          }),
        },
      },
      mockProvider(ApplicationInsightsService),
    ],
  });

  beforeEach(() => {
    spectator = createService();
    actions$ = spectator.inject(Actions);
    effects = spectator.inject(DataEffects);
    store = spectator.inject(MockStore);
    msdDataService = spectator.inject(MsdDataService);
    msdDataFacade = spectator.inject(DataFacade);
    msdDataFacade.navigation$ = of({
      materialClass: MaterialClass.STEEL,
      navigationLevel: NavigationLevel.MATERIAL,
    });
  });

  describe('fetchResult$', () => {
    it.each([
      [NavigationLevel.MATERIAL, fetchMaterials],
      [NavigationLevel.SUPPLIER, fetchManufacturerSuppliers],
      [NavigationLevel.STANDARD, fetchMaterialStandards],
      [NavigationLevel.MATERIAL, undefined, MaterialClass.SAP_MATERIAL],
      [undefined, undefined],
      [NavigationLevel.PRODUCT_CATEGORY_RULES, fetchProductCategoryRules],
    ])(
      'should dispatch the correct action for the navigationLevel',
      (
        navigationLevel,
        result,
        materialClass: MaterialClass = MaterialClass.STEEL
      ) =>
        marbles((m) => {
          msdDataFacade.navigation$ = of({
            materialClass,
            navigationLevel,
          });

          action = fetchResult();
          actions$ = m.hot('-a', { a: action });

          const expected =
            result === undefined
              ? m.cold('---')
              : m.cold('-b', { b: result() });

          m.expect(effects.fetchResult$).toBeObservable(expected);
          m.flush();
        })()
    );
  });

  describe('fetchMaterials$', () => {
    it(
      'should fetch materials and return success action on success',
      marbles((m) => {
        action = fetchMaterials();
        actions$ = m.hot('-a', { a: action });

        const resultMock: Material[] = [
          {
            manufacturerSupplierName: 'some supplier',
          } as Material,
        ];
        const response = m.cold('-a|', { a: resultMock });
        msdDataService.getMaterials = jest.fn(() => response);

        const result = fetchMaterialsSuccess({
          materialClass: MaterialClass.STEEL,
          result: resultMock,
        });
        const expected = m.cold('--b', { b: result });

        m.expect(effects.fetchMaterials$).toBeObservable(expected);
        m.flush();

        expect(msdDataService.getMaterials).toHaveBeenCalledWith(
          MaterialClass.STEEL
        );
      })
    );

    it(
      'should fetch materials and return failure action on failure',
      marbles((m) => {
        const materialClass = MaterialClass.STEEL;

        store.overrideSelector(getNavigation, {
          materialClass,
          navigationLevel: NavigationLevel.MATERIAL,
        });

        action = fetchMaterials();
        actions$ = m.hot('-a', { a: action });

        msdDataService.getMaterials = jest
          .fn()
          .mockReturnValue(throwError(() => new Error('error')));

        const result = fetchMaterialsFailure();
        const expected = m.cold('-b', { b: result });

        m.expect(effects.fetchMaterials$).toBeObservable(expected);
        m.flush();

        expect(msdDataService.getMaterials).toHaveBeenCalledWith(
          MaterialClass.STEEL
        );
      })
    );
    it(
      'should fetch sap materials and return success action on success',
      marbles((m) => {
        msdDataFacade.navigation$ = of({
          materialClass: MaterialClass.SAP_MATERIAL,
          navigationLevel: NavigationLevel.MATERIAL,
        });

        action = fetchSAPMaterials({
          request: { startRow: 0 } as SAPMaterialsRequest,
        });
        actions$ = m.hot('-a', { a: action });

        const resultMock: SAPMaterialsResponse = {
          data: [],
          lastRow: -1,
          totalRows: 300,
          subTotalRows: 100,
        };
        const response = m.cold('-a|', { a: resultMock });
        msdDataService.fetchSAPMaterials = jest.fn(() => response);

        const result = fetchSAPMaterialsSuccess({ ...resultMock, startRow: 0 });
        const expected = m.cold('--b', { b: result });

        m.expect(effects.fetchMaterials$).toBeObservable(expected);
        m.flush();

        expect(msdDataService.fetchSAPMaterials).toHaveBeenCalledWith({
          startRow: 0,
        } as SAPMaterialsRequest);
      })
    );

    it(
      'should fetch sap materials and return failure action on failure',
      marbles((m) => {
        msdDataFacade.navigation$ = of({
          materialClass: MaterialClass.SAP_MATERIAL,
          navigationLevel: NavigationLevel.MATERIAL,
        });

        action = fetchSAPMaterials({
          request: { startRow: 0, retryCount: 2 } as SAPMaterialsRequest,
        });
        actions$ = m.hot('-a', { a: action });

        msdDataService.fetchSAPMaterials = jest
          .fn()
          .mockReturnValue(
            throwError(() => new HttpErrorResponse({ status: 404 }))
          );

        const result = fetchSAPMaterialsFailure({
          startRow: 0,
          errorCode: 404,
          retryCount: 2,
        });
        const expected = m.cold('-b', { b: result });

        m.expect(effects.fetchMaterials$).toBeObservable(expected);
        m.flush();

        expect(msdDataService.fetchSAPMaterials).toHaveBeenCalledWith({
          startRow: 0,
          retryCount: 2,
        } as SAPMaterialsRequest);
      })
    );
  });

  describe('logFetchMaterials$', () => {
    it(
      'should log filters and sorting',
      marbles((m) => {
        const request: SAPMaterialsRequest = {
          startRow: 0,
          endRow: 1,
          filterModel: {
            f1: { filterType: 'number', filter: 1, type: 'equals' },
            f2: { filterType: 'number', filter: 1, type: 'equals' },
          },
          sortModel: [
            { colId: 's1', sort: 'asc' },
            { colId: 's2', sort: 'asc' },
          ],
        };

        action = fetchSAPMaterials({ request });
        actions$ = m.hot('-a', { a: action });

        const expected = m.cold('-a-', { a: action });

        m.expect(effects.logFetchMaterials$).toBeObservable(expected);
        m.flush();
        expect(
          effects['applicationInsightsService'].logEvent
        ).toHaveBeenCalledWith(expect.any(String), {
          materialClass: MaterialClass.SAP_MATERIAL,
          sort: ['s1', 's2'],
          filter: ['f1', 'f2'],
        });
      })
    );
  });

  describe('fetchClassOptions$', () => {
    it(
      'should fetch material classes and return success action on success',
      marbles((m) => {
        action = fetchClassOptions();
        actions$ = m.hot('-a', { a: action });

        const resultMock = [MaterialClass.STEEL];
        const response = m.cold('-a|', { a: resultMock });
        msdDataService.getMaterialClasses = jest.fn(() => response);

        const result = fetchClassOptionsSuccess({
          materialClasses: resultMock,
        });
        const expected = m.cold('--b', { b: result });

        m.expect(effects.fetchClassOptions$).toBeObservable(expected);
        m.flush();

        expect(msdDataService.getMaterialClasses).toHaveBeenCalled();
      })
    );

    it(
      'should fetch material classes and return failure action on failure',
      marbles((m) => {
        action = fetchClassOptions();
        actions$ = m.hot('-a', { a: action });

        msdDataService.getMaterialClasses = jest
          .fn()
          .mockReturnValue(throwError(() => new Error('error')));

        const result = fetchClassOptionsFailure();
        const expected = m.cold('-b', { b: result });

        m.expect(effects.fetchClassOptions$).toBeObservable(expected);
        m.flush();

        expect(msdDataService.getMaterialClasses).toHaveBeenCalled();
      })
    );
  });

  describe('setNavigation$', () => {
    it(
      'should return the fetchResult action',
      marbles((m) => {
        action = setNavigation({
          materialClass: MaterialClass.STEEL,
          navigationLevel: NavigationLevel.MATERIAL,
        });
        actions$ = m.hot('-a', { a: action });

        const result = fetchResult();
        const result2 = cleanMinimizeDialog();
        const expected = m.cold('-(bc)', { b: result, c: result2 });

        m.expect(effects.setNavigation$).toBeObservable(expected);
        m.flush();
      })
    );
  });

  describe('setAgGridFilter$', () => {
    it(
      'should return the set filter for navigation level action',
      marbles((m) => {
        action = setAgGridFilter({
          filterModel: {},
        });
        actions$ = m.hot('-a', { a: action });

        const result = setAgGridFilterForNavigation({
          filterModel: {},
          materialClass: MaterialClass.STEEL,
          navigationLevel: NavigationLevel.MATERIAL,
        });
        const expected = m.cold('-b', { b: result });

        m.expect(effects.setAgGridFilter$).toBeObservable(expected);
        m.flush();
      })
    );
  });

  describe('fetchManufacturerSuppliers$', () => {
    it(
      'should fetch manufacturer suppliers and return success action on success',
      marbles((m) => {
        action = fetchManufacturerSuppliers();
        actions$ = m.hot('-a', { a: action });

        const resultMock: ManufacturerSupplier[] = [
          {
            id: 1,
            name: 'supplier',
            plant: 'plant',
            country: 'country',
            timestamp: 0,
          },
          {
            id: 2,
            name: 'supplier2',
            plant: 'plant2',
            country: 'country2',
            manufacturer: true,
            sapSupplierIds: ['blabla', 'superSAP'],
            businessPartnerIds: [1, 2],
            timestamp: 1,
          },
        ];

        const expectedSuppliers: ManufacturerSupplierTableValue[] = [
          {
            id: 1,
            manufacturerSupplierName: 'supplier',
            manufacturerSupplierPlant: 'plant',
            manufacturerSupplierCountry: 'country',
            lastModified: 0,
          },
          {
            id: 2,
            manufacturerSupplierName: 'supplier2',
            manufacturerSupplierPlant: 'plant2',
            manufacturerSupplierCountry: 'country2',
            manufacturer: true,
            manufacturerSupplierSapSupplierIds: ['blabla', 'superSAP'],
            lastModified: 1,
          },
        ];
        const response = m.cold('-a|', { a: resultMock });
        msdDataService.fetchManufacturerSuppliers = jest.fn(() => response);
        msdDataService.mapSuppliersToTableView = jest.fn(
          () => expectedSuppliers
        );

        const result = fetchManufacturerSuppliersSuccess({
          materialClass: MaterialClass.STEEL,
          manufacturerSuppliers: expectedSuppliers,
        });

        let received;
        effects.fetchManufacturerSuppliers$.subscribe((r) => (received = r));

        m.flush();

        expect(received).toEqual(result);
        expect(msdDataService.fetchManufacturerSuppliers).toHaveBeenCalledWith(
          MaterialClass.STEEL
        );
      })
    );

    it(
      'should fetch manufacturer suppliers and return failure action on failure',
      marbles((m) => {
        action = fetchManufacturerSuppliers();
        actions$ = m.hot('-a', { a: action });

        msdDataService.fetchManufacturerSuppliers = jest
          .fn()
          .mockReturnValue(throwError(() => 'error'));

        const result = fetchManufacturerSuppliersFailure();
        const expected = m.cold('-b', { b: result });

        m.expect(effects.fetchManufacturerSuppliers$).toBeObservable(expected);
        m.flush();

        expect(msdDataService.fetchManufacturerSuppliers).toHaveBeenCalledWith(
          MaterialClass.STEEL
        );
      })
    );
  });

  describe('fetchMaterialStandards$', () => {
    it(
      'should fetch material standards and return success action on success',
      marbles((m) => {
        action = fetchMaterialStandards();
        actions$ = m.hot('-a', { a: action });

        const resultMock: MaterialStandard[] = [
          {
            id: 1,
            materialName: 'name',
            standardDocument: 'standard',
            timestamp: 0,
          },
          {
            id: 2,
            materialName: 'name2',
            standardDocument: 'standard2',
            timestamp: 1,
          },
        ];

        const expectedSuppliers: MaterialStandardTableValue[] = [
          {
            id: 1,
            materialStandardMaterialName: 'name',
            materialStandardStandardDocument: 'standard',
            lastModified: 0,
          },
          {
            id: 2,
            materialStandardMaterialName: 'name2',
            materialStandardStandardDocument: 'standard2',
            lastModified: 1,
          },
        ];
        const response = m.cold('-a|', { a: resultMock });
        msdDataService.fetchMaterialStandards = jest.fn(() => response);
        msdDataService.mapStandardsToTableView = jest.fn(
          () => expectedSuppliers
        );

        const result = fetchMaterialStandardsSuccess({
          materialClass: MaterialClass.STEEL,
          materialStandards: expectedSuppliers,
        });

        let received;
        effects.fetchMaterialStandards$.subscribe((r) => (received = r));

        m.flush();

        expect(received).toEqual(result);
        expect(msdDataService.fetchMaterialStandards).toHaveBeenCalledWith(
          MaterialClass.STEEL
        );
      })
    );

    it(
      'should fetch material standards and return failure action on failure',
      marbles((m) => {
        action = fetchMaterialStandards();
        actions$ = m.hot('-a', { a: action });

        msdDataService.fetchMaterialStandards = jest
          .fn()
          .mockReturnValue(throwError(() => 'error'));

        const result = fetchMaterialStandardsFailure();
        const expected = m.cold('-b', { b: result });

        m.expect(effects.fetchMaterialStandards$).toBeObservable(expected);
        m.flush();

        expect(msdDataService.fetchMaterialStandards).toHaveBeenCalledWith(
          MaterialClass.STEEL
        );
      })
    );
  });

  describe('fetchProductCategoryRules$', () => {
    it(
      'should fetch product category rules and return success action on success',
      marbles((m) => {
        action = fetchProductCategoryRules();
        actions$ = m.hot('-a', { a: action });

        const resultMock: ProductCategoryRule[] = [
          {
            id: 1,
            timestamp: 0,
            title: 'test',
            allocationToSideProducts: false,
            materialClass: MaterialClass.STEEL,
            modifiedBy: 'dev',
            uploadFile: {
              azureReference: 'ref',
              filename: 'test',
              id: 1,
              type: 'pcr',
            },
            validUntil: 0,
            version: '1',
          },
          {
            id: 2,
            timestamp: 0,
            title: 'test2',
            allocationToSideProducts: false,
            materialClass: MaterialClass.STEEL,
            modifiedBy: 'dev',
            uploadFile: {
              azureReference: 'ref',
              filename: 'test2',
              id: 2,
              type: 'pcr',
            },
            validUntil: 0,
            version: '1',
          },
        ];

        const expectedProductCategoryRules: ProductCategoryRuleTableValue[] = [
          {
            id: 1,
            lastModified: 0,
            title: 'test',
            allocationToSideProducts: false,
            materialClass: MaterialClass.STEEL,
            modifiedBy: 'dev',
            filename: 'test',
            uploadFileId: 1,
            validUntil: 0,
            version: '1',
          },
          {
            id: 2,
            lastModified: 0,
            title: 'test2',
            allocationToSideProducts: false,
            materialClass: MaterialClass.STEEL,
            modifiedBy: 'dev',
            filename: 'test2',
            uploadFileId: 2,
            validUntil: 0,
            version: '1',
          },
        ];
        const response = m.cold('-a|', { a: resultMock });
        msdDataService.fetchProductCategoryRules = jest.fn(() => response);
        msdDataService.mapProductCategoryRulesToTableView = jest.fn(
          () => expectedProductCategoryRules
        );

        const result = fetchProductCategoryRulesSuccess({
          materialClass: MaterialClass.STEEL,
          productCategoryRules: expectedProductCategoryRules,
        });

        let received;
        effects.fetchProductCategoryRules$.subscribe((r) => (received = r));

        m.flush();

        expect(received).toEqual(result);
        expect(msdDataService.fetchProductCategoryRules).toHaveBeenCalledWith(
          MaterialClass.STEEL
        );
      })
    );

    it(
      'should fetch product category rules and return failure action on failure',
      marbles((m) => {
        action = fetchProductCategoryRules();
        actions$ = m.hot('-a', { a: action });

        msdDataService.fetchProductCategoryRules = jest
          .fn()
          .mockReturnValue(throwError(() => 'error'));

        const result = fetchProductCategoryRulesFailure();
        const expected = m.cold('-b', { b: result });

        m.expect(effects.fetchProductCategoryRules$).toBeObservable(expected);
        m.flush();

        expect(msdDataService.fetchProductCategoryRules).toHaveBeenCalledWith(
          MaterialClass.STEEL
        );
      })
    );
  });

  describe('deleteEntity$', () => {
    it.each([
      [NavigationLevel.MATERIAL, deleteMaterial],
      [NavigationLevel.SUPPLIER, deleteManufacturerSupplier],
      [NavigationLevel.STANDARD, deleteMaterialStandard],
      [undefined, undefined],
    ])(
      'should dispatch the correct action for the navigationLevel',
      (navigationLevel, result) =>
        marbles((m) => {
          msdDataFacade.navigation$ = of({
            materialClass: MaterialClass.STEEL,
            navigationLevel,
          });

          action = deleteEntity({ id: 3 });
          actions$ = m.hot('-a', { a: action });

          const expected =
            result === undefined
              ? m.cold('---')
              : m.cold('-b', {
                  b: result({ id: 3, materialClass: MaterialClass.STEEL }),
                });

          m.expect(effects.deleteEntity$).toBeObservable(expected);
          m.flush();
        })()
    );
  });

  describe('deleteMaterial$', () => {
    it(
      'should delete material return success action on success',
      marbles((m) => {
        action = deleteMaterial({ id: 3, materialClass: MaterialClass.STEEL });
        actions$ = m.hot('-a', { a: action });

        const response = m.cold('-a|', { a: undefined });
        msdDataService.deleteMaterial = jest.fn(() => response);
        const expected = m.cold('--b', { b: deleteEntitySuccess() });

        m.expect(effects.deleteMaterial$).toBeObservable(expected);
        m.flush();
        expect(msdDataService.deleteMaterial).toHaveBeenCalledWith(
          3,
          MaterialClass.STEEL
        );
      })
    );

    it(
      'should try to delete material and return failure action on failure',
      marbles((m) => {
        action = deleteMaterial({ id: 3, materialClass: MaterialClass.STEEL });
        actions$ = m.hot('-a', { a: action });

        msdDataService.deleteMaterial = jest
          .fn()
          .mockReturnValue(throwError(() => 'error'));
        const expected = m.cold('-b', { b: deleteEntityFailure() });

        m.expect(effects.deleteMaterial$).toBeObservable(expected);
        m.flush();
        expect(msdDataService.deleteMaterial).toHaveBeenCalledWith(
          3,
          MaterialClass.STEEL
        );
      })
    );
  });

  describe('deleteMaterialStandard$', () => {
    it(
      'should delete material standard return success action on success',
      marbles((m) => {
        action = deleteMaterialStandard({
          id: 3,
          materialClass: MaterialClass.STEEL,
        });
        actions$ = m.hot('-a', { a: action });

        const response = m.cold('-a|', { a: undefined });
        msdDataService.deleteMaterialStandard = jest.fn(() => response);
        const expected = m.cold('--b', { b: deleteEntitySuccess() });

        m.expect(effects.deleteMaterialStandard$).toBeObservable(expected);
        m.flush();
        expect(msdDataService.deleteMaterialStandard).toHaveBeenCalledWith(
          3,
          MaterialClass.STEEL
        );
      })
    );

    it(
      'should try to delete material standard and return failure action on failure',
      marbles((m) => {
        action = deleteMaterialStandard({
          id: 3,
          materialClass: MaterialClass.STEEL,
        });
        actions$ = m.hot('-a', { a: action });

        msdDataService.deleteMaterialStandard = jest
          .fn()
          .mockReturnValue(throwError(() => 'error'));
        const expected = m.cold('-b', { b: deleteEntityFailure() });

        m.expect(effects.deleteMaterialStandard$).toBeObservable(expected);
        m.flush();
        expect(msdDataService.deleteMaterialStandard).toHaveBeenCalledWith(
          3,
          MaterialClass.STEEL
        );
      })
    );
  });

  describe('deleteManufacturerSupplier$', () => {
    it(
      'should delete supplier return success action on success',
      marbles((m) => {
        action = deleteManufacturerSupplier({
          id: 3,
          materialClass: MaterialClass.STEEL,
        });
        actions$ = m.hot('-a', { a: action });

        const response = m.cold('-a|', { a: undefined });
        msdDataService.deleteManufacturerSupplier = jest.fn(() => response);
        const expected = m.cold('--b', { b: deleteEntitySuccess() });

        m.expect(effects.deleteManufacturerSupplier$).toBeObservable(expected);
        m.flush();
        expect(msdDataService.deleteManufacturerSupplier).toHaveBeenCalledWith(
          3,
          MaterialClass.STEEL
        );
      })
    );

    it(
      'should try to delete supplier and return failure action on failure',
      marbles((m) => {
        action = deleteManufacturerSupplier({
          id: 3,
          materialClass: MaterialClass.STEEL,
        });
        actions$ = m.hot('-a', { a: action });

        msdDataService.deleteManufacturerSupplier = jest
          .fn()
          .mockReturnValue(throwError(() => 'error'));
        const expected = m.cold('-b', { b: deleteEntityFailure() });

        m.expect(effects.deleteManufacturerSupplier$).toBeObservable(expected);
        m.flush();
        expect(msdDataService.deleteManufacturerSupplier).toHaveBeenCalledWith(
          3,
          MaterialClass.STEEL
        );
      })
    );
  });

  describe('deleteEntitySuccess$', () => {
    it(
      'should dispatch the correct actions',
      marbles((m) => {
        action = deleteEntitySuccess();
        actions$ = m.hot('-a', { a: action });

        const expected = m.cold('-(bc)', {
          b: fetchResult(),
          c: infoSnackBar({
            message: 'successDeleteEntity',
          }),
        });

        m.expect(effects.deleteEntitySuccess$).toBeObservable(expected);
        m.flush();
      })
    );
  });

  describe('deleteEntityFailure$', () => {
    it(
      'should dispatch the correct actions',
      marbles((m) => {
        action = deleteEntityFailure();
        actions$ = m.hot('-a', { a: action });

        const expected = m.cold('-b-', {
          b: infoSnackBar({
            message: 'failureDeleteEntity',
          }),
        });

        m.expect(effects.deleteEntityFailure$).toBeObservable(expected);
        m.flush();
      })
    );
  });

  describe('infoSnackBar$', () => {
    it(
      'should dispatch the correct actions',
      marbles((m) => {
        effects['matSnackBar'].infoTranslated = jest.fn();
        action = infoSnackBar({ message: 'test' });
        actions$ = m.hot('-a', { a: action });

        const expected = m.cold('-a-', { a: action });

        m.expect(effects.infoSnackBar$).toBeObservable(expected);
        m.flush();
        expect(effects['matSnackBar'].infoTranslated).toHaveBeenCalledWith(
          'test'
        );
      })
    );
  });

  describe('errorSnackBar$', () => {
    it(
      'should dispatch the correct actions',
      marbles((m) => {
        effects['matSnackBar'].errorTranslated = jest.fn();
        action = errorSnackBar({ message: 'test' });
        actions$ = m.hot('-a', { a: action });

        const expected = m.cold('-a-', { a: action });

        m.expect(effects.errorSnackBar$).toBeObservable(expected);
        m.flush();
        expect(effects['matSnackBar'].errorTranslated).toHaveBeenCalledWith(
          'test',
          undefined,
          undefined
        );
      })
    );
  });
});
