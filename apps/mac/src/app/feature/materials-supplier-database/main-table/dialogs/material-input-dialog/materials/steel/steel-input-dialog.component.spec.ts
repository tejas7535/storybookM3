import {
  CUSTOM_ELEMENTS_SCHEMA,
  Injectable,
  NO_ERRORS_SCHEMA,
  QueryList,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { of, Subject } from 'rxjs';

import {
  createComponentFactory,
  mockProvider,
  Spectator,
} from '@ngneat/spectator/jest';
import { LetDirective, PushPipe } from '@ngrx/component';
import { provideMockActions } from '@ngrx/effects/testing';
import { DefaultProjectorFn, MemoizedSelector } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { MockDirective, MockModule, MockPipe, MockProvider } from 'ng-mocks';

import { SelectedFile } from '@schaeffler/file-upload';
import { StringOption } from '@schaeffler/inputs';
import { SelectComponent, SelectModule } from '@schaeffler/inputs/select';
import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import {
  NONE_OPTION,
  SCHAEFFLER_EXPERTS_CALCULATION_TOOL_OPTION,
  SCHAEFFLER_EXPERTS_OPTION,
  SCHAEFFLER_EXPERTS_PCF_OPTION,
  THIRD_PARTY_VERIFIED_OPTION,
} from '@mac/feature/materials-supplier-database/constants/co2-classification-options';
import { MsdDialogService } from '@mac/feature/materials-supplier-database/services';
import {
  getHighestCo2Values,
  getSteelMakingProcessesInUse,
} from '@mac/feature/materials-supplier-database/store';
import { DialogFacade } from '@mac/feature/materials-supplier-database/store/facades/dialog';
import { SteelMaterialFormValue } from '@mac/msd/models';
import { initialState as initialDataState } from '@mac/msd/store/reducers/data/data.reducer';
import { initialState as initialDialogState } from '@mac/msd/store/reducers/dialog/dialog.reducer';
import {
  mockMaterialStandards,
  mockSuppliers,
} from '@mac/testing/mocks/msd/input-dialog.mock';
import { createOption } from '@mac/testing/mocks/msd/material-generator.mock';
import { assignDialogValues } from '@mac/testing/mocks/msd/mock-input-dialog-values.mocks';

import * as en from '../../../../../../../../assets/i18n/en.json';
import { DialogControlsService, FileService } from '../../services';
import { ReleaseDateViewMode } from './constants/release-date-view-mode.enum';
import { SteelInputDialogComponent } from './steel-input-dialog.component';

@Injectable()
class MockDialogFacade extends DialogFacade {
  addCustomCastingDiameter = jest.fn();
  addCustomReferenceDocument = jest.fn();
  fetchCastingDiameters = jest.fn();
  fetchCo2ValuesForSupplierSteelMakingProcess = jest.fn();
  fetchSteelMakingProcessesInUse = jest.fn();
  materialDialogConfirmed = jest.fn();
  resetSteelMakingProcessInUse = jest.fn();
  updateCreateMaterialDialogValues = jest.fn();
  addCustomCo2Standard = jest.fn();
}

jest.mock(
  '@mac/feature/materials-supplier-database/main-table/dialogs/material-input-dialog/material-input-dialog.component'
);

jest.mock('@jsverse/transloco', () => ({
  ...jest.requireActual('@jsverse/transloco'),
  translate: jest.fn((key) => key),
}));

const getMockControl = (disabled: boolean): FormControl =>
  new FormControl({ value: undefined, disabled });

describe('SteelInputDialogComponent', () => {
  let component: SteelInputDialogComponent;
  let spectator: Spectator<SteelInputDialogComponent>;
  let dialogFacade: DialogFacade;

  const setSilent = <T>(control: FormControl<T> | FormGroup, value?: T) =>
    control.setValue(value, { emitEvent: false });

  const initialState = {
    msd: {
      data: {
        ...initialDataState,
      },
      dialog: {
        ...initialDialogState,
        dialogOptions: {
          ...initialDialogState.dialogOptions,
          materialStandards: mockMaterialStandards,
          materialStandardsLoading: true,
          manufacturerSuppliers: mockSuppliers,
          manufacturerSuppliersLoading: true,
          ratings: ['1'],
          ratingsLoading: true,
          steelMakingProcesses: ['1'],
          steelMakingProcessesLoading: true,
          co2Classifications: ['1'],
          co2ClassificationsLoading: true,
          castingModes: ['1'],
          castingModesLoading: true,
          loading: true,
        },
        createMaterial: {
          ...initialDialogState.createMaterial,
          createMaterialLoading: true,
          createMaterialSuccess: true,
        },
      },
    },
  };
  let matDialogData = {};
  let store: MockStore;
  let smpSpy: MemoizedSelector<any, string[], DefaultProjectorFn<string[]>>;
  let co2Spy: MemoizedSelector<any, any, DefaultProjectorFn<any>>;

  const createComponent = createComponentFactory({
    component: SteelInputDialogComponent,
    imports: [
      MockPipe(PushPipe),
      MockModule(ReactiveFormsModule),
      MockModule(SelectModule),
      MockDirective(LetDirective),
      provideTranslocoTestingModule({ en }),
    ],
    providers: [
      provideMockStore({ initialState }),
      provideMockActions(() => of()),
      MockProvider(DialogControlsService, {
        getCopperNumberControl: jest.fn((_, disabled) =>
          getMockControl(disabled)
        ),
        getRequiredControl: jest.fn((_, disabled) => getMockControl(disabled)),
        getControl: jest.fn((_, disabled) => getMockControl(disabled)),
        getNumberControl: jest.fn((_, disabled) => getMockControl(disabled)),
        getRequiredNumberControl: jest.fn((_, disabled) =>
          getMockControl(disabled)
        ),
      }),
      MockProvider(FileService),
      mockProvider(MsdDialogService),
      {
        provide: MatDialogRef,
        useValue: {
          close: jest.fn(),
        },
      },
      {
        provide: MAT_DIALOG_DATA,
        useValue: matDialogData,
      },
      MockProvider(DialogFacade, MockDialogFacade, 'useClass'),
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
    detectChanges: false,
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
    const spy = spectator.inject(MockStore);
    co2Spy = spy.overrideSelector(getHighestCo2Values, {});
    smpSpy = spy.overrideSelector(getSteelMakingProcessesInUse, []);
    store = spy;

    assignDialogValues(component, {
      steelNumberControl: getMockControl(false),
      selfCertifiedControl: getMockControl(false),
      castingModesControl: getMockControl(true),
      castingDiameterControl: getMockControl(true),
      ratingsControl: getMockControl(false),
      maxDimControl: getMockControl(false),
      minDimControl: getMockControl(false),
      releaseMonthControl: getMockControl(false),
      releaseYearControl: getMockControl(false),
      referenceDocumentControl: getMockControl(false),
      ratingRemarksControl: getMockControl(false),
      ratingChangeCommentControl: getMockControl(true),
      isBlockedControl: getMockControl(false),
      steelMakingProcessControl: getMockControl(false),
      minRecyclingRateControl: new FormControl(undefined, [
        Validators.min(0),
        Validators.max(100),
      ]),
      maxRecyclingRateControl: new FormControl(undefined, [
        Validators.min(0),
        Validators.max(100),
      ]),
      isManufacturerControl: getMockControl(false),
      destroy$: new Subject<void>(),
      isAddDialog: jest.fn(() => true),
    });

    spectator.detectChanges();

    dialogFacade = spectator.inject(DialogFacade);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should assign the material form', () => {
      component.createMaterialForm = undefined;

      component.ngOnInit();
      component.ngAfterViewInit();

      expect(component.createMaterialForm).toBeTruthy();
    });

    it('should disable referenceDocumentControl', () => {
      expect(component.referenceDocumentControl.disabled).toBe(false);

      const dialogData = {
        editDialogInformation: {
          selectedRows: [{ id: 1 }, { id: 2 }],
        },
      };
      Object.defineProperty(component, 'dialogData', {
        value: dialogData,
      });

      component.ngOnInit();

      expect(component.referenceDocumentControl.disabled).toBe(true);
    });

    describe('static', () => {
      it('should create an array of months with length 12', () => {
        expect(component.months).toHaveLength(12);
      });
      it('should create an array of months with all months', () => {
        expect(component.months).toEqual(
          expect.arrayContaining([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12])
        );
      });
      it('should create an array of years starting 2000', () => {
        const curYear = new Date().getFullYear();
        expect(component.years).toEqual(
          expect.arrayContaining([2000, curYear])
        );
      });
      it('should create an array of years ending current year', () => {
        const curYear = new Date().getFullYear();
        expect(component.years).toEqual(
          expect.not.arrayContaining([1999, curYear + 1])
        );
      });
    });
  });

  describe('updateCreateMaterialDialogValues', () => {
    it('should assign the material form', () => {
      component.minDimControl.setValue(99);

      expect(dialogFacade.updateCreateMaterialDialogValues).toBeCalledWith({
        ...component.createMaterialForm.value,
        reportValidUntil:
          component.reportValidUntilControlMoment.value?.format('YYYY-MM-DD'),
        co2UploadFile: undefined,
      });
    });
  });

  describe('modify rating', () => {
    beforeEach(() => {
      component.ratingsControl.reset(undefined, { emitEvent: false });
    });
    it('ratingChangeComment should be disabled after init', () => {
      expect(component.ratingChangeCommentControl.disabled).toBeTruthy();
    });
    it('ratingChangeComment should be enabled when rating has been set', () => {
      component.ratingsControl.setValue(createOption('', 1));

      expect(component.ratingChangeCommentControl.enabled).toBeTruthy();
      expect(component.ratingChangeCommentControl.invalid).toBeTruthy();
      expect(component.ratingChangeCommentControl.errors).toStrictEqual({
        dependency: true,
      });
    });
    it('ratingChangeComment should be disabled when rating is reset', () => {
      // set and reset
      component.ratingsControl.setValue(createOption('title'));
      component.ratingsControl.reset();

      expect(component.ratingChangeCommentControl.disabled).toBeTruthy();
      expect(component.ratingChangeCommentControl.getRawValue()).toBe(
        undefined
      );
    });

    describe('with editData', () => {
      beforeEach(() => {
        matDialogData = {
          editDialogInformation: {
            row: {
              rating: 7,
            },
          },
        };
        component.ratingsControl.setValue(createOption('title', 7), {
          emitEvent: false,
        });
      });
      it('ratingChangeComment should be disabled on init', () => {
        expect(component.ratingChangeCommentControl.disabled).toBeTruthy();
      });
      it('ratingChangeComment should be enabled when rating has been modified', () => {
        component.ratingsControl.setValue({
          id: 1,
          title: 'title',
        } as StringOption);

        expect(component.ratingChangeCommentControl.disabled).toBeFalsy();
      });
    });
  });

  describe('isManufacturerControl', () => {
    beforeEach(() => {
      component.supplierPlantControl.patchValue(
        createOption('plant', 1, { manufacturer: true })
      );
    });
    it('should unset and disable manufacturer with empty supplier data', () => {
      component.supplierPlantControl.reset();
      expect(component.isManufacturerControl.enabled).toBeFalsy();
      expect(component.isManufacturerControl.value).toBeFalsy();
    });
    it('should set and disable manufacturer for existing supplier', () => {
      const option = createOption('plant', 2, { manufacturer: true });
      component.supplierPlantControl.patchValue(option);
      expect(component.isManufacturerControl.enabled).toBeFalsy();
      expect(component.isManufacturerControl.value).toBeTruthy();
    });
    it('should unset and disable manufacturer for existing supplier', () => {
      const option = createOption('plant', 2, { manufacturer: false });
      component.supplierPlantControl.patchValue(option);
      expect(component.isManufacturerControl.enabled).toBeFalsy();
      expect(component.isManufacturerControl.value).toBeFalsy();
    });
    it('should enable manufacturerControl for new supplier', () => {
      const option = createOption('plant');
      component.supplierPlantControl.patchValue(option);
      expect(component.isManufacturerControl.enabled).toBeTruthy();
      expect(component.isManufacturerControl.value).toBeFalsy();
    });
  });

  describe('co2TotalControl', () => {
    it('should not be required by default', () => {
      expect(
        component.co2TotalControl.hasValidator(Validators.required)
      ).toBeFalsy();
    });

    it.each([
      [1, undefined],
      [undefined, 1],
      [1, 1],
    ])(
      'should add the required validator if some CO2 values are entered | %s, %s',
      (co2Core, co2Upstream) => {
        component.co2CoreControl.setValue(co2Core);
        component.co2UpstreamControl.setValue(co2Upstream);

        expect(
          component.co2TotalControl.hasValidator(Validators.required)
        ).toBeTruthy();
      }
    );

    it('should remove the required validator if both CO2 values are empty', () => {
      component.co2TotalControl.addValidators(Validators.required);
      component.co2CoreControl.setValue(undefined);
      component.co2UpstreamControl.setValue(undefined);

      expect(
        component.co2TotalControl.hasValidator(Validators.required)
      ).toBeFalsy();
    });
  });

  describe('co2ClassificationNewControl', () => {
    it('should be disabled by default', () => {
      expect(component.co2ClassificationNewControl.disabled).toBeTruthy();
    });

    it('should be enabled if co2Total has a value', () => {
      component.co2TotalControl.setValue(1);

      expect(component.co2ClassificationNewControl.enabled).toBeTruthy();
    });
  });

  describe('modify co2UploadFileIdControl', () => {
    it('should enable the reportValidUntil control if id is defined', () => {
      component.uploadMessages$.next = jest.fn();
      component.reportValidUntilControl.enable = jest.fn();
      component.reportValidUntilControlMoment.enable = jest.fn();
      component.getUploadMessages = jest.fn();

      component.co2UploadFileIdControl.setValue(1);

      expect(component.reportValidUntilControl.enable).toHaveBeenCalled();
      expect(component.reportValidUntilControlMoment.enable).toHaveBeenCalled();
      expect(component.uploadMessages$.next).toHaveBeenCalled();
      expect(component.getUploadMessages).toHaveBeenCalled();
    });

    it('should disable the reportValidUntil control if id and uploadFile are undefined', () => {
      component.uploadMessages$.next = jest.fn();
      component.reportValidUntilControl.disable = jest.fn();
      component.reportValidUntilControlMoment.disable = jest.fn();
      component.getUploadMessages = jest.fn();

      component.co2UploadFileControl.setValue(undefined, { emitEvent: false });
      component.co2UploadFileIdControl.setValue(undefined);

      expect(component.reportValidUntilControl.disable).toHaveBeenCalled();
      expect(
        component.reportValidUntilControlMoment.disable
      ).toHaveBeenCalled();
      expect(component.uploadMessages$.next).toHaveBeenCalled();
      expect(component.getUploadMessages).toHaveBeenCalled();
    });
  });

  describe('co2ClassificationNewDependants', () => {
    it('should have the dependants disabled by default', () => {
      expect(
        component.co2ClassificationNewSecondaryControl.disabled
      ).toBeTruthy();
      expect(component.co2StandardControl.disabled).toBeTruthy();
      expect(component.productCategoryRuleControl.disabled).toBeTruthy();
      expect(component.dataQualityRatingControl.disabled).toBeTruthy();
      expect(component.primaryDataShareControl.disabled).toBeTruthy();
      expect(component.co2CommentControl.disabled).toBeTruthy();
      expect(component.co2UploadFileControl.disabled).toBeTruthy();
    });

    it.each([[THIRD_PARTY_VERIFIED_OPTION], [SCHAEFFLER_EXPERTS_OPTION]])(
      'should enable the dependants if co2ClassificationNew has a value other than NONE',
      (value) => {
        component.co2ClassificationNewControl.setValue(value);

        expect(
          component.co2ClassificationNewSecondaryControl.enabled
        ).toBeTruthy();
        expect(component.co2StandardControl.enabled).toBeTruthy();
        expect(component.productCategoryRuleControl.enabled).toBeTruthy();
        expect(component.dataQualityRatingControl.enabled).toBeTruthy();
        expect(component.primaryDataShareControl.enabled).toBeTruthy();
        expect(component.co2CommentControl.enabled).toBeTruthy();
        expect(component.co2UploadFileControl.enabled).toBeTruthy();
      }
    );

    it('should disable the dependants if co2ClassificationNew is set to NONE', () => {
      component.co2ClassificationNewSecondaryControl.enable();
      component.co2StandardControl.enable();
      component.productCategoryRuleControl.enable();
      component.dataQualityRatingControl.enable();
      component.primaryDataShareControl.enable();
      component.co2CommentControl.enable();
      component.co2UploadFileControl.enable();

      component.co2ClassificationNewControl.setValue(NONE_OPTION);

      expect(
        component.co2ClassificationNewSecondaryControl.disabled
      ).toBeTruthy();
      expect(component.co2StandardControl.disabled).toBeTruthy();
      expect(component.productCategoryRuleControl.disabled).toBeTruthy();
      expect(component.dataQualityRatingControl.disabled).toBeTruthy();
      expect(component.primaryDataShareControl.disabled).toBeTruthy();
      expect(component.co2CommentControl.disabled).toBeTruthy();
      expect(component.co2UploadFileControl.disabled).toBeTruthy();
    });
  });

  describe('casting mode', () => {
    it('should be disable after init', () => {
      expect(component.castingModesControl.disabled).toBeTruthy();
    });
    it('should enable if supplier data has been set', () => {
      component.supplierCountryControl.setValue(createOption('some'));

      expect(component.castingModesControl.enabled).toBeTruthy();
    });
    it('should be disable if supplier data has not been set', () => {
      component.supplierCountryControl.setValue(createOption('some'));
      component.supplierCountryControl.reset();

      expect(component.castingModesControl.disabled).toBeTruthy();
    });
  });

  describe('castingMode / supplier dependencies', () => {
    beforeEach(() => {
      component.castingModesControl.enable();
      setSilent(component.castingDiameterDep, {
        supplierId: 11,
        castingMode: 'sth',
      });
    });
    it('should enable castingDiameter with new casting mode', () => {
      component.castingDiameterDep.patchValue({
        castingMode: 'new',
      });
      expect(component.castingDiameterControl.enabled).toBeTruthy();
      expect(dialogFacade.resetSteelMakingProcessInUse).toBeCalled();
    });
    it('should disable castingDiameter with casting mode reset', () => {
      component.castingDiameterDep.patchValue({
        castingMode: undefined,
      });
      expect(component.castingDiameterControl.disabled).toBeTruthy();
      expect(dialogFacade.resetSteelMakingProcessInUse).toBeCalled();
    });
    it('should fetchCastingDiameters', () => {
      component.castingDiameterDep.setValue({
        supplierId: 99,
        castingMode: 'new',
      });
      expect(dialogFacade.resetSteelMakingProcessInUse).toBeCalled();
      expect(dialogFacade.fetchCastingDiameters).toBeCalledWith(99, 'new');
    });
    it('should not fetchCastingDiameters without castingMode', () => {
      component.castingDiameterDep.patchValue({
        castingMode: undefined,
      });
      expect(dialogFacade.resetSteelMakingProcessInUse).toBeCalled();
      expect(dialogFacade.fetchCastingDiameters).not.toBeCalledWith(
        99,
        // eslint-disable-next-line unicorn/no-useless-undefined
        undefined
      );
    });
    it('should not fetchCastingDiameters without supplierId', () => {
      component.castingDiameterDep.patchValue({
        supplierId: undefined,
      });

      expect(dialogFacade.resetSteelMakingProcessInUse).toBeCalled();
      expect(dialogFacade.fetchCastingDiameters).not.toBeCalledWith(
        99,
        // eslint-disable-next-line unicorn/no-useless-undefined
        undefined
      );
    });
  });

  describe('castingDiameter update', () => {
    const supplierId = 3;
    const castingMode = 'ignot';
    let castingDiameter = '1x1';
    beforeEach(() => {
      component.castingDiameterControl.enable();
      setSilent(
        component.castingDiameterControl,
        createOption(castingDiameter)
      );
      setSilent(component.manufacturerSupplierIdControl, supplierId);
      setSilent(component.castingModesControl, castingMode);
    });
    it('should fetch steelMakingProcesses', () => {
      castingDiameter = '2x2';
      component.castingDiameterControl.setValue(createOption(castingDiameter));
      expect(dialogFacade.fetchSteelMakingProcessesInUse).toBeCalledWith(
        supplierId,
        castingMode,
        castingDiameter
      );
    });
    it('should not fetch processes with empty diameter', () => {
      component.castingDiameterControl.reset();
      expect(dialogFacade.fetchSteelMakingProcessesInUse).not.toBeCalled();
    });
    it('should not fetch processes with empty casting mode', () => {
      setSilent(component.castingModesControl);
      component.castingDiameterControl.setValue(createOption('test'));
      expect(dialogFacade.fetchSteelMakingProcessesInUse).not.toBeCalled();
    });
    it('should not fetch processes with empty id', () => {
      setSilent(component.manufacturerSupplierIdControl);
      component.castingDiameterControl.setValue(createOption('test'));
      expect(dialogFacade.fetchSteelMakingProcessesInUse).not.toBeCalled();
    });
  });

  describe('co2Dependencies', () => {
    beforeEach(() => {
      component.steelMakingProcessControl.enable();
      setSilent(component.manufacturerSupplierIdControl, 1);
      setSilent(component.steelMakingProcessControl, createOption('initial'));
    });
    it('should dispatch the fetch action on update of SMP', () => {
      component.createMaterialForm.updateValueAndValidity = jest.fn();

      component.categoriesControl.setValue(createOption('xxx', 'brightBar'));
      component.steelMakingProcessControl.setValue(createOption('BF+BOF'));

      expect(
        dialogFacade.fetchCo2ValuesForSupplierSteelMakingProcess
      ).toHaveBeenCalledWith(1, 'BF+BOF', 'brightBar');
      expect(
        component.createMaterialForm.updateValueAndValidity
      ).toHaveBeenCalled();
    });
    it('should dispatch the fetch action on update of SupplierId', () => {
      component.createMaterialForm.updateValueAndValidity = jest.fn();

      component.manufacturerSupplierIdControl.setValue(7);
      component.categoriesControl.setValue(createOption('xxx', 'brightBar'));
      component.steelMakingProcessControl.setValue(createOption('initial'));

      expect(
        dialogFacade.fetchCo2ValuesForSupplierSteelMakingProcess
      ).toHaveBeenCalledWith(7, 'initial', 'brightBar');
      expect(
        component.createMaterialForm.updateValueAndValidity
      ).toHaveBeenCalled();
    });
    it('should not dispatch the fetch action with no SMP', () => {
      component.steelMakingProcessControl.reset();

      expect(
        dialogFacade.fetchCo2ValuesForSupplierSteelMakingProcess
      ).not.toHaveBeenCalledWith(7, undefined, 'brightBar');
    });
    it('should not dispatch the fetch action with no supplierId', () => {
      setSilent(component.manufacturerSupplierIdControl);
      component.steelMakingProcessControl.setValue({ id: 0, title: 'process' });

      expect(
        dialogFacade.fetchCo2ValuesForSupplierSteelMakingProcess
      ).not.toHaveBeenCalledWith(undefined, undefined, 'brightBar');
    });
  });

  describe('steelmakingProcessesInUse', () => {
    const sc = new SelectComponent();
    const update = (arr?: string[]) => {
      smpSpy.setResult(arr);
      store.refreshState();
    };
    beforeEach(() => {
      const ql = Object.assign(new QueryList(), {
        first: sc,
      }) as QueryList<SelectComponent>;
      Object.assign(component['steelMakingProcessSelectQueryList'], ql);
    });
    it('should set initialSearchValue to "inuseFilter"', () => {
      update(['1']);
      expect(sc.searchControl.value).not.toBe('');
    });
    it('should set initialSearchValue to empty filter', () => {
      update([]);
      expect(sc.searchControl.value).toBe('');
    });
    it('should set initialSearchValue to', () => {
      update();
      expect(sc.searchControl.value).toBe('');
    });
  });

  describe('co2ValuesForSupplierSteelMakingProcess', () => {
    beforeEach(() => {
      setSilent(component.co2Scope1Control);
      setSilent(component.co2Scope2Control);
      setSilent(component.co2Scope3Control);
      setSilent(component.co2TotalControl);
      setSilent(component.co2ClassificationControl);
      component.co2ClassificationControl.disable();
      component['snackbar'].infoTranslated = jest.fn();
    });
    const update = (
      arr?: number[],
      co2Classification?: string,
      otherValues = 0
    ) => {
      if (arr) {
        co2Spy.setResult({
          co2Values: {
            co2Scope1: arr[0],
            co2Scope2: arr[1],
            co2Scope3: arr[2],
            co2PerTon: arr[3],
            co2Classification,
          },
          otherValues,
        });
      } else {
        co2Spy.setResult({});
      }
      store.refreshState();
    };
    it('should update co2Dialog values', () => {
      update([1, 2, 3, 4], 'yes', 8);

      expect(component['snackbar'].infoTranslated).toBeCalled();
      expect(component.co2ClassificationControl.enabled).toBe(true);
      expect(component.co2ClassificationControl.value).toBe('yes');
      expect(component.co2Scope1Control.value).toBe(1);
      expect(component.co2Scope2Control.value).toBe(2);
      expect(component.co2Scope3Control.value).toBe(3);
      expect(component.co2TotalControl.value).toBe(4);
    });
    it('should partial update co2Dialog values', () => {
      update([1, undefined, undefined, 4]);

      expect(component['snackbar'].infoTranslated).toBeCalled();
      expect(component.co2ClassificationControl.enabled).toBe(true);
      expect(component.co2ClassificationControl.value).toBeFalsy();
      expect(component.co2Scope1Control.value).toBe(1);
      expect(component.co2Scope2Control.value).toBeFalsy();
      expect(component.co2Scope3Control.value).toBeFalsy();
      expect(component.co2TotalControl.value).toBe(4);
    });
    it('should not update co2Dialog values with no values given', () => {
      update();

      expect(component['snackbar'].infoTranslated).not.toBeCalled();
      expect(component.co2ClassificationControl.enabled).toBe(false);
    });
    it('should not update co2Dialog values with value set for scope1', () => {
      setSilent(component.co2Scope1Control, 400);
      update([1, 2, 3, 4]);

      expect(component['snackbar'].infoTranslated).not.toBeCalled();
      expect(component.co2ClassificationControl.enabled).toBe(false);
    });
    it('should not update co2Dialog values with value set for scope2', () => {
      setSilent(component.co2Scope2Control, 99);
      update([1, 2, 3, 4]);

      expect(component['snackbar'].infoTranslated).not.toBeCalled();
      expect(component.co2ClassificationControl.enabled).toBe(false);
    });
    it('should not update co2Dialog values with value set for scope3', () => {
      setSilent(component.co2Scope3Control, 66);
      update([1, 2, 3, 4]);

      expect(component['snackbar'].infoTranslated).not.toBeCalled();
      expect(component.co2ClassificationControl.enabled).toBe(false);
    });
    it('should not update co2Dialog values with value set for co2Total given', () => {
      setSilent(component.co2TotalControl, 3);
      update([1, 2, 3, 4]);

      expect(component['snackbar'].infoTranslated).not.toBeCalled();
      expect(component.co2ClassificationControl.enabled).toBe(false);
    });
  });

  describe('selectReleaseDateView', () => {
    beforeEach(() => {
      component.isEditDialog = jest.fn(() => false);
      component.isCopyDialog = jest.fn(() => false);
      component.isBulkEditDialog = jest.fn(() => false);
      component.releaseMonthControl.enable();
      component.releaseYearControl.enable();
    });
    it('should return NEW for ADD Dialog', () => {
      component.isCopyDialog = jest.fn(() => false);
      component.isEditDialog = jest.fn(() => false);
      component.isBulkEditDialog = jest.fn(() => false);
      expect(component.selectReleaseDateView()).toBe(
        ReleaseDateViewMode.DEFAULT
      );
    });
    it('should return NEW for COPY Dialog', () => {
      component.isCopyDialog = jest.fn(() => true);
      component.isEditDialog = jest.fn(() => true);
      component.isBulkEditDialog = jest.fn(() => false);
      expect(component.selectReleaseDateView()).toBe(
        ReleaseDateViewMode.DEFAULT
      );
    });
    it('should return NEW for BULK Edit Dialog', () => {
      component.isCopyDialog = jest.fn(() => false);
      component.isEditDialog = jest.fn(() => true);
      component.isBulkEditDialog = jest.fn(() => true);
      expect(component.selectReleaseDateView()).toBe(
        ReleaseDateViewMode.READONLY
      );
    });
    it('should return READONLY for EDIT Dialog', () => {
      component.isCopyDialog = jest.fn(() => false);
      component.isEditDialog = jest.fn(() => true);
      component.isBulkEditDialog = jest.fn(() => false);
      component.releaseMonthControl.setValue(1);
      component.releaseYearControl.setValue(33);
      expect(component.selectReleaseDateView()).toBe(
        ReleaseDateViewMode.READONLY
      );
    });
    it('should return HISTORIC for EDIT Dialog without full release date (month)', () => {
      component.isCopyDialog = jest.fn(() => false);
      component.isEditDialog = jest.fn(() => true);
      component.isBulkEditDialog = jest.fn(() => false);
      component.releaseMonthControl.reset();
      component.releaseYearControl.setValue(33);
      expect(component.selectReleaseDateView()).toBe(
        ReleaseDateViewMode.HISTORIC
      );
    });
    it('should return HISTORIC for EDIT Dialog without full release date (Year)', () => {
      component.isCopyDialog = jest.fn(() => false);
      component.isEditDialog = jest.fn(() => true);
      component.isBulkEditDialog = jest.fn(() => false);
      component.releaseMonthControl.setValue(1);
      component.releaseYearControl.reset();
      expect(component.selectReleaseDateView()).toBe(
        ReleaseDateViewMode.HISTORIC
      );
    });
  });

  describe('getCo2ClassificationsNew', () => {
    it('should return the co2Classifications', () => {
      const result = component.getCo2ClassificationsNew();
      expect(result).toEqual([
        THIRD_PARTY_VERIFIED_OPTION,
        SCHAEFFLER_EXPERTS_OPTION,
        NONE_OPTION,
      ]);
    });
  });

  describe('getCo2ClassificationsNewSecondary', () => {
    it('should return the co2Classifications', () => {
      const result = component.getCo2ClassificationsNewSecondary();
      expect(result).toEqual([
        SCHAEFFLER_EXPERTS_CALCULATION_TOOL_OPTION,
        SCHAEFFLER_EXPERTS_PCF_OPTION,
      ]);
    });
  });

  describe('getUploadMessages', () => {
    it('should return the filename control value if the fileId control value is defined', () => {
      component.co2UploadFileIdControl.setValue(1, { emitEvent: false });
      component.co2UploadFileFilenameControl.setValue('test', {
        emitEvent: false,
      });

      const result = component.getUploadMessages();

      expect(result.length).toBe(1);
    });

    it('should return the row filename value if the fileId control value is defined, but the name control has no value', () => {
      component.co2UploadFileIdControl.setValue(1, { emitEvent: false });
      component.co2UploadFileFilenameControl.setValue(undefined, {
        emitEvent: false,
      });
      component.dialogData.editDialogInformation = {
        row: {
          co2UploadFileFilename: 'test',
        } as any,
      } as any;

      const result = component.getUploadMessages();

      expect(result.length).toBe(1);
    });

    it('should return undefined if the id control is undefined', () => {
      component.co2UploadFileIdControl.setValue(undefined, {
        emitEvent: false,
      });

      const result = component.getUploadMessages();

      expect(result).toBe(undefined);
    });
  });

  describe('setFile', () => {
    it('should set the co2UploadFileControl value if at least one file is selected and enable the reportValidUntilControl', () => {
      const file = new File([''], 'filename');
      const files: SelectedFile[] = [{ file } as SelectedFile];
      component.setFile(files);
      expect(component.co2UploadFileControl.value).toEqual(file);
      expect(component.co2UploadFileControl.touched).toBe(true);
      expect(component.reportValidUntilControl.enabled).toBe(true);
    });

    it('should reset the co2UploadFileControl value if no file is selected and disable the reportValidUntilControl', () => {
      component.reportValidUntilControl.enable();

      component.setFile([]);
      expect(component.co2UploadFileControl.value).toBeNull();
      expect(component.co2UploadFileControl.touched).toBe(false);
      expect(component.reportValidUntilControl.disabled).toBe(true);
    });
  });

  describe('addReferenceDocument', () => {
    it('should add values to select', () => {
      const referenceDocument = 'string';
      component.addReferenceDocument(referenceDocument);
      expect(dialogFacade.addCustomReferenceDocument).toHaveBeenCalledWith(
        referenceDocument
      );
    });
  });

  describe('addCastingDiameter', () => {
    it('should add values to select', () => {
      const castingDiameter = 'string';
      component.addCastingDiameter(castingDiameter);
      expect(dialogFacade.addCustomCastingDiameter).toHaveBeenCalledWith(
        castingDiameter
      );
    });
  });

  describe('addCo2Standard', () => {
    it('should add values to select', () => {
      const co2Standard = 'standard';
      component.addCo2Standard(co2Standard);
      expect(dialogFacade.addCustomCo2Standard).toHaveBeenCalledWith(
        co2Standard
      );
    });
  });

  describe('steelMakingProcessFilterFn', () => {
    it('should return the false', () => {
      const result = component.steelMakingProcessFilterFn(
        { id: 'BF+BOF', title: 'BF+BOF' },
        'a'
      );

      expect(result).toBe(false);
    });

    it('should return the true', () => {
      const result = component.steelMakingProcessFilterFn(
        { id: 'BF+BOF', title: 'BF+BOF' },
        'bof'
      );

      expect(result).toBe(true);
    });

    it('should return true if the title is within the used processes', () => {
      component['steelMakingProcessesInUse'] = ['BF+BOF'];
      const result = component.steelMakingProcessFilterFn(
        { id: 'BF+BOF', title: 'BF+BOF' },
        'in use by supplier'
      );

      expect(result).toBe(true);
    });
  });

  describe('enableEditFields', () => {
    beforeEach(() => {
      component.releaseMonthControl.removeValidators = jest.fn();
      component.releaseYearControl.removeValidators = jest.fn();
    });
    it('should call the parent function and do nothing if a release date is present', () => {
      const mockFormValue = {
        releaseDateMonth: 1,
        releaseDateYear: 1,
      } as SteelMaterialFormValue;

      component.enableEditFields(mockFormValue);

      // expect(mockSuperEnableEditFields).toHaveBeenCalledWith(mockFormValue);
      expect(
        component.releaseMonthControl.removeValidators
      ).not.toHaveBeenCalled();
      expect(
        component.releaseYearControl.removeValidators
      ).not.toHaveBeenCalled();
    });

    it('should call the parent function and remove the required validators if no release date month is present', () => {
      const mockFormValue = {
        releaseDateMonth: undefined,
        releaseDateYear: 1,
      } as SteelMaterialFormValue;

      component.enableEditFields(mockFormValue);

      // expect(mockSuperEnableEditFields).toHaveBeenCalledWith(mockFormValue);
      expect(
        component.releaseMonthControl.removeValidators
      ).toHaveBeenCalledWith(Validators.required);
      expect(
        component.releaseYearControl.removeValidators
      ).toHaveBeenCalledWith(Validators.required);
    });

    it('should call the parent function and remove the required validators if no release date year is present', () => {
      const mockFormValue = {
        releaseDateMonth: 1,
        releaseDateYear: undefined,
      } as SteelMaterialFormValue;

      component.enableEditFields(mockFormValue);

      // expect(mockSuperEnableEditFields).toHaveBeenCalledWith(mockFormValue);
      expect(
        component.releaseMonthControl.removeValidators
      ).toHaveBeenCalledWith(Validators.required);
      expect(
        component.releaseYearControl.removeValidators
      ).toHaveBeenCalledWith(Validators.required);
    });

    it('should call the parent function and not remove the validators in copy dialog', () => {
      const mockFormValue = {
        releaseDateMonth: 1,
        releaseDateYear: 1,
      } as SteelMaterialFormValue;
      component.isCopyDialog = jest.fn(() => true);

      component.enableEditFields(mockFormValue);

      // expect(mockSuperEnableEditFields).toHaveBeenCalledWith(mockFormValue);
      expect(
        component.releaseMonthControl.removeValidators
      ).not.toHaveBeenCalled();
      expect(
        component.releaseYearControl.removeValidators
      ).not.toHaveBeenCalled();
    });
  });

  describe('recyclingRate', () => {
    let min: FormControl<number>;
    let max: FormControl<number>;
    beforeEach(() => {
      min = component.minRecyclingRateControl;
      max = component.maxRecyclingRateControl;
    });
    describe('recycleRateValidatorFn', () => {
      it('should be valid on empty fields', () => {
        min.reset();
        max.reset();
        expect(max.valid).toBeTruthy();
        expect(min.valid).toBeTruthy();
      });
      it('should be valid', () => {
        min.setValue(7);
        max.setValue(10);
        expect(max.valid).toBeTruthy();
        expect(min.valid).toBeTruthy();
      });
      it('should show error when above limit', () => {
        min.setValue(101);
        max.setValue(199);
        expect(max.valid).toBeFalsy();
        expect(min.valid).toBeFalsy();
      });
      it('should show error when below limit', () => {
        min.setValue(-7);
        max.setValue(-851);
        expect(max.valid).toBeFalsy();
        expect(min.valid).toBeFalsy();
      });

      it('should be invalid', () => {
        min.setValue(10);
        max.setValue(7);
        expect(min.valid).toBeTruthy();
        expect(max.valid).toBeFalsy();
        expect(max.errors).toStrictEqual({
          scopeTotalLowerThanSingleScopes: { min: 10, max: 7 },
        } as ValidationErrors);
      });
      it('should reset error', () => {
        min.setValue(90);
        max.setValue(75);
        min.setValue(31);

        expect(max.valid).toBeTruthy();
        expect(min.valid).toBeTruthy();
      });
      it('should stay invalid', () => {
        min.setValue(10);
        max.setValue(7);
        min.setValue(33);

        expect(max.valid).toBeFalsy();
        expect(max.errors).toStrictEqual({
          scopeTotalLowerThanSingleScopes: { min: 33, max: 7 },
        } as ValidationErrors);
      });

      it('should make controls required by setting min', () => {
        min.setValue(0);

        expect(min.valid).toBe(true);
        expect(max.valid).toBe(false);
        expect(max.errors).toStrictEqual({ dependency: true });
      });
      it('should make controls required by setting max', () => {
        max.setValue(0);

        expect(max.valid).toBe(true);
        expect(min.valid).toBe(false);
        expect(min.errors).toStrictEqual({ dependency: true });
      });
      it('should reset when both fields get reset', () => {
        min.setValue(12);
        max.setValue(78);

        min.reset();
        max.reset();

        expect(max.valid).toBe(true);
        expect(min.valid).toBe(true);
      });
    });
    describe('value changes', () => {
      beforeEach(() => {
        min.reset();
        max.reset();
      });
      it('should set default for max, if field is empty', () => {
        min.setValue(1);
        expect(max.value).toBe(100);
        expect(min.value).toBe(1);
      });
      it('should set default for min, if field is empty', () => {
        max.setValue(98);
        expect(max.value).toBe(98);
        expect(min.value).toBe(0);
      });
      it('should do nothing on reset', () => {
        max.setValue(77);
        min.setValue(55);
        max.reset();
        expect(max.value).toBeFalsy();
        expect(min.value).toBe(55);
      });
    });

    describe('openReferenceDocumentBulkEditDialog', () => {
      it('should close steel dialog and open reference document dialog', () => {
        const dialogData = {
          editDialogInformation: {
            selectedRows: [{ id: 1 }, { id: 2 }],
          },
        };
        Object.defineProperty(component, 'dialogData', {
          value: dialogData,
        });

        component.openReferenceDocumentBulkEditDialog();

        expect(component.dialogRef.close).toHaveBeenCalled();
        expect(
          component['dialogService'].openReferenceDocumentBulkEditDialog
        ).toHaveBeenCalledWith(dialogData.editDialogInformation.selectedRows);
      });
    });
  });
});
