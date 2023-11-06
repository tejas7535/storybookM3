import { CommonModule } from '@angular/common';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import {
  MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA,
  MatLegacyDialogModule as MatDialogModule,
  MatLegacyDialogRef as MatDialogRef,
} from '@angular/material/legacy-dialog';
import { MatLegacySnackBarModule as MatSnackBarModule } from '@angular/material/legacy-snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';

import { of, Subject } from 'rxjs';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { translate, TranslocoModule } from '@ngneat/transloco';
import { PushModule } from '@ngrx/component';
import { provideMockActions } from '@ngrx/effects/testing';
import { TypedAction } from '@ngrx/store/src/models';
import { provideMockStore } from '@ngrx/store/testing';

import { StringOption } from '@schaeffler/inputs';
import { SelectModule } from '@schaeffler/inputs/select';
import { SharedTranslocoModule } from '@schaeffler/transloco';
import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { DataResult, MaterialForm, MaterialFormValue } from '@mac/msd/models';
import { initialState as initialDataState } from '@mac/msd/store/reducers/data/data.reducer';
import { initialState as initialDialogState } from '@mac/msd/store/reducers/dialog/dialog.reducer';
import {
  mockDialogData,
  mockDialogDataMinimized,
  mockDialogDataPartial,
  mockMaterialStandards,
  mockSuppliers,
  mockValue,
} from '@mac/testing/mocks/msd';

import * as en from '../../../../../assets/i18n/en.json';
import { MaterialClass } from '../../constants';
import {
  materialDialogCanceled,
  minimizeDialog,
} from '../../store/actions/dialog';
import { BaseDialogModule } from './base-dialog/base-dialog.module';
import { MaterialInputDialogComponent } from './material-input-dialog.component';
import { MaterialInputDialogModule } from './material-input-dialog.module';
import { DialogControlsService } from './services';

jest.mock('@ngneat/transloco', () => ({
  ...jest.requireActual<TranslocoModule>('@ngneat/transloco'),
  translate: jest.fn((string) => string),
}));

