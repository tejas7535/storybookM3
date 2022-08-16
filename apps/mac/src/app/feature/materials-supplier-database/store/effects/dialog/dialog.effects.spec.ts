import { throwError } from 'rxjs';

import { createServiceFactory, SpectatorService } from '@ngneat/spectator';
import { Actions } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { marbles } from 'rxjs-marbles';

import { StringOption } from '@schaeffler/inputs';

import {
  CreateMaterialRecord,
  CreateMaterialState,
  ManufacturerSupplier,
  Material,
  MaterialStandard,
} from '@mac/msd/models';
import { MsdDataService } from '@mac/msd/services';
import {
  addMaterialDialogConfirmed,
  addMaterialDialogOpened,
  createMaterialComplete,
  fetchCastingDiameters,
  fetchCastingDiametersFailure,
  fetchCastingDiametersSuccess,
  fetchCastingModes,
  fetchCastingModesFailure,
  fetchCastingModesSuccess,
  fetchCo2Classifications,
  fetchCo2ClassificationsFailure,
  fetchCo2ClassificationsSuccess,
  fetchManufacturerSuppliers,
  fetchManufacturerSuppliersFailure,
  fetchManufacturerSuppliersSuccess,
  fetchMaterialStandards,
  fetchMaterialStandardsFailure,
  fetchMaterialStandardsSuccess,
  fetchRatings,
  fetchRatingsFailure,
  fetchRatingsSuccess,
  fetchSteelMakingProcesses,
  fetchSteelMakingProcessesFailure,
  fetchSteelMakingProcessesSuccess,
  postManufacturerSupplier,
  postMaterial,
  postMaterialStandard,
} from '@mac/msd/store/actions';

import { DialogEffects } from './dialog.effects';

