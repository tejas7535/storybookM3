import { HttpErrorResponse } from '@angular/common/http';

import { of, throwError } from 'rxjs';

import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';
import { TranslocoModule } from '@ngneat/transloco';
import { Actions } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { marbles } from 'rxjs-marbles/jest';

import { StringOption } from '@schaeffler/inputs';

import { MaterialClass, NavigationLevel } from '@mac/msd/constants';
import {
  CreateMaterialErrorState,
  CreateMaterialRecord,
  DataResult,
  ManufacturerSupplier,
  MaterialFormValue,
  MaterialRequest,
  MaterialStandard,
} from '@mac/msd/models';
import { MsdDataService } from '@mac/msd/services';
import { fetchResult } from '@mac/msd/store/actions/data';
import {
  createMaterialComplete,
  editDialogLoadingComplete,
  fetchCastingDiameters,
  fetchCastingDiametersFailure,
  fetchCastingDiametersSuccess,
  fetchCastingModes,
  fetchCastingModesFailure,
  fetchCastingModesSuccess,
  fetchCo2Classifications,
  fetchCo2ClassificationsFailure,
  fetchCo2ClassificationsSuccess,
  fetchCo2ValuesForSupplierSteelMakingProcess,
  fetchCo2ValuesForSupplierSteelMakingProcessFailure,
  fetchCo2ValuesForSupplierSteelMakingProcessSuccess,
  fetchCoatings,
  fetchCoatingsFailure,
  fetchCoatingsSuccess,
  fetchConditions,
  fetchConditionsFailure,
  fetchConditionsSuccess,
  fetchEditMaterialNameData,
  fetchEditMaterialNameDataFailure,
  fetchEditMaterialNameDataSuccess,
  fetchEditMaterialSuppliers,
  fetchEditMaterialSuppliersFailure,
  fetchEditMaterialSuppliersSuccess,
  fetchEditStandardDocumentData,
  fetchEditStandardDocumentDataFailure,
  fetchEditStandardDocumentDataSuccess,
  fetchManufacturerSuppliers,
  fetchManufacturerSuppliersFailure,
  fetchManufacturerSuppliersSuccess,
  fetchMaterialStandards,
  fetchMaterialStandardsFailure,
  fetchMaterialStandardsSuccess,
  fetchProductCategories,
  fetchProductCategoriesFailure,
  fetchProductCategoriesSuccess,
  fetchProductionProcesses,
  fetchProductionProcessesFailure,
  fetchProductionProcessesSuccess,
  fetchRatings,
  fetchRatingsFailure,
  fetchRatingsSuccess,
  fetchReferenceDocuments,
  fetchReferenceDocumentsFailure,
  fetchReferenceDocumentsSuccess,
  fetchSteelMakingProcesses,
  fetchSteelMakingProcessesFailure,
  fetchSteelMakingProcessesInUse,
  fetchSteelMakingProcessesInUseFailure,
  fetchSteelMakingProcessesInUseSuccess,
  fetchSteelMakingProcessesSuccess,
  manufacturerSupplierDialogConfirmed,
  manufacturerSupplierDialogOpened,
  materialDialogConfirmed,
  materialDialogOpened,
  materialstandardDialogConfirmed,
  materialstandardDialogOpened,
  openEditDialog,
  parseMaterialFormValue,
  postManufacturerSupplier,
  postMaterial,
  postMaterialStandard,
  resetDialogOptions,
  resetMaterialRecord,
  setMaterialFormValue,
} from '@mac/msd/store/actions/dialog';
import { DataFacade } from '@mac/msd/store/facades/data';

import { DialogEffects } from './dialog.effects';

jest.mock('@ngneat/transloco', () => ({
  ...jest.requireActual<TranslocoModule>('@ngneat/transloco'),
  translate: jest.fn((string) => string.split('.').pop()),
}));

