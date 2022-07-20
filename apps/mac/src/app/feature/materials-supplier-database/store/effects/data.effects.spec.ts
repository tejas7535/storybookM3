import { throwError } from 'rxjs';

import { createServiceFactory, SpectatorService } from '@ngneat/spectator';
import { Actions } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { marbles } from 'rxjs-marbles';

import { StringOption } from '@schaeffler/inputs';

import { Material, MaterialStandard } from '../../models';
import { fetchMaterials, fetchMaterialsSuccess } from '../actions';
import { getFilters } from '../selectors';
import { DataResult } from './../../models/data/data-result.model';
import { ManufacturerSupplier } from './../../models/data/manufacturer-supplier.model';
import { MsdDataService } from './../../services/msd-data/msd-data.service';
import {
  addMaterialDialogConfirmed,
  addMaterialDialogOpened,
  createMaterialComplete,
  fetchCastingModes,
  fetchCastingModesFailure,
  fetchCastingModesSuccess,
  fetchCategoryOptions,
  fetchCategoryOptionsFailure,
  fetchCategoryOptionsSuccess,
  fetchClassAndCategoryOptions,
  fetchClassOptions,
  fetchClassOptionsFailure,
  fetchClassOptionsSuccess,
  fetchCo2Classifications,
  fetchCo2ClassificationsFailure,
  fetchCo2ClassificationsSuccess,
  fetchManufacturerSuppliers,
  fetchManufacturerSuppliersFailure,
  fetchManufacturerSuppliersSuccess,
  fetchMaterialsFailure,
  fetchMaterialStandards,
  fetchMaterialStandardsFailure,
  fetchMaterialStandardsSuccess,
  fetchRatings,
  fetchRatingsFailure,
  fetchRatingsSuccess,
  fetchSteelMakingProcesses,
  fetchSteelMakingProcessesFailure,
  fetchSteelMakingProcessesSuccess,
} from './../actions/data.actions';
import { DataEffects } from './data.effects';

