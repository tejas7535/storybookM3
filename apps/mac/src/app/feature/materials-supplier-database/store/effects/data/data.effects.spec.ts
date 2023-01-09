import { MatSnackBarModule } from '@angular/material/snack-bar';

import { of, throwError } from 'rxjs';

import { createServiceFactory, SpectatorService } from '@ngneat/spectator';
import { Actions } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { marbles } from 'rxjs-marbles';

import { MaterialClass, NavigationLevel } from '@mac/msd/constants';
import {
  ManufacturerSupplierTableValue,
  ManufacturerSupplierV2,
  MaterialStandardTableValue,
  MaterialStandardV2,
  MaterialV2,
} from '@mac/msd/models';
import { MsdDataService } from '@mac/msd/services';
import {
  deleteEntity,
  deleteEntityFailure,
  deleteEntitySuccess,
  deleteManufacturerSupplier,
  deleteMaterial,
  deleteMaterialStandard,
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
  fetchResult,
  openSnackBar,
  setNavigation,
} from '@mac/msd/store/actions/data';
import { DataFacade } from '@mac/msd/store/facades/data';
import { getNavigation } from '@mac/msd/store/selectors';

import { cleanMinimizeDialog } from '../../actions/dialog';
import { DataEffects } from './data.effects';

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
    imports: [MatSnackBarModule],
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
      [undefined, undefined],
    ])(
      'should dispatch the correct action for the navigationLevel',
      (navigationLevel, result) =>
        marbles((m) => {
          msdDataFacade.navigation$ = of({
            materialClass: MaterialClass.STEEL,
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

        const resultMock: MaterialV2[] = [
          {
            manufacturerSupplierName: 'some supplier',
          } as MaterialV2,
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

  describe('fetchManufacturerSuppliers$', () => {
    it(
      'should fetch manufacturer suppliers and return success action on success',
      marbles((m) => {
        action = fetchManufacturerSuppliers();
        actions$ = m.hot('-a', { a: action });

        const resultMock: ManufacturerSupplierV2[] = [
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
            sapData: [
              { sapSupplierId: 'blabla' },
              { sapSupplierId: 'superSAP' },
            ],
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
            sapSupplierIds: ['blabla', 'superSAP'],
            lastModified: 1,
          },
        ];
        const response = m.cold('-a|', { a: resultMock });
        msdDataService.fetchManufacturerSuppliers = jest.fn(() => response);

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

        const resultMock: MaterialStandardV2[] = [
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
          c: openSnackBar({
            msgKey:
              'materialsSupplierDatabase.mainTable.confirmDialog.successDeleteEntity',
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
          b: openSnackBar({
            msgKey:
              'materialsSupplierDatabase.mainTable.confirmDialog.failureDeleteEntity',
          }),
        });

        m.expect(effects.deleteEntityFailure$).toBeObservable(expected);
        m.flush();
      })
    );
  });

  describe('openSnackBar$', () => {
    it(
      'should dispatch the correct actions',
      marbles((m) => {
        effects['matSnackBar'].open = jest.fn();
        action = openSnackBar({ msgKey: 'test' });
        actions$ = m.hot('-a', { a: action });

        const expected = m.cold('-a-', { a: action });

        m.expect(effects.openSnackBar$).toBeObservable(expected);
        m.flush();
        expect(effects['matSnackBar'].open).toHaveBeenCalledWith('test');
      })
    );
  });
});
