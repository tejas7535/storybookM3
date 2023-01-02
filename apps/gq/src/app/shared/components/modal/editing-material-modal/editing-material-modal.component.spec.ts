import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MATERIAL_SANITY_CHECKS } from '@angular/material/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';

import { createComponentFactory, Spectator } from '@ngneat/spectator';
import { PushModule } from '@ngrx/component';
import { provideMockStore } from '@ngrx/store/testing';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import {
  CREATE_CASE_STORE_STATE_MOCK,
  MATERIAL_TABLE_ITEM_MOCK,
  PROCESS_CASE_STATE_MOCK,
} from '../../../../../testing/mocks';
import { MaterialColumnFields } from '../../../ag-grid/constants/column-fields.enum';
import { ValidationDescription } from '../../../models/table';
import { AutocompleteInputComponent } from '../../autocomplete-input/autocomplete-input.component';
import { AutocompleteInputModule } from '../../autocomplete-input/autocomplete-input.module';
import { AutocompleteRequestDialog } from '../../autocomplete-input/autocomplete-request-dialog.enum';
import { DialogHeaderModule } from '../../header/dialog-header/dialog-header.module';
import { EditingMaterialModalComponent } from './editing-material-modal.component';

describe('EditingMaterialModalComponent', () => {
  let component: EditingMaterialModalComponent;
  let spectator: Spectator<EditingMaterialModalComponent>;

  const createComponent = createComponentFactory({
    component: EditingMaterialModalComponent,
    imports: [
      AutocompleteInputModule,
      MatInputModule,
      DialogHeaderModule,
      PushModule,
      ReactiveFormsModule,
      provideTranslocoTestingModule({ en: {} }),
    ],
    providers: [
      provideMockStore({
        initialState: {
          processCase: PROCESS_CASE_STATE_MOCK,
          case: CREATE_CASE_STORE_STATE_MOCK,
        },
      }),
      { provide: MATERIAL_SANITY_CHECKS, useValue: false },
      {
        provide: MAT_DIALOG_DATA,
        useValue: {
          material: MATERIAL_TABLE_ITEM_MOCK,
          field: MaterialColumnFields.MATERIAL,
        },
      },
      {
        provide: MatDialogRef,
        useValue: {},
      },
    ],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.component;
  });
  test('should create', () => {
    expect(component).toBeTruthy();

    expect(component['materialToEdit']).toEqual(MATERIAL_TABLE_ITEM_MOCK);
    expect(component['fieldToFocus']).toEqual(MaterialColumnFields.MATERIAL);
  });

  describe('ngOnInit', () => {
    test('should init component', () => {
      component.autoCompleteFacade.resetView = jest.fn();
      component.autoCompleteFacade.initFacade = jest.fn();

      component.ngOnInit();

      expect(component.autoCompleteFacade.resetView).toHaveBeenCalledTimes(1);
      expect(component.autoCompleteFacade.initFacade).toHaveBeenCalledWith(
        AutocompleteRequestDialog.EDIT_MATERIAL
      );
    });
  });

  describe('afterViewInit', () => {
    test('should init', () => {
      component.ngAfterViewInit();
      expect(true).toBeTruthy();
    });
  });

  describe('ngAfterViewInit', () => {
    let editFormGroupQuantity: FormGroup;
    let materialNumberAutocomplete: AutocompleteInputComponent;
    let materialDescriptionAutocomplete: AutocompleteInputComponent;

    beforeEach(() => {
      editFormGroupQuantity = {
        setValue: jest.fn(),
      } as any;

      materialNumberAutocomplete = {
        searchFormControl: {
          setValue: jest.fn(),
        },
        focus: jest.fn(),
      } as any;
      materialDescriptionAutocomplete = {
        searchFormControl: {
          setValue: jest.fn(),
        },
        focus: jest.fn(),
      } as any;
      component.matDescInput = materialDescriptionAutocomplete;
      component.matNumberInput = materialNumberAutocomplete;
    });
    test('should set form values', () => {
      component.editFormGroup.get = jest
        .fn()
        .mockReturnValue(editFormGroupQuantity);

      component.ngAfterViewInit();

      expect(component.editFormGroup.get).toHaveBeenCalledTimes(2);
      expect(component.editFormGroup.get).toHaveBeenCalledWith(
        MaterialColumnFields.QUANTITY
      );
      expect(editFormGroupQuantity.setValue).toHaveBeenCalledTimes(1);
      expect(editFormGroupQuantity.setValue).toHaveBeenCalledWith(
        MATERIAL_TABLE_ITEM_MOCK.quantity
      );
      expect(
        materialDescriptionAutocomplete.searchFormControl.setValue
      ).toBeCalledTimes(1);
      expect(
        materialDescriptionAutocomplete.searchFormControl.setValue
      ).toHaveBeenCalledWith(MATERIAL_TABLE_ITEM_MOCK.materialDescription);
      expect(
        materialNumberAutocomplete.searchFormControl.setValue
      ).toBeCalledTimes(1);
      expect(
        materialNumberAutocomplete.searchFormControl.setValue
      ).toHaveBeenCalledWith(MATERIAL_TABLE_ITEM_MOCK.materialNumber);
    });
    test('should detect changes', () => {
      component['cdref'].detectChanges = jest.fn();

      component.ngAfterViewInit();

      expect(component['cdref'].detectChanges).toHaveBeenCalledTimes(1);
    });
    describe('should focus input fields', () => {
      beforeEach(() => {
        component.valueInput.nativeElement.focus = jest.fn();
      });
      test('should focus materialNumberInput', () => {
        component.ngAfterViewInit();

        expect(materialNumberAutocomplete.focus).toHaveBeenCalledTimes(1);
        expect(materialDescriptionAutocomplete.focus).toHaveBeenCalledTimes(0);
        expect(component.valueInput.nativeElement.focus).toHaveBeenCalledTimes(
          0
        );
      });
      test('should focus materialDescription', () => {
        Object.defineProperty(component, 'fieldToFocus', {
          value: MaterialColumnFields.MATERIAL_DESCRIPTION,
        });

        component.ngAfterViewInit();

        expect(materialDescriptionAutocomplete.focus).toHaveBeenCalledTimes(1);
        expect(materialNumberAutocomplete.focus).toHaveBeenCalledTimes(0);
        expect(component.valueInput.nativeElement.focus).toHaveBeenCalledTimes(
          0
        );
      });
      test('should focus quantity', () => {
        Object.defineProperty(component, 'fieldToFocus', {
          value: MaterialColumnFields.QUANTITY,
        });

        component.ngAfterViewInit();

        expect(materialDescriptionAutocomplete.focus).toHaveBeenCalledTimes(0);
        expect(materialNumberAutocomplete.focus).toHaveBeenCalledTimes(0);
        expect(component.valueInput.nativeElement.focus).toHaveBeenCalledTimes(
          1
        );
      });
    });
  });

  describe('ngOnDestroy', () => {
    test('should unsubscribe', () => {
      component['subscription'].unsubscribe = jest.fn();

      component.ngOnDestroy();

      expect(component['subscription'].unsubscribe).toHaveBeenCalledTimes(1);
    });
  });
  describe('inputValidation', () => {
    describe('materialInputValid', () => {
      test('should set materialNumberisValid true', () => {
        component.rowInputValid = jest.fn();
        component.materialInputValid(true);

        expect(component.materialInputIsValid).toBeTruthy();
        expect(component.rowInputValid).toHaveBeenCalledTimes(1);
      });
      test('should set materialNumberisValid false', () => {
        component.rowInputValid = jest.fn();
        component.materialInputValid(false);

        expect(component.materialInputIsValid).toBeFalsy();
        expect(component.rowInputValid).toHaveBeenCalledTimes(1);
      });
    });
    describe('materialHasInput', () => {
      test('should set materialNumberInput', () => {
        component.rowInputValid = jest.fn();
        component.materialNumberInput = false;

        component.materialHasInput(true);

        expect(component.materialNumberInput).toBeTruthy();
        expect(component.rowInputValid).toHaveBeenCalledTimes(1);
      });
    });
    describe('rowInputValid', () => {
      test('should set addRowEnabled to true', () => {
        component.materialInputIsValid = true;
        component.materialNumberInput = true;
        component.editFormGroup = { valid: true } as any;
        component.inputHasChanged = jest.fn().mockReturnValue(true);

        component.rowInputValid();

        expect(component.updateRowEnabled).toBeTruthy();
      });

      test('should set addRowEnabled to false', () => {
        component.materialInputIsValid = true;
        component.materialNumberInput = true;
        component.editFormGroup = { valid: true } as any;
        component.inputHasChanged = jest.fn().mockReturnValue(false);

        component.rowInputValid();

        expect(component.updateRowEnabled).toBeFalsy();
      });
    });

    describe('inputHasChanged', () => {
      test('should return false for no changes', () => {
        component.matDescInput = {
          valueInput: {
            nativeElement: {
              value: MATERIAL_TABLE_ITEM_MOCK.materialDescription,
            },
          },
        } as any;
        component.matNumberInput = {
          valueInput: {
            nativeElement: {
              value: MATERIAL_TABLE_ITEM_MOCK.materialNumber,
            },
          },
        } as any;
        component.editFormGroup.get = jest
          .fn()
          .mockReturnValue({ value: MATERIAL_TABLE_ITEM_MOCK.quantity });

        expect(component.inputHasChanged()).toBeFalsy();
      });
      test('should return true for changed matDesc', () => {
        component.matDescInput = {
          valueInput: {
            nativeElement: {
              value: 'newDesc',
            },
          },
        } as any;
        component.matNumberInput = {
          valueInput: {
            nativeElement: {
              value: MATERIAL_TABLE_ITEM_MOCK.materialNumber,
            },
          },
        } as any;
        component.editFormGroup.get = jest
          .fn()
          .mockReturnValue({ value: MATERIAL_TABLE_ITEM_MOCK.quantity });

        expect(component.inputHasChanged()).toBeTruthy();
      });
      test('should return true for changed matNumber', () => {
        component.matDescInput = {
          valueInput: {
            nativeElement: {
              value: MATERIAL_TABLE_ITEM_MOCK.materialDescription,
            },
          },
        } as any;
        component.matNumberInput = {
          valueInput: {
            nativeElement: {
              value: 'newMatNumber',
            },
          },
        } as any;
        component.editFormGroup.get = jest
          .fn()
          .mockReturnValue({ value: MATERIAL_TABLE_ITEM_MOCK.quantity });

        expect(component.inputHasChanged()).toBeTruthy();
      });
      test('should return true for changed quantity', () => {
        component.matDescInput = {
          valueInput: {
            nativeElement: {
              value: MATERIAL_TABLE_ITEM_MOCK.materialDescription,
            },
          },
        } as any;
        component.matNumberInput = {
          valueInput: {
            nativeElement: {
              value: MATERIAL_TABLE_ITEM_MOCK.materialNumber,
            },
          },
        } as any;
        component.editFormGroup.get = jest
          .fn()
          .mockReturnValue({ value: 'newQuantity' });

        expect(component.inputHasChanged()).toBeTruthy();
      });
    });
  });

  describe('closeDialog', () => {
    test('should close dialog', () => {
      component.autoCompleteFacade.resetView = jest.fn();

      component['dialogRef'].close = jest.fn();

      component.closeDialog();

      expect(component.autoCompleteFacade.resetView).toHaveBeenCalledTimes(1);
      expect(component['dialogRef'].close).toHaveBeenCalledTimes(1);
    });
  });

  describe('update', () => {
    test('should close dialog with updated material', () => {
      component['dialogRef'].close = jest.fn();
      component.matDescInput = {
        valueInput: {
          nativeElement: {
            value: 'newDesc',
          },
        },
      } as any;
      component.matNumberInput = {
        valueInput: {
          nativeElement: {
            value: 'newNumber',
          },
        },
      } as any;
      component.editFormGroup.get = jest
        .fn()
        .mockReturnValue({ value: 'newQuantity' });

      component.update();

      expect(component['dialogRef'].close).toHaveBeenCalledTimes(1);
      expect(component['dialogRef'].close).toHaveBeenCalledWith({
        materialDescription: 'newDesc',
        materialNumber: 'newNumber',
        quantity: 'newQuantity',
        id: MATERIAL_TABLE_ITEM_MOCK.id,
        info: { valid: true, description: [ValidationDescription.Valid] },
      });
    });
  });
});