describe('Dialog Effects', () => {
  let action: any;
  let actions$: any;
  let effects: DialogEffects;
  let spectator: SpectatorService<DialogEffects>;
  let msdDataService: MsdDataService;
  let msdDataFacade: DataFacade;

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
      {
        provide: DataFacade,
        useValue: {
          editMaterial: undefined,
          materialClass$: of(MaterialClass.STEEL),
        },
      },
    ],
  });

  beforeEach(() => {
    spectator = createService();
    actions$ = spectator.inject(Actions);
    effects = spectator.inject(DialogEffects);
    msdDataService = spectator.inject(MsdDataService);
    msdDataFacade = spectator.inject(DataFacade);
    msdDataFacade.materialClass$ = of(MaterialClass.STEEL);
    msdDataFacade.navigation$ = of({
      materialClass: MaterialClass.STEEL,
      navigationLevel: NavigationLevel.MATERIAL,
    });
  });

  describe('materialDialogOpened$', () => {
    it(
      'should dispatch the fetch actions',
      marbles((m) => {
        action = materialDialogOpened();
        actions$ = m.hot('-a', { a: action });

        const expected = m.cold('-(bcdefghi)', {
          b: fetchMaterialStandards(),
          c: fetchCo2Classifications(),
          d: fetchManufacturerSuppliers(),
          e: fetchProductCategories(),
          f: fetchRatings(),
          g: fetchSteelMakingProcesses(),
          h: fetchCastingModes(),
          i: fetchReferenceDocuments(),
        });

        m.expect(effects.materialDialogOpened$).toBeObservable(expected);
        m.flush();
      })
    );
    it(
      'should dispatch the fetch actions for MaterialStandard',
      marbles((m) => {
        action = materialstandardDialogOpened();
        actions$ = m.hot('-a', { a: action });

        const expected = m.cold('-(b)', {
          b: fetchMaterialStandards(),
        });

        m.expect(effects.materialstandardDialogOpened$).toBeObservable(
          expected
        );
        m.flush();
      })
    );
    it(
      'should dispatch the fetch actions for Manufacturer Supplier',
      marbles((m) => {
        action = manufacturerSupplierDialogOpened();
        actions$ = m.hot('-a', { a: action });

        const expected = m.cold('-(b)', {
          b: fetchManufacturerSuppliers(),
        });

        m.expect(effects.manufacturersupplierDialogOpened$).toBeObservable(
          expected
        );
        m.flush();
      })
    );

    it(
      'should dispatch the fetch actions for alu',
      marbles((m) => {
        action = materialDialogOpened();
        actions$ = m.hot('-a', { a: action });

        msdDataFacade.materialClass$ = of(MaterialClass.ALUMINUM);

        const expected = m.cold('-(bcde)', {
          b: fetchMaterialStandards(),
          c: fetchCo2Classifications(),
          d: fetchManufacturerSuppliers(),
          e: fetchProductCategories(),
        });

        m.expect(effects.materialDialogOpened$).toBeObservable(expected);
        m.flush();
      })
    );

    it(
      'should dispatch the fetch actions for copper',
      marbles((m) => {
        action = materialDialogOpened();
        actions$ = m.hot('-a', { a: action });

        msdDataFacade.materialClass$ = of(MaterialClass.COPPER);

        const expected = m.cold('-(bcdefgh)', {
          b: fetchMaterialStandards(),
          c: fetchCo2Classifications(),
          d: fetchManufacturerSuppliers(),
          e: fetchProductCategories(),
          f: fetchCastingModes(),
          g: fetchProductionProcesses(),
          h: fetchReferenceDocuments(),
        });

        m.expect(effects.materialDialogOpened$).toBeObservable(expected);
        m.flush();
      })
    );

    it(
      'should dispatch the fetch actions for ceramic',
      marbles((m) => {
        action = materialDialogOpened();
        actions$ = m.hot('-a', { a: action });

        msdDataFacade.materialClass$ = of(MaterialClass.CERAMIC);

        const expected = m.cold('-(bcdef)', {
          b: fetchMaterialStandards(),
          c: fetchCo2Classifications(),
          d: fetchManufacturerSuppliers(),
          e: fetchProductCategories(),
          f: fetchConditions(),
        });

        m.expect(effects.materialDialogOpened$).toBeObservable(expected);
        m.flush();
      })
    );

    it(
      'should dispatch the fetch actions for hardmagnet',
      marbles((m) => {
        action = materialDialogOpened();
        actions$ = m.hot('-a', { a: action });

        msdDataFacade.materialClass$ = of(MaterialClass.HARDMAGNET);

        const expected = m.cold('-(bcdef)', {
          b: fetchMaterialStandards(),
          c: fetchCo2Classifications(),
          d: fetchManufacturerSuppliers(),
          e: fetchCoatings(),
          f: fetchProductionProcesses(),
        });

        m.expect(effects.materialDialogOpened$).toBeObservable(expected);
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

        expect(msdDataService.fetchCo2Classifications).toHaveBeenCalledWith(
          MaterialClass.STEEL
        );
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

        expect(msdDataService.fetchCo2Classifications).toHaveBeenCalledWith(
          MaterialClass.STEEL
        );
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

  describe('fetchProductionProcesses$', () => {
    it(
      'should fetch production processes and return success action on success',
      marbles((m) => {
        action = fetchProductionProcesses();
        actions$ = m.hot('-a', { a: action });

        const resultMock: StringOption[] = [
          { id: '1', title: '1' },
          { id: '2', title: '2' },
        ];
        const response = m.cold('-a|', { a: resultMock });
        msdDataService.fetchProductionProcesses = jest.fn(() => response);

        const result = fetchProductionProcessesSuccess({
          productionProcesses: resultMock,
        });
        const expected = m.cold('--b', { b: result });

        m.expect(effects.fetchProductionProcesses$).toBeObservable(expected);
        m.flush();

        expect(msdDataService.fetchProductionProcesses).toHaveBeenCalledWith(
          MaterialClass.STEEL
        );
      })
    );

    it(
      'should fetch production processes and return failure action on failure',
      marbles((m) => {
        action = fetchProductionProcesses();
        actions$ = m.hot('-a', { a: action });

        msdDataService.fetchProductionProcesses = jest
          .fn()
          .mockReturnValue(throwError(() => 'error'));

        const result = fetchProductionProcessesFailure();
        const expected = m.cold('-b', { b: result });

        m.expect(effects.fetchProductionProcesses$).toBeObservable(expected);
        m.flush();

        expect(msdDataService.fetchProductionProcesses).toHaveBeenCalledWith(
          MaterialClass.STEEL
        );
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

        expect(msdDataService.fetchCastingModes).toHaveBeenCalledWith(
          MaterialClass.STEEL
        );
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

        expect(msdDataService.fetchCastingModes).toHaveBeenCalledWith(
          MaterialClass.STEEL
        );
      })
    );
  });

  describe('fetchCategoryOptions$', () => {
    it(
      'should fetch product categories and return success action on success',
      marbles((m) => {
        action = fetchProductCategories();
        actions$ = m.hot('a', { a: action });

        const mockResult = [{ id: 'raw', title: 'raw' }];
        const mockResponse = m.cold('-a|', { a: mockResult });
        msdDataService.getProductCategories = jest.fn(() => mockResponse);

        const result = fetchProductCategoriesSuccess({
          productCategories: mockResult,
        });
        const expected = m.cold('-b', { b: result });

        m.expect(effects.fetchCategoryOptions$).toBeObservable(expected);
        m.flush();

        expect(msdDataService.getProductCategories).toHaveBeenCalledWith(
          MaterialClass.STEEL
        );
      })
    );

    it(
      'should fetch product categories and return failure action on failure',
      marbles((m) => {
        action = fetchProductCategories();
        actions$ = m.hot('a', { a: action });

        msdDataService.getProductCategories = jest
          .fn()
          .mockReturnValue(throwError(() => 'error'));

        const result = fetchProductCategoriesFailure();
        const expected = m.cold('b', { b: result });

        m.expect(effects.fetchCategoryOptions$).toBeObservable(expected);
        m.flush();

        expect(msdDataService.getProductCategories).toHaveBeenCalledWith(
          MaterialClass.STEEL
        );
      })
    );
  });

  describe('fetchConditions$', () => {
    it(
      'should fetch conditions and return success action on success',
      marbles((m) => {
        action = fetchConditions();
        actions$ = m.hot('a', { a: action });

        const mockResult = [{ id: 'raw', title: 'raw' }];
        const mockResponse = m.cold('-a|', { a: mockResult });
        msdDataService.getConditions = jest.fn(() => mockResponse);

        const result = fetchConditionsSuccess({
          conditions: mockResult,
        });
        const expected = m.cold('-b', { b: result });

        m.expect(effects.fetchConditions$).toBeObservable(expected);
        m.flush();

        expect(msdDataService.getConditions).toHaveBeenCalledWith(
          MaterialClass.STEEL
        );
      })
    );
    it(
      'should fetch conditions and return failure action on failure',
      marbles((m) => {
        action = fetchConditions();
        actions$ = m.hot('a', { a: action });

        msdDataService.getConditions = jest
          .fn()
          .mockReturnValue(throwError(() => 'error'));

        const result = fetchConditionsFailure();
        const expected = m.cold('b', { b: result });

        m.expect(effects.fetchConditions$).toBeObservable(expected);
        m.flush();

        expect(msdDataService.getConditions).toHaveBeenCalledWith(
          MaterialClass.STEEL
        );
      })
    );
  });

  describe('fetchCoatings$', () => {
    it(
      'should fetch coatings and return success action on success',
      marbles((m) => {
        action = fetchCoatings();
        actions$ = m.hot('a', { a: action });

        const mockResult = [{ id: 'raw', title: 'raw' }];
        const mockResponse = m.cold('-a|', { a: mockResult });
        msdDataService.getCoatings = jest.fn(() => mockResponse);

        const result = fetchCoatingsSuccess({
          coatings: mockResult,
        });
        const expected = m.cold('-b', { b: result });

        m.expect(effects.fetchCoatings$).toBeObservable(expected);
        m.flush();

        expect(msdDataService.getCoatings).toHaveBeenCalledWith(
          MaterialClass.STEEL
        );
      })
    );
    it(
      'should fetch coatings and return failure action on failure',
      marbles((m) => {
        action = fetchCoatings();
        actions$ = m.hot('a', { a: action });

        msdDataService.getCoatings = jest
          .fn()
          .mockReturnValue(throwError(() => 'error'));

        const result = fetchCoatingsFailure();
        const expected = m.cold('b', { b: result });

        m.expect(effects.fetchCoatings$).toBeObservable(expected);
        m.flush();

        expect(msdDataService.getCoatings).toHaveBeenCalledWith(
          MaterialClass.STEEL
        );
      })
    );
  });

  describe('materialDialogConfirmed$', () => {
    it(
      'should call post material standard (without materialClass)',
      marbles((m) => {
        const mockMaterial = {} as MaterialRequest;
        const mockStandard = {} as MaterialStandard;
        const mockSupplier = {} as ManufacturerSupplier;

        action = materialDialogConfirmed({
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
              materialClass: MaterialClass.STEEL,
            } as CreateMaterialRecord,
          }),
        });

        m.expect(effects.materialDialogConfirmed$).toBeObservable(expected);
        m.flush();
      })
    );

    it(
      'should call post material standard (with materialClass)',
      marbles((m) => {
        const mockMaterial = {} as MaterialRequest;
        const mockStandard = {} as MaterialStandard;
        const mockSupplier = {} as ManufacturerSupplier;
        msdDataFacade.materialClass$ = of(MaterialClass.ALUMINUM);

        action = materialDialogConfirmed({
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
              materialClass: MaterialClass.ALUMINUM,
            } as CreateMaterialRecord,
          }),
        });

        m.expect(effects.materialDialogConfirmed$).toBeObservable(expected);
        m.flush();
      })
    );
  });

  describe('materialstandardDialogConfirmed$', () => {
    it(
      'should create material standard',
      marbles((m) => {
        const mockStandard = {
          materialName: 'sthName',
          standardDocument: 'stdDoc',
        } as MaterialStandard;

        action = materialstandardDialogConfirmed({
          standard: mockStandard,
        });

        const resultMock = { id: 42 };
        const response = m.cold('-a|', { a: resultMock });
        msdDataService.createMaterialStandard = jest.fn(() => response);

        actions$ = m.hot('-a', { a: action });
        const expected = m.cold('--(b)', {
          b: createMaterialComplete({
            record: {
              standard: {
                ...mockStandard,
                id: 42,
              },
              material: undefined,
              supplier: undefined,
              materialClass: MaterialClass.STEEL,
            } as CreateMaterialRecord,
          }),
        });

        m.expect(effects.materialstandardDialogConfirmed$).toBeObservable(
          expected
        );
        m.flush();
      })
    );
    it(
      'should call error directive',
      marbles((m) => {
        const mockStandard = {
          materialName: 'sthName',
          standardDocument: 'stdDoc',
        } as MaterialStandard;

        action = materialstandardDialogConfirmed({
          standard: mockStandard,
        });
        actions$ = m.hot('-a', { a: action });

        msdDataService.createMaterialStandard = jest
          .fn()
          .mockReturnValue(
            throwError(() => new HttpErrorResponse({ status: 407 }))
          );

        const expected = m.cold('-b', {
          b: createMaterialComplete({
            record: {
              standard: mockStandard,
              material: undefined,
              supplier: undefined,
              materialClass: MaterialClass.STEEL,
              error: {
                code: 407,
                state: CreateMaterialErrorState.MaterialStandardCreationFailed,
              },
            } as CreateMaterialRecord,
          }),
        });

        m.expect(effects.materialstandardDialogConfirmed$).toBeObservable(
          expected
        );
        m.flush();

        expect(msdDataService.createMaterialStandard).toHaveBeenCalledWith(
          mockStandard,
          MaterialClass.STEEL
        );
      })
    );
  });

  describe('manufacturersupplierDialogConfirmed$', () => {
    it(
      'should create manufacturer supplier',
      marbles((m) => {
        const mockSupplier = {
          name: 'sthName',
          plant: 'sthPlant',
          country: 'sthCountry',
        } as ManufacturerSupplier;

        action = manufacturerSupplierDialogConfirmed({
          supplier: mockSupplier,
        });

        const resultMock = { id: 42 };
        const response = m.cold('-a|', { a: resultMock });
        msdDataService.createManufacturerSupplier = jest.fn(() => response);

        actions$ = m.hot('-a', { a: action });
        const expected = m.cold('--(b)', {
          b: createMaterialComplete({
            record: {
              supplier: {
                ...mockSupplier,
                id: 42,
              },
              material: undefined,
              standard: undefined,
              materialClass: MaterialClass.STEEL,
            } as CreateMaterialRecord,
          }),
        });

        m.expect(effects.manufacturersupplierDialogConfirmed$).toBeObservable(
          expected
        );
        m.flush();
      })
    );
    it(
      'should call error directive',
      marbles((m) => {
        const mockSupplier = {
          name: 'sthName',
          plant: 'sthPlant',
          country: 'sthCountry',
        } as ManufacturerSupplier;

        action = manufacturerSupplierDialogConfirmed({
          supplier: mockSupplier,
        });
        actions$ = m.hot('-a', { a: action });

        msdDataService.createManufacturerSupplier = jest
          .fn()
          .mockReturnValue(
            throwError(() => new HttpErrorResponse({ status: 407 }))
          );

        const expected = m.cold('-b', {
          b: createMaterialComplete({
            record: {
              standard: undefined,
              material: undefined,
              supplier: mockSupplier,
              materialClass: MaterialClass.STEEL,
              error: {
                code: 407,
                state: CreateMaterialErrorState.MaterialStandardCreationFailed,
              },
            } as CreateMaterialRecord,
          }),
        });

        m.expect(effects.manufacturersupplierDialogConfirmed$).toBeObservable(
          expected
        );
        m.flush();

        expect(msdDataService.createManufacturerSupplier).toHaveBeenCalledWith(
          mockSupplier,
          MaterialClass.STEEL
        );
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
      materialClass: MaterialClass.STEEL,
    } as CreateMaterialRecord;
    it(
      'should call skipp adding material standard',
      marbles((m) => {
        const record = recordMock;
        action = postMaterialStandard({ record });
        actions$ = m.hot('-a', { a: action });

        const expected = m.cold('-(b)', {
          b: postManufacturerSupplier({ record }),
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
            },
          }),
        });

        m.expect(effects.postMaterialStandard$).toBeObservable(expected);
        m.flush();

        expect(msdDataService.createMaterialStandard).toHaveBeenCalledWith(
          record.standard,
          record.materialClass
        );
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
          .mockReturnValue(
            throwError(() => new HttpErrorResponse({ status: 407 }))
          );

        const expected = m.cold('-b', {
          b: createMaterialComplete({
            record: {
              ...record,
              error: {
                code: 407,
                state: CreateMaterialErrorState.MaterialStandardCreationFailed,
              },
            },
          }),
        });

        m.expect(effects.postMaterialStandard$).toBeObservable(expected);
        m.flush();

        expect(msdDataService.createMaterialStandard).toHaveBeenCalledWith(
          record.standard,
          record.materialClass
        );
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
      materialClass: MaterialClass.STEEL,
    } as CreateMaterialRecord;
    it(
      'should call skip adding supplier',
      marbles((m) => {
        const record = recordMock;
        action = postManufacturerSupplier({ record });
        actions$ = m.hot('-a', { a: action });

        const expected = m.cold('-(b)', {
          b: postMaterial({ record }),
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
            },
          }),
        });

        m.expect(effects.postManufacturerSupplier$).toBeObservable(expected);
        m.flush();

        expect(msdDataService.createManufacturerSupplier).toHaveBeenCalledWith(
          record.supplier,
          record.materialClass
        );
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
          .mockReturnValue(
            throwError(() => new HttpErrorResponse({ status: 407 }))
          );

        const expected = m.cold('-b', {
          b: createMaterialComplete({
            record: {
              ...record,
              error: {
                code: 407,
                state:
                  CreateMaterialErrorState.ManufacturerSupplierCreationFailed,
              },
            },
          }),
        });

        m.expect(effects.postManufacturerSupplier$).toBeObservable(expected);
        m.flush();

        expect(msdDataService.createManufacturerSupplier).toHaveBeenCalledWith(
          record.supplier,
          record.materialClass
        );
      })
    );
  });

  describe('postMaterial$', () => {
    const recordMock = {
      materialClass: MaterialClass.STEEL,
    } as CreateMaterialRecord;
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
          c: createMaterialComplete({ record }),
        });

        m.expect(effects.postMaterial$).toBeObservable(expected);
        m.flush();

        expect(msdDataService.createMaterial).toHaveBeenCalledWith(
          record.material,
          record.materialClass
        );
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
          .mockReturnValue(
            throwError(() => new HttpErrorResponse({ status: 407 }))
          );

        const expected = m.cold('-b', {
          b: createMaterialComplete({
            record: {
              ...record,
              error: {
                code: 407,
                state: CreateMaterialErrorState.MaterialCreationFailed,
              },
            },
          }),
        });

        m.expect(effects.postMaterial$).toBeObservable(expected);
        m.flush();

        expect(msdDataService.createMaterial).toHaveBeenCalledWith(
          record.material,
          record.materialClass
        );
      })
    );
  });

  describe('resetMaterialRecord$', () => {
    it(
      'should call to reset dialog options',
      marbles((m) => {
        action = resetMaterialRecord({
          error: false,
          createAnother: false,
        });
        actions$ = m.hot('-a', { a: action });
        const expected = m.cold('-(b)', {
          b: resetDialogOptions(),
        });

        m.expect(effects.resetMaterialDialog$).toBeObservable(expected);
        m.flush();
      })
    );
    it(
      'should call to fetch results',
      marbles((m) => {
        action = resetMaterialRecord({
          error: false,
          createAnother: true,
        });
        actions$ = m.hot('-a', { a: action });
        const expected = m.cold('-(b)', {
          b: fetchResult(),
        });

        m.expect(effects.resetMaterialDialog$).toBeObservable(expected);
        m.flush();
      })
    );
    it(
      'should do nothing on error',
      marbles((m) => {
        action = resetMaterialRecord({
          error: true,
          createAnother: false,
        });
        actions$ = m.hot('-a', { a: action });
        const expected = m.cold('---');

        m.expect(effects.resetMaterialDialog$).toBeObservable(expected);
        m.flush();
      })
    );
    it(
      'should do nothing on error with createAnother',
      marbles((m) => {
        action = resetMaterialRecord({
          error: true,
          createAnother: true,
        });
        actions$ = m.hot('-a', { a: action });
        const expected = m.cold('---');

        m.expect(effects.resetMaterialDialog$).toBeObservable(expected);
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
          'ingot',
          MaterialClass.STEEL
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
          'ingot',
          MaterialClass.STEEL
        );
      })
    );
  });

  describe('fetchReferenceDocuments$', () => {
    it(
      'should fetch referenceDocuments and return success action on success',
      marbles((m) => {
        action = fetchReferenceDocuments();
        actions$ = m.hot('-a', { a: action });

        const resultMock: string[] = ['reference', 'document', '["as json"]'];
        const response = m.cold('-a|', { a: resultMock });
        msdDataService.fetchReferenceDocuments = jest.fn(() => response);

        const result = fetchReferenceDocumentsSuccess({
          referenceDocuments: ['reference', 'document', 'as json'],
        });
        const expected = m.cold('--b', { b: result });

        m.expect(effects.fetchReferenceDocuments$).toBeObservable(expected);
        m.flush();

        expect(msdDataService.fetchReferenceDocuments).toHaveBeenCalledWith(
          MaterialClass.STEEL
        );
      })
    );

    it(
      'should fetch reference documents and return failure action on failure',
      marbles((m) => {
        action = fetchReferenceDocuments();
        actions$ = m.hot('-a', { a: action });

        msdDataService.fetchReferenceDocuments = jest
          .fn()
          .mockReturnValue(throwError(() => 'error'));

        const result = fetchReferenceDocumentsFailure();
        const expected = m.cold('-b', { b: result });

        m.expect(effects.fetchReferenceDocuments$).toBeObservable(expected);
        m.flush();

        expect(msdDataService.fetchReferenceDocuments).toHaveBeenCalledWith(
          MaterialClass.STEEL
        );
      })
    );
  });

  describe('openEditDialog$', () => {
    it(
      'should dispatch the actions',
      marbles((m) => {
        action = openEditDialog({
          row: {
            manufacturerSupplierName: 'supplier',
            materialStandardMaterialName: 'material',
            materialStandardStandardDocument: 'document',
          } as DataResult,
          column: 'column',
        });
        actions$ = m.hot('-a', { a: action });

        const expected = m.cold('-(bcd)', {
          b: fetchEditStandardDocumentData({ standardDocument: 'document' }),
          c: fetchEditMaterialNameData({ materialName: 'material' }),
          d: fetchEditMaterialSuppliers({ supplierName: 'supplier' }),
        });

        m.expect(effects.openEditDialog$).toBeObservable(expected);
        m.flush();
      })
    );
  });

  describe('fetchEditStandardDocumentData$', () => {
    it(
      'should fetch the material names',
      marbles((m) => {
        action = fetchEditStandardDocumentData({
          standardDocument: 'document',
        });
        actions$ = m.hot('-a', { a: action });

        const resultMock: [number, string][] = [
          [3, 'material3'],
          [1, 'material1'],
        ];
        const response = m.cold('-a|', { a: resultMock });
        msdDataService.fetchMaterialNamesForStandardDocuments = jest.fn(
          () => response
        );

        const result = fetchEditStandardDocumentDataSuccess({
          materialNames: [
            { id: 1, materialName: 'material1' },
            { id: 3, materialName: 'material3' },
          ],
        });
        const expected = m.cold('--b', { b: result });

        m.expect(effects.fetchEditStandardDocumentData$).toBeObservable(
          expected
        );
        m.flush();

        expect(
          msdDataService.fetchMaterialNamesForStandardDocuments
        ).toHaveBeenCalledWith('document', MaterialClass.STEEL);
      })
    );

    it(
      'should fetch material names and return failure action on failure',
      marbles((m) => {
        action = fetchEditStandardDocumentData({
          standardDocument: 'document',
        });
        actions$ = m.hot('-a', { a: action });

        msdDataService.fetchMaterialNamesForStandardDocuments = jest
          .fn()
          .mockReturnValue(throwError(() => 'error'));

        const result = fetchEditStandardDocumentDataFailure();
        const expected = m.cold('-b', { b: result });

        m.expect(effects.fetchEditStandardDocumentData$).toBeObservable(
          expected
        );
        m.flush();

        expect(
          msdDataService.fetchMaterialNamesForStandardDocuments
        ).toHaveBeenCalledWith('document', MaterialClass.STEEL);
      })
    );
  });

  describe('fetchEditMaterialNameData$', () => {
    it(
      'should fetch the standard documents',
      marbles((m) => {
        action = fetchEditMaterialNameData({ materialName: 'material' });
        actions$ = m.hot('-a', { a: action });

        const resultMock: [number, string][] = [
          [3, 'material3'],
          [1, 'material1'],
        ];
        const response = m.cold('-a|', { a: resultMock });
        msdDataService.fetchStandardDocumentsForMaterialName = jest.fn(
          () => response
        );

        const result = fetchEditMaterialNameDataSuccess({
          standardDocuments: [
            { id: 1, standardDocument: 'material1' },
            { id: 3, standardDocument: 'material3' },
          ],
        });
        const expected = m.cold('--b', { b: result });

        m.expect(effects.fetchEditMaterialNameData$).toBeObservable(expected);
        m.flush();

        expect(
          msdDataService.fetchStandardDocumentsForMaterialName
        ).toHaveBeenCalledWith('material', MaterialClass.STEEL);
      })
    );

    it(
      'should fetch standard documents and return failure action on failure',
      marbles((m) => {
        action = fetchEditMaterialNameData({ materialName: 'document' });
        actions$ = m.hot('-a', { a: action });

        msdDataService.fetchStandardDocumentsForMaterialName = jest
          .fn()
          .mockReturnValue(throwError(() => 'error'));

        const result = fetchEditMaterialNameDataFailure();
        const expected = m.cold('-b', { b: result });

        m.expect(effects.fetchEditMaterialNameData$).toBeObservable(expected);
        m.flush();

        expect(
          msdDataService.fetchStandardDocumentsForMaterialName
        ).toHaveBeenCalledWith('document', MaterialClass.STEEL);
      })
    );
  });

  describe('fetchEditMaterialSupplier$', () => {
    it(
      'should fetch the supplier Ids',
      marbles((m) => {
        action = fetchEditMaterialSuppliers({ supplierName: 'supplier' });
        actions$ = m.hot('-a', { a: action });

        const resultMock: number[] = [3, 1];
        const response = m.cold('-a|', { a: resultMock });
        msdDataService.fetchManufacturerSuppliersForSupplierName = jest.fn(
          () => response
        );

        const result = fetchEditMaterialSuppliersSuccess({
          supplierIds: [1, 3],
        });
        const expected = m.cold('--b', { b: result });

        m.expect(effects.fetchEditMaterialSuppliers$).toBeObservable(expected);
        m.flush();

        expect(
          msdDataService.fetchManufacturerSuppliersForSupplierName
        ).toHaveBeenCalledWith('supplier', MaterialClass.STEEL);
      })
    );

    it(
      'should fetch supplier Ids and return failure action on failure',
      marbles((m) => {
        action = fetchEditMaterialSuppliers({ supplierName: 'supplier' });
        actions$ = m.hot('-a', { a: action });

        msdDataService.fetchManufacturerSuppliersForSupplierName = jest
          .fn()
          .mockReturnValue(throwError(() => 'error'));

        const result = fetchEditMaterialSuppliersFailure();
        const expected = m.cold('-b', { b: result });

        m.expect(effects.fetchEditMaterialSuppliers$).toBeObservable(
          expected as any
        );
        m.flush();

        expect(
          msdDataService.fetchManufacturerSuppliersForSupplierName
        ).toHaveBeenCalledWith('supplier', MaterialClass.STEEL);
      })
    );
  });

  describe('editDialogLoaded$', () => {
    it(
      'should return loading complete action with full edit information',
      marbles((m) => {
        action = fetchEditMaterialNameDataSuccess({ standardDocuments: [] });
        actions$ = m.hot('-a', { a: action });

        effects['dataFacade'].editMaterial = of({
          row: {} as DataResult,
          parsedMaterial: {} as MaterialFormValue,
          column: 'column',
          materialNames: [],
          materialNamesLoading: false,
          standardDocuments: [],
          standardDocumentsLoading: false,
          supplierIds: [],
          supplierIdsLoading: false,
          loadingComplete: false,
        });

        const result = parseMaterialFormValue();
        const expected = m.cold('-b', { b: result });

        m.expect(effects.editDialogLoaded$).toBeObservable(expected);
        m.flush();
      })
    );
  });

  describe('parseMaterialFormValue$', () => {
    const toStrOpt = (id: string) => ({ id, title: id } as StringOption);
    it(
      'should return set material form value action',
      marbles((m) => {
        const row = {
          id: 1,
          materialClass: 'st',
          materialClassText: 'Steel',
          materialStandardId: 2,
          materialStandardMaterialName: 'material',
          materialStandardStandardDocument: 'document',
          manufacturerSupplierId: 1,
          manufacturerSupplierName: 'supplier',
          manufacturerSupplierPlant: 'plant',
          manufacturerSupplierCountry: 'country',
          selfCertified: true,
          productCategory: 'brightBar',
          productCategoryText: 'Bright Bar',
          referenceDoc: ['reference'],
          co2Scope1: 1,
          co2Scope2: 1,
          co2Scope3: 1,
          co2PerTon: 3,
          co2Classification: 'C1',
          releaseDateYear: 1,
          releaseDateMonth: 1,
          releaseRestrictions: 'restriction',
          blocked: false,
          castingMode: 'mode',
          castingDiameter: 'diameter',
          minDimension: 1,
          maxDimension: 1,
          steelMakingProcess: 'process',
          rating: 'rating',
          ratingRemark: 'remark',
          ratingChangeComment: 'comment',
          manufacturer: false,
          condition: 'condition',
          coating: 'coating',
          maxRecyclingRate: 44,
          minRecyclingRate: 44,
          grade: 'grade',
        } as DataResult;

        const expectedFormValue: Partial<MaterialFormValue> = {
          manufacturerSupplierId: 1,
          materialStandardId: 2,
          productCategory: toStrOpt('brightBar'),
          referenceDoc: [toStrOpt('reference')],
          co2Scope1: 1,
          co2Scope2: 1,
          co2Scope3: 1,
          co2PerTon: 3,
          materialNumber: undefined,
          co2Classification: {
            id: 'C1',
            title: 'c1',
          },
          releaseDateYear: 1,
          releaseDateMonth: 1,
          releaseRestrictions: 'restriction',
          blocked: false,
          castingMode: 'mode',
          castingDiameter: toStrOpt('diameter'),
          maxDimension: 1,
          minDimension: 1,
          steelMakingProcess: toStrOpt('process'),
          productionProcess: undefined,
          rating: toStrOpt('rating'),
          ratingRemark: 'remark',
          selfCertified: true,
          minRecyclingRate: 44,
          maxRecyclingRate: 44,
          grade: 'grade',
          standardDocument: {
            id: 1,
            title: 'document',
            data: {
              materialNames: [
                { id: 1, materialName: '1' },
                { id: 2, materialName: '2' },
              ],
            },
          },
          materialName: {
            id: 1,
            title: 'material',
            data: {
              standardDocuments: [
                { id: 1, standardDocument: '1' },
                { id: 2, standardDocument: '2' },
              ],
            },
          },
          supplier: {
            id: 1,
            title: 'supplier',
          },
          supplierPlant: {
            id: 'plant',
            title: 'plant',
            data: {
              supplierId: 1,
              supplierName: 'supplier',
              supplierCountry: 'country',
            },
          },
          supplierCountry: toStrOpt('country'),
          manufacturer: false,
          condition: toStrOpt('condition'),
          coating: toStrOpt('coating'),
        };

        const editMaterial: any = {
          row,
          parsedMaterial: undefined,
          column: 'column',
          materialNames: [
            { id: 1, materialName: '1' },
            { id: 2, materialName: '2' },
          ],
          standardDocuments: [
            { id: 1, standardDocument: '1' },
            { id: 2, standardDocument: '2' },
          ],
          supplierIds: [1, 2],
        };

        effects['dataFacade'].editMaterial = of(editMaterial);

        action = parseMaterialFormValue();
        actions$ = m.hot('-a', { a: action });

        const result = setMaterialFormValue({
          parsedMaterial: expectedFormValue,
        });
        const expected = m.cold('-b', { b: result });

        m.expect(effects.parseMaterialFormValue$).toBeObservable(expected);
        m.flush();
      })
    );

    it(
      'should return set material form value action with partial data',
      marbles((m) => {
        const row = {
          id: 1,
          materialClass: 'st',
          materialClassText: 'Steel',
          materialStandardId: 1,
          materialStandardMaterialName: 'material',
          materialStandardStandardDocument: 'document',
          manufacturerSupplierId: 1,
          manufacturerSupplierName: 'supplier',
          manufacturerSupplierPlant: 'plant',
          manufacturerSupplierCountry: 'country',
          selfCertified: false,
          productCategory: 'brightBar',
          productCategoryText: 'Bright Bar',
          productionProcess: 'something',
          referenceDoc: ['reference'],
          co2Scope1: 1,
          co2Scope2: 1,
          co2Scope3: 1,
          co2PerTon: 3,
          releaseDateYear: 1,
          releaseDateMonth: 1,
          releaseRestrictions: 'restriction',
          blocked: false,
          castingMode: 'mode',
          minDimension: 1,
          maxDimension: 1,
          ratingRemark: 'remark',
          ratingChangeComment: 'comment',
          materialNumbers: ['1', '2'],
          minRecyclingRate: 33,
          maxRecyclingRate: 33,
          manufacturer: false,
          condition: 'condition',
          coating: 'coating',
          grade: 'grade',
        } as DataResult;

        const expectedFormValue: Partial<MaterialFormValue> = {
          manufacturerSupplierId: 1,
          materialStandardId: 1,
          productCategory: toStrOpt('brightBar'),
          referenceDoc: [toStrOpt('reference')],
          co2Scope1: 1,
          co2Scope2: 1,
          co2Scope3: 1,
          co2PerTon: 3,
          co2Classification: {
            id: undefined,
            title: 'none',
          },
          releaseDateYear: 1,
          releaseDateMonth: 1,
          releaseRestrictions: 'restriction',
          blocked: false,
          castingMode: 'mode',
          castingDiameter: undefined,
          maxDimension: 1,
          minDimension: 1,
          steelMakingProcess: undefined,
          productionProcess: toStrOpt('something'),
          rating: { id: undefined, title: 'none' },
          ratingRemark: 'remark',
          materialNumber: '1, 2',
          selfCertified: false,
          minRecyclingRate: 33,
          maxRecyclingRate: 33,
          grade: 'grade',
          standardDocument: {
            data: undefined,
            id: 1,
            title: 'document',
          },
          materialName: {
            data: undefined,
            id: 1,
            title: 'material',
          },
          supplier: {
            id: 1,
            title: 'supplier',
          },
          supplierPlant: {
            id: 'plant',
            title: 'plant',
            data: {
              supplierId: 1,
              supplierName: 'supplier',
              supplierCountry: 'country',
            },
          },
          supplierCountry: toStrOpt('country'),
          manufacturer: false,
          condition: toStrOpt('condition'),
          coating: toStrOpt('coating'),
        };

        const editMaterial: any = {
          row,
          parsedMaterial: undefined,
          column: 'column',
          materialNames: undefined,
          standardDocuments: undefined,
          supplierIds: [],
        };

        effects['dataFacade'].editMaterial = of(editMaterial);

        action = parseMaterialFormValue();
        actions$ = m.hot('-a', { a: action });

        const result = setMaterialFormValue({
          parsedMaterial: expectedFormValue,
        });
        const expected = m.hot('-b', { b: result });

        m.expect(effects.parseMaterialFormValue$).toBeObservable(expected);
        m.flush();
      })
    );
  });

  describe('setMaterialFormValue$', () => {
    it(
      'should return the loading complete action',
      marbles((m) => {
        action = setMaterialFormValue({
          parsedMaterial: {} as MaterialFormValue,
        });
        actions$ = m.hot('-a', { a: action });

        const result = editDialogLoadingComplete();
        const expected = m.cold('-b', { b: result });

        m.expect(effects.setMaterialFormValue$).toBeObservable(expected);
        m.flush();
      })
    );
  });

  describe('fetchSteelMakingProcessInUse$', () => {
    it(
      'should fetch the steel making processes in use',
      marbles((m) => {
        action = fetchSteelMakingProcessesInUse({
          supplierId: 1,
          castingMode: 'ESR',
          castingDiameter: '1x1',
        });
        actions$ = m.hot('-a', { a: action });

        const resultMock: string[] = ['BF+BOF'];
        const response = m.cold('-a|', { a: resultMock });
        msdDataService.fetchSteelMakingProcessesForSupplierPlantCastingModeCastingDiameter =
          jest.fn(() => response);

        const result = fetchSteelMakingProcessesInUseSuccess({
          steelMakingProcessesInUse: ['BF+BOF'],
        });
        const expected = m.cold('--b', { b: result });

        m.expect(effects.fetchSteelMakingProcessesInUse$).toBeObservable(
          expected
        );
        m.flush();

        expect(
          msdDataService.fetchSteelMakingProcessesForSupplierPlantCastingModeCastingDiameter
        ).toHaveBeenCalledWith(1, 'ESR', '1x1');
      })
    );

    it(
      'should fetch the steel making processes in use and return failure action on failure',
      marbles((m) => {
        action = fetchSteelMakingProcessesInUse({
          supplierId: 1,
          castingMode: 'ESR',
          castingDiameter: '1x1',
        });
        actions$ = m.hot('-a', { a: action });

        msdDataService.fetchSteelMakingProcessesForSupplierPlantCastingModeCastingDiameter =
          jest.fn().mockReturnValue(throwError(() => 'error'));

        const result = fetchSteelMakingProcessesInUseFailure();
        const expected = m.cold('-b', { b: result });

        m.expect(effects.fetchSteelMakingProcessesInUse$).toBeObservable(
          expected as any
        );
        m.flush();

        expect(
          msdDataService.fetchSteelMakingProcessesForSupplierPlantCastingModeCastingDiameter
        ).toHaveBeenCalledWith(1, 'ESR', '1x1');
      })
    );
  });

  describe('fetchCo2ValuesForSupplierSteelMakingProcess$', () => {
    it(
      'should fetch the co2 values and return success action',
      marbles((m) => {
        action = fetchCo2ValuesForSupplierSteelMakingProcess({
          supplierId: 1,
          steelMakingProcess: 'BF+BOF',
          productCategory: 'brightBar',
        });
        actions$ = m.hot('-a', { a: action });

        const resultMock = [
          {
            co2PerTon: 3,
            co2Scope1: 1,
            co2Scope2: 1,
            co2Scope3: 1,
            co2Classification: 'c1',
          },
        ];
        const response = m.cold('-a|', { a: resultMock });
        msdDataService.fetchCo2ValuesForSupplierPlantProcess = jest.fn(
          () => response
        );

        const result = fetchCo2ValuesForSupplierSteelMakingProcessSuccess({
          co2Values: [
            {
              co2PerTon: 3,
              co2Scope1: 1,
              co2Scope2: 1,
              co2Scope3: 1,
              co2Classification: 'c1',
            },
          ],
        });
        const expected = m.cold('--b', { b: result });

        m.expect(
          effects.fetchCo2ValuesForSupplierSteelMakingProcess$
        ).toBeObservable(expected);
        m.flush();

        expect(
          msdDataService.fetchCo2ValuesForSupplierPlantProcess
        ).toHaveBeenCalledWith(1, MaterialClass.STEEL, 'BF+BOF', 'brightBar');
      })
    );

    it(
      'should fetch the co2 values and return failure action on failure',
      marbles((m) => {
        action = fetchCo2ValuesForSupplierSteelMakingProcess({
          supplierId: 1,
          steelMakingProcess: 'BF+BOF',
          productCategory: 'brightBar',
        });
        actions$ = m.hot('-a', { a: action });

        msdDataService.fetchCo2ValuesForSupplierPlantProcess = jest
          .fn()
          .mockReturnValue(throwError(() => 'error'));

        const result = fetchCo2ValuesForSupplierSteelMakingProcessFailure();
        const expected = m.cold('-b', { b: result });

        m.expect(
          effects.fetchCo2ValuesForSupplierSteelMakingProcess$
        ).toBeObservable(expected as any);
        m.flush();

        expect(
          msdDataService.fetchCo2ValuesForSupplierPlantProcess
        ).toHaveBeenCalledWith(1, MaterialClass.STEEL, 'BF+BOF', 'brightBar');
      })
    );
  });
});