describe('Data Effects', () => {
  let action: any;
  let actions$: any;
  let effects: DialogEffects;
  let spectator: SpectatorService<DialogEffects>;
  let msdDataService: MsdDataService;

  const createService = createServiceFactory({
    service: DialogEffects,
    providers: [
      provideMockActions(() => actions$),
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
    effects = spectator.inject(DialogEffects);
    msdDataService = spectator.inject(MsdDataService);
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
      'should call post material standard',
      marbles((m) => {
        const mockMaterial = {} as Material;
        const mockStandard = {} as MaterialStandard;
        const mockSupplier = {} as ManufacturerSupplier;
        action = addMaterialDialogConfirmed({
          material: mockMaterial,
          standard: mockStandard,
          supplier: mockSupplier,
        });
        actions$ = m.hot('-a', { a: action });
        const expected = m.cold('-(b)', {
          b: postMaterialStandard({
            record: {
              material: mockMaterial,
              standard: mockStandard,
              supplier: mockSupplier,
              error: false,
              state: 0,
            } as CreateMaterialRecord,
          }),
        });

        m.expect(effects.addMaterialDialogConfirmed$).toBeObservable(expected);
        m.flush();
      })
    );
  });

  describe('postMaterialStandard$', () => {
    const recordMock = {
      standard: {
        id: 1,
        materialName: 'matName',
        standardDocument: 'S 123456',
      },
    } as CreateMaterialRecord;
    it(
      'should call skipp adding material standard',
      marbles((m) => {
        const record = recordMock;
        action = postMaterialStandard({ record });
        actions$ = m.hot('-a', { a: action });

        const expected = m.cold('-(b)', {
          b: postManufacturerSupplier({
            record: {
              ...record,
              state: CreateMaterialState.MaterialStandardSkipped,
            },
          }),
        });

        m.expect(effects.postMaterialStandard$).toBeObservable(expected);
        m.flush();
      })
    );

    it(
      'should call create a material standard',
      marbles((m) => {
        const record = {
          ...recordMock,
          standard: {
            ...recordMock.standard,
            id: undefined,
          },
        } as CreateMaterialRecord;
        action = postMaterialStandard({ record });
        actions$ = m.hot('-a', { a: action });

        const resultMock = { id: 42 };
        const response = m.cold('-a|', { a: resultMock });
        msdDataService.createMaterialStandard = jest.fn(() => response);

        const expected = m.cold('--(c)', {
          c: postManufacturerSupplier({
            record: {
              ...record,
              material: {
                ...record.material,
                materialStandardId: 42,
              },
              state: CreateMaterialState.MaterialStandardCreated,
            },
          }),
        });

        m.expect(effects.postMaterialStandard$).toBeObservable(expected);
        m.flush();
      })
    );

    it(
      'should call return failed state',
      marbles((m) => {
        const record = {
          ...recordMock,
          standard: {
            ...recordMock.standard,
            id: undefined,
          },
        } as CreateMaterialRecord;
        action = postMaterialStandard({ record });
        actions$ = m.hot('-a', { a: action });

        msdDataService.createMaterialStandard = jest
          .fn()
          .mockReturnValue(throwError(() => 'error'));

        const expected = m.cold('-b', {
          b: createMaterialComplete({
            record: {
              ...record,
              state: CreateMaterialState.MaterialStandardCreationFailed,
              error: true,
            },
          }),
        });

        m.expect(effects.postMaterialStandard$).toBeObservable(expected);
        m.flush();
      })
    );
  });

  describe('postManufacturerSupplier$', () => {
    const recordMock = {
      supplier: {
        id: 1,
        name: 'supName',
        plant: 'NUE',
      },
    } as CreateMaterialRecord;
    it(
      'should call skip adding supplier',
      marbles((m) => {
        const record = recordMock;
        action = postManufacturerSupplier({ record });
        actions$ = m.hot('-a', { a: action });

        const expected = m.cold('-(b)', {
          b: postMaterial({
            record: {
              ...record,
              state: CreateMaterialState.ManufacturerSupplierSkipped,
            },
          }),
        });

        m.expect(effects.postManufacturerSupplier$).toBeObservable(expected);
        m.flush();
      })
    );

    it(
      'should call create a manufacturer supplier',
      marbles((m) => {
        const record = {
          ...recordMock,
          supplier: {
            ...recordMock.supplier,
            id: undefined,
          },
        } as CreateMaterialRecord;
        action = postManufacturerSupplier({ record });
        actions$ = m.hot('-a', { a: action });

        const resultMock = { id: 42 };
        const response = m.cold('-a|', { a: resultMock });
        msdDataService.createManufacturerSupplier = jest.fn(() => response);

        const expected = m.cold('--(c)', {
          c: postMaterial({
            record: {
              ...record,
              material: {
                ...record.material,
                manufacturerSupplierId: 42,
              },
              state: CreateMaterialState.ManufacturerSupplierCreated,
            },
          }),
        });

        m.expect(effects.postManufacturerSupplier$).toBeObservable(expected);
        m.flush();
      })
    );

    it(
      'should call return failed state',
      marbles((m) => {
        const record = {
          ...recordMock,
          supplier: {
            ...recordMock.supplier,
            id: undefined,
          },
        } as CreateMaterialRecord;
        action = postManufacturerSupplier({ record });
        actions$ = m.hot('-a', { a: action });

        msdDataService.createManufacturerSupplier = jest
          .fn()
          .mockReturnValue(throwError(() => 'error'));

        const expected = m.cold('-b', {
          b: createMaterialComplete({
            record: {
              ...record,
              state: CreateMaterialState.ManufacturerSupplierCreationFailed,
              error: true,
            },
          }),
        });

        m.expect(effects.postManufacturerSupplier$).toBeObservable(expected);
        m.flush();
      })
    );
  });

  describe('postMaterial$', () => {
    const recordMock = {} as CreateMaterialRecord;
    it(
      'should create a material',
      marbles((m) => {
        const record = {
          ...recordMock,
        } as CreateMaterialRecord;
        action = postMaterial({ record });
        actions$ = m.hot('-a', { a: action });

        const resultMock = { id: 42 };
        const response = m.cold('-a|', { a: resultMock });
        msdDataService.createMaterial = jest.fn(() => response);

        const expected = m.cold('--(c)', {
          c: createMaterialComplete({
            record: {
              ...record,
              state: CreateMaterialState.MaterialCreated,
            },
          }),
        });

        m.expect(effects.postMaterial$).toBeObservable(expected);
        m.flush();
      })
    );

    it(
      'should call return failed state',
      marbles((m) => {
        const record = {
          ...recordMock,
          supplier: {
            ...recordMock.supplier,
            id: undefined,
          },
        } as CreateMaterialRecord;
        action = postMaterial({ record });
        actions$ = m.hot('-a', { a: action });

        msdDataService.createMaterial = jest
          .fn()
          .mockReturnValue(throwError(() => 'error'));

        const expected = m.cold('-b', {
          b: createMaterialComplete({
            record: {
              ...record,
              state: CreateMaterialState.MaterialCreationFailed,
              error: true,
            },
          }),
        });

        m.expect(effects.postMaterial$).toBeObservable(expected);
        m.flush();
      })
    );
  });

  describe('fetchCastingDiameters$', () => {
    it(
      'should return empty success action with empty supplierId',
      marbles((m) => {
        action = fetchCastingDiameters({
          supplierId: undefined,
          castingMode: 'ingot',
        });
        actions$ = m.hot('-a', { a: action });

        msdDataService.fetchCastingDiameters = jest.fn();

        const result = fetchCastingDiametersSuccess({
          castingDiameters: [],
        });
        const expected = m.cold('-b', { b: result });

        m.expect(effects.fetchCastingDiameters$).toBeObservable(expected);
        m.flush();

        expect(msdDataService.fetchCastingDiameters).not.toHaveBeenCalled();
      })
    );

    it(
      'should return empty success action with empty castingMode',
      marbles((m) => {
        action = fetchCastingDiameters({
          supplierId: 1,
          castingMode: undefined,
        });
        actions$ = m.hot('-a', { a: action });

        msdDataService.fetchCastingDiameters = jest.fn();

        const result = fetchCastingDiametersSuccess({
          castingDiameters: [],
        });
        const expected = m.cold('-b', { b: result });

        m.expect(effects.fetchCastingDiameters$).toBeObservable(expected);
        m.flush();

        expect(msdDataService.fetchCastingDiameters).not.toHaveBeenCalled();
      })
    );

    it(
      'should fetch castingDiameters and return success action on success',
      marbles((m) => {
        action = fetchCastingDiameters({ supplierId: 1, castingMode: 'ingot' });
        actions$ = m.hot('-a', { a: action });

        const resultMock: string[] = ['1', '2'];
        const response = m.cold('-a|', { a: resultMock });
        msdDataService.fetchCastingDiameters = jest.fn(() => response);

        const result = fetchCastingDiametersSuccess({
          castingDiameters: resultMock,
        });
        const expected = m.cold('--b', { b: result });

        m.expect(effects.fetchCastingDiameters$).toBeObservable(expected);
        m.flush();

        expect(msdDataService.fetchCastingDiameters).toHaveBeenCalledWith(
          1,
          'ingot'
        );
      })
    );

    it(
      'should fetch castingDiameters and return failure action on failure',
      marbles((m) => {
        action = fetchCastingDiameters({ supplierId: 1, castingMode: 'ingot' });
        actions$ = m.hot('-a', { a: action });

        msdDataService.fetchCastingDiameters = jest
          .fn()
          .mockReturnValue(throwError(() => 'error'));

        const result = fetchCastingDiametersFailure();
        const expected = m.cold('-b', { b: result });

        m.expect(effects.fetchCastingDiameters$).toBeObservable(expected);
        m.flush();

        expect(msdDataService.fetchCastingDiameters).toHaveBeenCalledWith(
          1,
          'ingot'
        );
      })
    );
  });
});