describe('Data Effects', () => {
  let action: any;
  let actions$: any;
  let effects: DataEffects;
  let spectator: SpectatorService<DataEffects>;
  let msdDataService: MsdDataService;
  let store: MockStore;

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
    ],
  });

  beforeEach(() => {
    spectator = createService();
    actions$ = spectator.inject(Actions);
    effects = spectator.inject(DataEffects);
    store = spectator.inject(MockStore);
    msdDataService = spectator.inject(MsdDataService);
  });

  describe('fetchMaterials$', () => {
    it(
      'should fetch materials and return success action on success',
      marbles((m) => {
        const materialClass = { id: 'id', title: 'gibts net' };
        const productCategory = [{ id: 'id', title: 'gibts net' }];

        store.overrideSelector(getFilters, { materialClass, productCategory });

        action = fetchMaterials();
        actions$ = m.hot('-a', { a: action });

        const resultMock: DataResult[] = [
          {
            manufacturerSupplierName: 'some supplier',
          } as DataResult,
        ];
        const response = m.cold('-a|', { a: resultMock });
        msdDataService.getMaterials = jest.fn(() => response);

        const result = fetchMaterialsSuccess({ result: resultMock });
        const expected = m.cold('--b', { b: result });

        m.expect(effects.fetchMaterials$).toBeObservable(expected);
        m.flush();

        expect(msdDataService.getMaterials).toHaveBeenCalledWith(
          materialClass.id,
          productCategory.map((category: StringOption) => category?.id)
        );
      })
    );

    it(
      'should fetch materials and return failure action on failure',
      marbles((m) => {
        const materialClass = { id: 'id', title: 'gibts net' };
        const productCategory = [{ id: 'id', title: 'gibts net' }];

        store.overrideSelector(getFilters, { materialClass, productCategory });

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
          materialClass.id,
          productCategory.map((category: StringOption) => category?.id)
        );
      })
    );
  });

  describe('fetchClassAndCategoryOptions$', () => {
    it(
      'should dispatch the nested fetch actions',
      marbles((m) => {
        action = fetchClassAndCategoryOptions();
        actions$ = m.hot('-a', { a: action });

        const resultA = fetchClassOptions();
        const resultB = fetchCategoryOptions();

        const expected = m.cold('-(ab)', { a: resultA, b: resultB });

        m.expect(effects.fetchClassAndCategoryOptions$).toBeObservable(
          expected
        );
        m.flush();
      })
    );
  });

  describe('fetchClassOptions$', () => {
    it(
      'should fetch material classes and return success action on success',
      marbles((m) => {
        action = fetchClassOptions();
        actions$ = m.hot('-a', { a: action });

        const resultMock: StringOption[] = [{ id: 'id', title: 'gibts net' }];
        const response = m.cold('-a|', { a: resultMock });
        msdDataService.getMaterialClasses = jest.fn(() => response);

        const result = fetchClassOptionsSuccess({
          materialClassOptions: resultMock,
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

  describe('fetchCategoryOptions$', () => {
    it(
      'should fetch categories and return success action on success',
      marbles((m) => {
        action = fetchCategoryOptions();
        actions$ = m.hot('-a', { a: action });

        const resultMock: StringOption[] = [{ id: 'id', title: 'gibts net' }];
        const response = m.cold('-a|', { a: resultMock });
        msdDataService.getProductCategories = jest.fn(() => response);

        const result = fetchCategoryOptionsSuccess({
          productCategoryOptions: resultMock,
        });
        const expected = m.cold('--b', { b: result });

        m.expect(effects.fetchCategoryOptions$).toBeObservable(expected);
        m.flush();

        expect(msdDataService.getProductCategories).toHaveBeenCalled();
      })
    );

    it(
      'should fetch categories and return failure action on failure',
      marbles((m) => {
        action = fetchCategoryOptions();
        actions$ = m.hot('-a', { a: action });

        msdDataService.getProductCategories = jest
          .fn()
          .mockReturnValue(throwError(() => new Error('error')));

        const result = fetchCategoryOptionsFailure();
        const expected = m.cold('-b', { b: result });

        m.expect(effects.fetchCategoryOptions$).toBeObservable(expected);
        m.flush();

        expect(msdDataService.getProductCategories).toHaveBeenCalled();
      })
    );
  });

  describe('addMaterialDialogOpened$', () => {
    it(
      'should dispatch the fetch actions',
      marbles((m) => {
        action = addMaterialDialogOpened();
        actions$ = m.hot('-a', { a: action });

        const expected = m.cold('-(bcdefg)', {
          b: fetchMaterialStandards(),
          c: fetchCo2Classifications(),
          d: fetchManufacturerSuppliers(),
          e: fetchRatings(),
          f: fetchSteelMakingProcesses(),
          g: fetchCastingModes(),
        });

        m.expect(effects.addMaterialDialogOpened$).toBeObservable(expected);
        m.flush();
      })
    );
  });

  describe('fetchMaterialStandards$', () => {
    it(
      'should fetch material standards and return success action on success',
      marbles((m) => {
        action = fetchMaterialStandards();
        actions$ = m.hot('-a', { a: action });

        const resultMock: MaterialStandard[] = [{} as MaterialStandard];
        const response = m.cold('-a|', { a: resultMock });
        msdDataService.fetchMaterialStandards = jest.fn(() => response);

        const result = fetchMaterialStandardsSuccess({
          materialStandards: resultMock,
        });
        const expected = m.cold('--b', { b: result });

        m.expect(effects.fetchMaterialStandards$).toBeObservable(expected);
        m.flush();

        expect(msdDataService.fetchMaterialStandards).toHaveBeenCalled();
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

        expect(msdDataService.fetchMaterialStandards).toHaveBeenCalled();
      })
    );
  });

  describe('fetchManufacturerSuppliers$', () => {
    it(
      'should fetch manufacturer suppliers and return success action on success',
      marbles((m) => {
        action = fetchManufacturerSuppliers();
        actions$ = m.hot('-a', { a: action });

        const resultMock: ManufacturerSupplier[] = [{} as ManufacturerSupplier];
        const response = m.cold('-a|', { a: resultMock });
        msdDataService.fetchManufacturerSuppliers = jest.fn(() => response);

        const result = fetchManufacturerSuppliersSuccess({
          manufacturerSuppliers: resultMock,
        });
        const expected = m.cold('--b', { b: result });

        m.expect(effects.fetchManufacturerSuppliers$).toBeObservable(expected);
        m.flush();

        expect(msdDataService.fetchManufacturerSuppliers).toHaveBeenCalled();
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

        expect(msdDataService.fetchManufacturerSuppliers).toHaveBeenCalled();
      })
    );
  });

  describe('fetchCo2Classifications$', () => {
    it(
      'should fetch co2 classifications and return success action on success',
      marbles((m) => {
        action = fetchCo2Classifications();
        actions$ = m.hot('-a', { a: action });

        const resultMock: StringOption[] = [
          { id: 'c1', title: '1' },
          { id: 'c2', title: '2' },
        ];
        const response = m.cold('-a|', { a: resultMock });
        msdDataService.fetchCo2Classifications = jest.fn(() => response);

        const result = fetchCo2ClassificationsSuccess({
          co2Classifications: resultMock,
        });
        const expected = m.cold('--b', { b: result });

        m.expect(effects.fetchCo2Classifications$).toBeObservable(expected);
        m.flush();

        expect(msdDataService.fetchCo2Classifications).toHaveBeenCalled();
      })
    );

    it(
      'should fetch co2 classifications and return failure action on failure',
      marbles((m) => {
        action = fetchCo2Classifications();
        actions$ = m.hot('-a', { a: action });

        msdDataService.fetchCo2Classifications = jest
          .fn()
          .mockReturnValue(throwError(() => 'error'));

        const result = fetchCo2ClassificationsFailure();
        const expected = m.cold('-b', { b: result });

        m.expect(effects.fetchCo2Classifications$).toBeObservable(expected);
        m.flush();

        expect(msdDataService.fetchCo2Classifications).toHaveBeenCalled();
      })
    );
  });

  describe('fetchRatings$', () => {
    it(
      'should fetch ratings and return success action on success',
      marbles((m) => {
        action = fetchRatings();
        actions$ = m.hot('-a', { a: action });

        const resultMock: string[] = ['1', '2'];
        const response = m.cold('-a|', { a: resultMock });
        msdDataService.fetchRatings = jest.fn(() => response);

        const result = fetchRatingsSuccess({
          ratings: resultMock,
        });
        const expected = m.cold('--b', { b: result });

        m.expect(effects.fetchRatings$).toBeObservable(expected);
        m.flush();

        expect(msdDataService.fetchRatings).toHaveBeenCalled();
      })
    );

    it(
      'should fetch ratings and return failure action on failure',
      marbles((m) => {
        action = fetchRatings();
        actions$ = m.hot('-a', { a: action });

        msdDataService.fetchRatings = jest
          .fn()
          .mockReturnValue(throwError(() => 'error'));

        const result = fetchRatingsFailure();
        const expected = m.cold('-b', { b: result });

        m.expect(effects.fetchRatings$).toBeObservable(expected);
        m.flush();

        expect(msdDataService.fetchRatings).toHaveBeenCalled();
      })
    );
  });

  describe('fetchSteelMakingProcesses$', () => {
    it(
      'should fetch steel making processes and return success action on success',
      marbles((m) => {
        action = fetchSteelMakingProcesses();
        actions$ = m.hot('-a', { a: action });

        const resultMock: string[] = ['1', '2'];
        const response = m.cold('-a|', { a: resultMock });
        msdDataService.fetchSteelMakingProcesses = jest.fn(() => response);

        const result = fetchSteelMakingProcessesSuccess({
          steelMakingProcesses: resultMock,
        });
        const expected = m.cold('--b', { b: result });

        m.expect(effects.fetchSteelMakingProcesses$).toBeObservable(expected);
        m.flush();

        expect(msdDataService.fetchSteelMakingProcesses).toHaveBeenCalled();
      })
    );

    it(
      'should fetch steel making processes and return failure action on failure',
      marbles((m) => {
        action = fetchSteelMakingProcesses();
        actions$ = m.hot('-a', { a: action });

        msdDataService.fetchSteelMakingProcesses = jest
          .fn()
          .mockReturnValue(throwError(() => 'error'));

        const result = fetchSteelMakingProcessesFailure();
        const expected = m.cold('-b', { b: result });

        m.expect(effects.fetchSteelMakingProcesses$).toBeObservable(expected);
        m.flush();

        expect(msdDataService.fetchSteelMakingProcesses).toHaveBeenCalled();
      })
    );
  });

  describe('fetchCastingModes$', () => {
    it(
      'should fetch casting modes and return success action on success',
      marbles((m) => {
        action = fetchCastingModes();
        actions$ = m.hot('-a', { a: action });

        const resultMock: string[] = ['1', '2'];
        const response = m.cold('-a|', { a: resultMock });
        msdDataService.fetchCastingModes = jest.fn(() => response);

        const result = fetchCastingModesSuccess({
          castingModes: resultMock,
        });
        const expected = m.cold('--b', { b: result });

        m.expect(effects.fetchCastingModes$).toBeObservable(expected);
        m.flush();

        expect(msdDataService.fetchCastingModes).toHaveBeenCalled();
      })
    );

    it(
      'should fetch casting modes and return failure action on failure',
      marbles((m) => {
        action = fetchCastingModes();
        actions$ = m.hot('-a', { a: action });

        msdDataService.fetchCastingModes = jest
          .fn()
          .mockReturnValue(throwError(() => 'error'));

        const result = fetchCastingModesFailure();
        const expected = m.cold('-b', { b: result });

        m.expect(effects.fetchCastingModes$).toBeObservable(expected);
        m.flush();

        expect(msdDataService.fetchCastingModes).toHaveBeenCalled();
      })
    );
  });

  describe('addMaterialDialogConfirmed$', () => {
    it(
      'should create material and return success action on success',
      marbles((m) => {
        const mockMaterial = {} as Material;
        action = addMaterialDialogConfirmed({ material: mockMaterial });
        actions$ = m.hot('-a', { a: action });

        const response = m.cold('-a|');
        msdDataService.createMaterial = jest.fn(() => response);

        const result = createMaterialComplete({ success: true });
        const expected = m.cold('--b', { b: result });

        m.expect(effects.addMaterialDialogConfirmed$).toBeObservable(expected);
        m.flush();

        expect(msdDataService.createMaterial).toHaveBeenCalledWith(
          mockMaterial
        );
      })
    );

    it(
      'should create material and return failure action on failure',
      marbles((m) => {
        const mockMaterial = {} as Material;
        action = addMaterialDialogConfirmed({ material: mockMaterial });
        actions$ = m.hot('-a', { a: action });

        msdDataService.createMaterial = jest
          .fn()
          .mockReturnValue(throwError(() => 'error'));

        const result = createMaterialComplete({ success: false });
        const expected = m.cold('-b', { b: result });

        m.expect(effects.addMaterialDialogConfirmed$).toBeObservable(expected);
        m.flush();

        expect(msdDataService.createMaterial).toHaveBeenCalledWith(
          mockMaterial
        );
      })
    );
  });
});
