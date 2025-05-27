import {
  CUSTOM_ELEMENTS_SCHEMA,
  Injectable,
  NO_ERRORS_SCHEMA,
} from '@angular/core';
import {
  FormControl,
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
import { provideMockStore } from '@ngrx/store/testing';
import moment from 'moment';
import { MockDirective, MockModule, MockPipe, MockProvider } from 'ng-mocks';

import { SelectedFile } from '@schaeffler/file-upload';
import { SelectModule } from '@schaeffler/inputs/select';
import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import {
  NONE_OPTION,
  SCHAEFFLER_EXPERTS_CALCULATION_TOOL_OPTION,
  SCHAEFFLER_EXPERTS_OPTION,
  SCHAEFFLER_EXPERTS_PCF_OPTION,
  THIRD_PARTY_VERIFIED_OPTION,
} from '@mac/feature/materials-supplier-database/constants/co2-classification-options';
import { MsdDialogService } from '@mac/feature/materials-supplier-database/services';
import { DialogFacade } from '@mac/feature/materials-supplier-database/store/facades/dialog';
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
import { SteelInputDialogComponent } from './steel-input-dialog.component';

@Injectable()
class MockDialogFacade extends DialogFacade {
  addCustomCastingDiameter = jest.fn();
  addCustomReferenceDocument = jest.fn();
  fetchCastingDiameters = jest.fn();
  materialDialogConfirmed = jest.fn();
  updateCreateMaterialDialogValues = jest.fn();
  addCustomCo2Standard = jest.fn();
}

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
  const matDialogData = {};
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
      minRecyclingRateControl: new FormControl(undefined, [
        Validators.min(0),
        Validators.max(100),
      ]),
      maxRecyclingRateControl: new FormControl(undefined, [
        Validators.min(0),
        Validators.max(100),
      ]),
      supplierIronSteelManufacturerControl: getMockControl(false),
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
      it('should define min year for calendar filter', () => {
        expect(component['CALENDAR_FILTER_MIN_YEAR']).toBe(2020);
      });
      it('should max year for calendar filter', () => {
        const curYear = new Date().getFullYear();
        expect(component['CALENDAR_FILTER_MAX_YEAR']).toEqual(curYear + 1);
      });
    });
  });

  describe('updateCreateMaterialDialogValues', () => {
    afterAll(() => jest.useRealTimers());
    it('should assign the material form', () => {
      jest.useFakeTimers();
      component.minDimControl.setValue(99);

      // 🔦 to make tests less brittle, wait for the task to finish with `runOnlyPendingTimers` or `runOnlyPendingTimers` instead of advancing the time with `advanceTimersByTime`.
      // This makes sure that the test isn't impacted when the duration is modified.
      jest.advanceTimersByTime(1000);
      jest.runOnlyPendingTimers();

      expect(
        dialogFacade.updateCreateMaterialDialogValues
      ).toHaveBeenCalledWith({
        ...component.createMaterialForm.value,
        reportValidUntil:
          component.reportValidUntilControlMoment.value?.format('YYYY-MM-DD'),
        co2UploadFile: undefined,
      });
    });
  });

  describe('supplierIronSteelManufacturerControl', () => {
    beforeEach(() => {
      component.supplierPlantControl.patchValue(
        createOption('plant', 1, { manufacturer: true })
      );
    });
    it('should unset and disable manufacturer with empty supplier data', () => {
      component.supplierPlantControl.reset();
      expect(
        component.supplierIronSteelManufacturerControl.enabled
      ).toBeFalsy();
      expect(component.supplierIronSteelManufacturerControl.value).toBeFalsy();
    });
    it('should set and disable manufacturer for existing supplier', () => {
      const option = createOption('plant', 2, { manufacturer: true });
      component.supplierPlantControl.patchValue(option);
      expect(
        component.supplierIronSteelManufacturerControl.enabled
      ).toBeFalsy();
      expect(component.supplierIronSteelManufacturerControl.value).toBeTruthy();
    });
    it('should unset and disable manufacturer for existing supplier', () => {
      const option = createOption('plant', 2, { manufacturer: false });
      component.supplierPlantControl.patchValue(option);
      expect(
        component.supplierIronSteelManufacturerControl.enabled
      ).toBeFalsy();
      expect(component.supplierIronSteelManufacturerControl.value).toBeFalsy();
    });
    it('should enable manufacturerControl for new supplier', () => {
      const option = createOption('plant');
      component.supplierPlantControl.patchValue(option);
      expect(
        component.supplierIronSteelManufacturerControl.enabled
      ).toBeTruthy();
      expect(component.supplierIronSteelManufacturerControl.value).toBeFalsy();
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

  describe('getCo2ClassificationsNew', () => {
    it('should return the co2Classifications', () => {
      const result = component.co2ClassificationsNew;
      expect(result).toEqual([
        THIRD_PARTY_VERIFIED_OPTION,
        SCHAEFFLER_EXPERTS_OPTION,
        NONE_OPTION,
      ]);
    });
  });

  describe('getCo2ClassificationsNewSecondary', () => {
    it('should return the co2Classifications', () => {
      const result = component.co2ClassificationsNewSecondary;
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

  describe('releaseDateControls', () => {
    beforeEach(() => {
      component.releaseDateControl.addValidators = jest.fn();
      component.releaseDateControl.removeValidators = jest.fn();
      component.releaseDateControl.reset = jest.fn();
      component.releaseDateControlMoment.reset = jest.fn();
      component.releaseDateControlMoment.enable = jest.fn();
      component.releaseDateControlMoment.disable = jest.fn();
      component.releaseDateControlMoment.addValidators = jest.fn();
      component.releaseDateControlMoment.removeValidators = jest.fn();
    });
    it('should check initial state', () => {
      expect(
        component.releaseDateControl.hasValidator(Validators.required)
      ).toBeTruthy();
      expect(
        component.releaseDateControlMoment.hasValidator(Validators.required)
      ).toBeTruthy();
      expect(component.isHistoricSupplierControl.value).toBeFalsy();
    });
    it('should disable releasedate control for historic supplier', () => {
      component.isHistoricSupplierControl.setValue(true);

      expect(component.releaseDateControl.removeValidators).toHaveBeenCalled();
      expect(component.releaseDateControl.addValidators).not.toHaveBeenCalled();
      expect(
        component.releaseDateControlMoment.removeValidators
      ).toHaveBeenCalled();
      expect(
        component.releaseDateControlMoment.addValidators
      ).not.toHaveBeenCalled();
      expect(component.releaseDateControlMoment.disable).toHaveBeenCalled();
      expect(component.releaseDateControlMoment.reset).toHaveBeenCalled();
      expect(component.releaseDateControl.value).toBeFalsy();
    });
    it('should enable the releasedate control for non-historic supplier', () => {
      component.isHistoricSupplierControl.setValue(false);

      expect(
        component.releaseDateControl.removeValidators
      ).not.toHaveBeenCalled();
      expect(component.releaseDateControl.addValidators).toHaveBeenCalled();
      expect(
        component.releaseDateControlMoment.removeValidators
      ).not.toHaveBeenCalled();
      expect(
        component.releaseDateControlMoment.addValidators
      ).toHaveBeenCalled();
      expect(component.releaseDateControlMoment.disable).not.toHaveBeenCalled();
      expect(component.releaseDateControlMoment.reset).not.toHaveBeenCalled();
      expect(component.releaseDateControl.value).toBeTruthy();
    });
    it('should transfer the releasedate control value to the form', () => {
      const date = '20230403';
      component.releaseDateControlMoment.setValue(moment(date, 'YYYYMMDD'));

      expect(component.releaseDateControl.value).toBe(
        Number.parseInt(date, 10)
      );
    });
    it('should reset the releasedate control value to the form', () => {
      component.releaseDateControlMoment.setValue(moment(), {
        emitEvent: false,
      });
      component.releaseDateControlMoment.setValue(undefined);

      expect(component.releaseDateControl.reset).toHaveBeenCalled();
    });
  });

  describe('patchFields', () => {
    beforeEach(() => {
      component.isHistoricSupplierControl.setValue(false, { emitEvent: false });
      component.releaseDateControlMoment.setValue(undefined, {
        emitEvent: false,
      });
    });
    it('should preset release date', () => {
      const date = '20230403';
      const form = {
        releaseDate: Number.parseInt(date, 10),
      };
      component.patchFields(form);

      expect(
        component.releaseDateControlMoment.value.isSame(
          moment(date, 'YYYYMMDD')
        )
      ).toBeTruthy();
      expect(component.isHistoricSupplierControl.value).toBeFalsy();
    });
    it('should preset historic', () => {
      component.patchFields({});

      expect(component.isHistoricSupplierControl.value).toBeTruthy();
    });
    it('should not preset historic on bulk edit', () => {
      component.isBulkEditDialog.set(true);
      component.patchFields({});

      expect(component.isHistoricSupplierControl.value).toBeFalsy();
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