describe('MaterialInputDialogComponent', () => {
  let component: MaterialInputDialogComponent;
  let spectator: Spectator<MaterialInputDialogComponent>;

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

  const createOption = (title: string, id = 7, data?: any) =>
    ({ id, title, data } as StringOption);

  const createComponent = createComponentFactory({
    component: MaterialInputDialogComponent,
    imports: [
      CommonModule,
      MatProgressSpinnerModule,
      PushModule,
      MatIconModule,
      MatButtonModule,
      MatDividerModule,
      MatInputModule,
      MatCheckboxModule,
      MatFormFieldModule,
      SelectModule,
      ReactiveFormsModule,
      MatDialogModule,
      MatGridListModule,
      MatSelectModule,
      MatTooltipModule,
      SharedTranslocoModule,
      MatSnackBarModule,
      MaterialInputDialogModule,
      BaseDialogModule,
      provideTranslocoTestingModule({ en }),
    ],
    providers: [
      provideMockStore({ initialState }),
      provideMockActions(() => of()),
      {
        provide: MatDialogRef,
        useValue: {
          close: jest.fn(),
        },
      },
      DialogControlsService,
      {
        provide: MAT_DIALOG_DATA,
        useValue: {},
      },
    ],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
  });

  describe('check initial form values', () => {
    it('should have the expected values', () => {
      expect(component.manufacturerSupplierIdControl.value).toEqual(undefined);
      expect(component.materialStandardIdControl.value).toEqual(undefined);
      expect(component.standardDocumentsControl.value).toEqual(undefined);
      expect(component.materialNamesControl.value).toEqual(undefined);
      expect(component.categoriesControl.value).toEqual(undefined);
      expect(component.co2Scope1Control.value).toEqual(undefined);
      expect(component.co2Scope2Control.value).toEqual(undefined);
      expect(component.co2Scope3Control.value).toEqual(undefined);
      expect(component.co2TotalControl.value).toEqual(undefined);
      expect(component.co2ClassificationControl.value).toEqual(undefined);
      expect(component.releaseRestrictionsControl.value).toEqual(undefined);
    });
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    describe('dialogError', () => {
      it('should call the handle function on error', () => {
        component.handleDialogError = jest.fn();

        const mockSubject = new Subject<boolean>();
        component.dialogError$ = mockSubject;

        component.ngOnInit();

        mockSubject.next(true);

        expect(component.handleDialogError).toHaveBeenCalled();
      });
    });
  });

  describe('ngAfterViewInit', () => {
    afterEach(() => {
      component['dialogData'].editDialogInformation = undefined;
      component['dialogData'].isResumeDialog = undefined;
      component['dialogFacade'].resumeDialogData$ = undefined;
    });
    describe('with full material', () => {
      let mockSubject: Subject<any>;
      beforeEach(() => {
        component['dialogData'].editDialogInformation = {
          row: mockDialogData.editMaterial.row,
          column: mockDialogData.editMaterial.column,
        };
        mockSubject = new Subject<any>();
        component['dialogFacade'].resumeDialogData$ = mockSubject;
        component.createMaterialForm = new FormGroup<MaterialForm>(
          {} as MaterialForm
        );
      });

      it('should prepare the form', () => {
        component['dialogFacade'].dispatch = jest.fn();

        component.supplierPlantControl.enable = jest.fn();
        component.supplierCountryControl.enable = jest.fn();

        component.co2ClassificationControl.enable = jest.fn();

        component.createMaterialForm.patchValue = jest.fn();
        component.createMaterialForm.markAllAsTouched = jest.fn();

        component['cdRef'].markForCheck = jest.fn();
        component['cdRef'].detectChanges = jest.fn();

        component.ngAfterViewInit();
        mockSubject.next({ editMaterial: mockDialogData.editMaterial });
        expect(component.supplierPlantControl.enable).toHaveBeenCalled();
        expect(component.supplierCountryControl.enable).not.toHaveBeenCalled();
        expect(component.co2ClassificationControl.enable).toHaveBeenCalled();
        expect(component.createMaterialForm.patchValue).toHaveBeenCalledWith(
          mockDialogData.editMaterial.parsedMaterial
        );
        expect(
          component.createMaterialForm.markAllAsTouched
        ).toHaveBeenCalled();

        expect(component['cdRef'].markForCheck).toHaveBeenCalled();
        expect(component['cdRef'].detectChanges).toHaveBeenCalled();
      });
    });

    describe('without co2 value and parsable reference document', () => {
      let mockSubject: Subject<any>;
      beforeEach(() => {
        component['dialogData'].editDialogInformation = {
          row: mockDialogDataPartial.editMaterial.row,
          column: mockDialogDataPartial.editMaterial.column,
        };
        mockSubject = new Subject<any>();
        component['dialogFacade'].resumeDialogData$ = mockSubject;
        component.createMaterialForm = new FormGroup<MaterialForm>(
          {} as MaterialForm
        );
      });

      it('should prepare the form', () => {
        component['dialogFacade'].dispatch = jest.fn();

        component.supplierPlantControl.enable = jest.fn();
        component.supplierCountryControl.enable = jest.fn();

        component.co2ClassificationControl.enable = jest.fn();

        component.createMaterialForm.patchValue = jest.fn();
        component.createMaterialForm.markAllAsTouched = jest.fn();

        component['cdRef'].markForCheck = jest.fn();
        component['cdRef'].detectChanges = jest.fn();

        component.ngAfterViewInit();
        mockSubject.next({ editMaterial: mockDialogDataPartial.editMaterial });

        expect(component.supplierPlantControl.enable).toHaveBeenCalled();
        expect(component.supplierCountryControl.enable).not.toHaveBeenCalled();
        expect(
          component.co2ClassificationControl.enable
        ).not.toHaveBeenCalled();
        expect(component.createMaterialForm.patchValue).toHaveBeenCalledWith(
          mockDialogDataPartial.editMaterial.parsedMaterial
        );
        expect(
          component.createMaterialForm.markAllAsTouched
        ).toHaveBeenCalled();

        expect(component['cdRef'].markForCheck).toHaveBeenCalled();
        expect(component['cdRef'].detectChanges).toHaveBeenCalled();
      });
    });

    describe('with minimized dialog', () => {
      let mockSubject: Subject<any>;
      beforeEach(() => {
        component['dialogData'].isResumeDialog = true;
        mockSubject = new Subject<any>();
        component['dialogFacade'].resumeDialogData$ = mockSubject;
        component.createMaterialForm = new FormGroup<MaterialForm>(
          {} as MaterialForm
        );
      });

      it('should prepare the form', () => {
        component['dialogFacade'].dispatch = jest.fn();

        component.supplierPlantControl.enable = jest.fn();
        component.supplierCountryControl.enable = jest.fn();

        component.co2ClassificationControl.enable = jest.fn();

        component.createMaterialForm.patchValue = jest.fn();
        component.createMaterialForm.markAllAsTouched = jest.fn();

        component['cdRef'].markForCheck = jest.fn();
        component['cdRef'].detectChanges = jest.fn();

        component.ngAfterViewInit();
        mockSubject.next({
          minimizedDialog: mockDialogDataMinimized.minimizedDialog,
        });

        expect(component.supplierPlantControl.enable).toHaveBeenCalled();
        expect(component.supplierCountryControl.enable).not.toHaveBeenCalled();
        expect(
          component.co2ClassificationControl.enable
        ).not.toHaveBeenCalled();
        expect(component.createMaterialForm.patchValue).toHaveBeenCalledWith(
          mockValue
        );
        expect(
          component.createMaterialForm.markAllAsTouched
        ).toHaveBeenCalled();

        expect(component['cdRef'].markForCheck).toHaveBeenCalled();
        expect(component['cdRef'].detectChanges).toHaveBeenCalled();
      });
    });
  });

  describe('ngOnDestory', () => {
    it('should complete the observable', () => {
      component.destroy$.next = jest.fn();
      component.destroy$.complete = jest.fn();

      component.ngOnDestroy();

      expect(component.destroy$.next).toHaveBeenCalled();
      expect(component.destroy$.complete).toHaveBeenCalled();
    });
  });

  describe('handleDialogError', () => {
    it('should call the showInSnackbar and cancelDialog', () => {
      component['snackbar'].error = jest.fn();
      component.cancelDialog = jest.fn();

      component.handleDialogError();

      expect(component['snackbar'].error).toHaveBeenCalled();
      expect(component.cancelDialog).toHaveBeenCalled();
    });
  });

  describe('cancelDialog', () => {
    const mockSubjectClose = new Subject<{ action: TypedAction<any> }>();

    it('should call closeDialog', () => {
      component['dialogRef'].close = jest.fn();
      component['dialogRef'].afterClosed = jest.fn(() => mockSubjectClose);

      component.cancelDialog();
      mockSubjectClose.next({ action: materialDialogCanceled() });
      expect(component['dialogRef'].close).toHaveBeenCalledWith({
        action: materialDialogCanceled(),
      });
    });
  });

  describe('minimizeDialog', () => {
    const mockSubjectClose = new Subject<{ action: TypedAction<any> }>();

    it('should close the dialog ref with the minimize value', () => {
      component['dialogRef'].close = jest.fn();
      component['dialogRef'].afterClosed = jest.fn(() => mockSubjectClose);

      component.createMaterialForm = new FormGroup({} as MaterialForm);
      component.createMaterialForm.getRawValue = jest.fn(
        () => ({} as unknown as any)
      );
      component['isCopy'] = true;

      component.minimizeDialog();

      expect(component.createMaterialForm.getRawValue).toHaveBeenCalled();
      expect(component['dialogRef'].close).toHaveBeenCalledWith({
        action: minimizeDialog({
          id: undefined,
          value: {},
          isCopy: true,
        }),
      });
    });
  });

  describe('enableEditFields', () => {
    it('should enable nothing', () => {
      component.supplierPlantControl.enable = jest.fn();
      component.supplierCountryControl.enable = jest.fn();
      component.co2ClassificationControl.enable = jest.fn();

      component.enableEditFields({});

      expect(component.co2ClassificationControl.enable).not.toHaveBeenCalled();
      expect(component.supplierCountryControl.enable).not.toHaveBeenCalled();
      expect(component.supplierPlantControl.enable).not.toHaveBeenCalled();
    });

    it('should enable supplier plant', () => {
      const mockFormValue: Partial<MaterialFormValue> = {
        supplier: { id: 1, title: 'supplier' },
      };
      component.supplierPlantControl.enable = jest.fn();

      component.enableEditFields(mockFormValue);

      expect(component.supplierPlantControl.enable).toHaveBeenCalled();
    });

    it('should enable supplier country', () => {
      const mockFormValue: Partial<MaterialFormValue> = {
        manufacturerSupplierId: undefined,
        supplierPlant: { id: 1, title: 'plant' },
      };
      component.supplierCountryControl.enable = jest.fn();

      component.enableEditFields(mockFormValue);

      expect(component.supplierCountryControl.enable).toHaveBeenCalled();
    });

    it('should enable co2 classifications', () => {
      const mockFormValue: Partial<MaterialFormValue> = {
        co2PerTon: 1,
      };
      component.co2ClassificationControl.enable = jest.fn();

      component.enableEditFields(mockFormValue);

      expect(component.co2ClassificationControl.enable).toHaveBeenCalled();
    });
  });

  describe('isEditDialog', () => {
    describe('with editMaterialInformation', () => {
      beforeEach(() => {
        component.materialId = undefined;
        component.dialogData.editDialogInformation = undefined;
      });

      it('should return true if editDialogInformation is set', () => {
        expect(component.isEditDialog()).toBe(false);
      });
    });

    it('should return true if materialId is set', () => {
      component.materialId = 1;

      expect(component.isEditDialog()).toBe(true);
    });

    it('should return false if materialId and editMaterialInformation is not set', () => {
      component.dialogData.editDialogInformation = {
        row: {} as DataResult,
        column: 'x',
      };

      expect(component.isEditDialog()).toBe(true);
    });
  });

  describe('isAddDialog', () => {
    describe('with editMaterialInformation', () => {
      beforeEach(() => {
        component['isCopy'] = false;
        component['isBulkEdit'] = false;
        component['materialId'] = 0;
        component.dialogData.editDialogInformation = undefined;
      });

      it('should return true on default', () => {
        expect(component.isAddDialog()).toBe(true);
      });
    });

    it('should return false if materialId is set', () => {
      component.materialId = 1;

      expect(component.isAddDialog()).toBe(false);
    });
    it('should return false if isCopy is true', () => {
      component['isCopy'] = true;

      expect(component.isAddDialog()).toBe(false);
    });
    it('should return false if isBulkEdit is true', () => {
      component['isBulkEdit'] = true;

      expect(component.isAddDialog()).toBe(false);
    });
  });

  describe('isCopyDialog', () => {
    it('should return false if materialId is set', () => {
      component.materialId = 1;
      component['isCopy'] = true;

      const result = component.isCopyDialog();

      expect(result).toBe(false);
    });

    it('should return false if isCopy property is false', () => {
      component.materialId = undefined;
      component['isCopy'] = false;

      const result = component.isCopyDialog();

      expect(result).toBe(false);
    });

    it('should return true if materialId is not set and isCopy is true', () => {
      component.materialId = undefined;
      component['isCopy'] = true;

      const result = component.isCopyDialog();

      expect(result).toBe(true);
    });
  });

  describe('getTitle', () => {
    beforeEach(() => {
      component.materialClass = MaterialClass.COPPER;
      component.countSelected = 3;
    });
    it('should return the bulkUpdate title', () => {
      component.isEditDialog = jest.fn(() => true);
      component.isCopyDialog = jest.fn(() => false);
      component['isBulkEdit'] = true;

      const result = component.getTitle();

      expect(translate).toHaveBeenCalledWith(
        'materialsSupplierDatabase.mainTable.dialog.bulkUpdateTitle',
        {
          class: 'materialsSupplierDatabase.materialClassValues.cu',
          count: 3,
        }
      );

      expect(result).toEqual(
        'materialsSupplierDatabase.mainTable.dialog.bulkUpdateTitle'
      );
    });

    it('should return the update title', () => {
      component.isEditDialog = jest.fn(() => true);
      component.isCopyDialog = jest.fn(() => false);
      component['isBulkEdit'] = false;

      const result = component.getTitle();

      expect(translate).toHaveBeenCalledWith(
        'materialsSupplierDatabase.mainTable.dialog.updateTitle',
        { class: 'materialsSupplierDatabase.materialClassValues.cu' }
      );

      expect(result).toEqual(
        'materialsSupplierDatabase.mainTable.dialog.updateTitle'
      );
    });

    it('should return the add title', () => {
      component.isEditDialog = jest.fn(() => false);
      component.isCopyDialog = jest.fn(() => false);
      component['isBulkEdit'] = false;

      const result = component.getTitle();

      expect(translate).toHaveBeenCalledWith(
        'materialsSupplierDatabase.mainTable.dialog.addTitle',
        { class: 'materialsSupplierDatabase.materialClassValues.cu' }
      );
      expect(result).toEqual(
        'materialsSupplierDatabase.mainTable.dialog.addTitle'
      );
    });

    it('should return the add title if dialog is a copy', () => {
      component.isEditDialog = jest.fn(() => true);
      component.isCopyDialog = jest.fn(() => true);
      component['isBulkEdit'] = false;

      const result = component.getTitle();

      expect(translate).toHaveBeenCalledWith(
        'materialsSupplierDatabase.mainTable.dialog.addTitle',
        { class: 'materialsSupplierDatabase.materialClassValues.cu' }
      );
      expect(result).toEqual(
        'materialsSupplierDatabase.mainTable.dialog.addTitle'
      );
    });
  });

  describe('compareWithId', () => {
    it('should return true if the id is equal', () => {
      const mockOption1 = createOption('a', 1);
      const mockOption2 = createOption('b', 1);

      expect(component.compareWithId(mockOption1, mockOption2)).toBe(true);
    });

    it('should return false if the id is not equal', () => {
      const mockOption1 = createOption('a', 1);
      const mockOption2 = createOption('a', 2);

      expect(component.compareWithId(mockOption1, mockOption2)).toBe(false);
    });
  });

  describe('getColumn', () => {
    it('should return column if available', () => {
      const column = 'example';
      component['dialogData'].editDialogInformation = {
        row: undefined,
        column,
      };

      expect(component.getColumn()).toBe(column);
    });

    it('should return undefined if not an edit dialog', () => {
      component['dialogData'].editDialogInformation = undefined;

      expect(component.getColumn()).toBeFalsy();
    });
  });

  describe('getHint', () => {
    const hintData = {
      update: { value: 2 },
      prefilled: { value: 1, updated: 0 },
      unchanged: { unique: 2 },
      delete: { unique: 1 },
      nodata: {},
    };
    it('should return no hint without hint data', () => {
      expect(component.getHint(undefined, 'update')).toBeFalsy();
    });
    it('should return no hint for preset data', () => {
      expect(component.getHint(hintData, 'prefilled')).toBeFalsy();
    });
    it('should return hint for data update', () => {
      const translation =
        'materialsSupplierDatabase.mainTable.dialog.hint.info_update';
      expect(component.getHint(hintData, 'update')).toStrictEqual(translation);
    });
    it('should return hint for no changes', () => {
      const translation =
        'materialsSupplierDatabase.mainTable.dialog.hint.info_unique';
      expect(component.getHint(hintData, 'unchanged')).toStrictEqual(
        translation
      );
    });
    it('should return hint for no data available', () => {
      expect(component.getHint(hintData, 'nodata')).toBeFalsy();
    });
    it('should return hint for delete', () => {
      const translation =
        'materialsSupplierDatabase.mainTable.dialog.hint.info_delete';

      expect(component.getHint(hintData, 'delete')).toStrictEqual(translation);
    });
  });

  describe('isValidDialog', () => {
    let form = {
      controls: {},
      valid: true,
    };
    beforeEach(() => {
      component['isBulkEdit'] = false;
      form = {
        controls: {},
        valid: true,
      };
      component.createMaterialForm = form as FormGroup;
    });
    it('should be valid dialog on default', () => {
      expect(component.isValidDialog()).toBeTruthy();
    });
    it('should be invalid dialog on with no bulk edit and invalid form', () => {
      form.valid = false;

      expect(component.isValidDialog()).toBeFalsy();
    });
    it('should be valid dialog on with bulk edit and valid form', () => {
      component['isBulkEdit'] = true;
      expect(component.isValidDialog()).toBeTruthy();
    });

    it('should be valid dialog on with bulk edit and reuired form', () => {
      component['isBulkEdit'] = true;
      form.controls = {
        test1: {
          errors: { required: true },
        },
      };
      expect(component.isValidDialog()).toBeTruthy();
    });
    it('should be invalid dialog on with bulk edit and invalid form', () => {
      component['isBulkEdit'] = true;
      form.controls = {
        test1: {
          errors: { required: true },
        },
        test2: {
          errors: { anythg: true },
        },
      };
      expect(component.isValidDialog()).toBeFalsy();
    });
  });

  describe('listToJson', () => {
    it('should return list', () => {
      expect(component['listToJson']([1, 2, 3])).toStrictEqual([1, 2, 3]);
    });
    it('should return undefined', () => {
      expect(component['listToJson']([])).toBeFalsy();
    });
  });
});
