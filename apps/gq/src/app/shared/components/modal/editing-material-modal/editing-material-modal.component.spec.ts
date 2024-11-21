import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';

import { of } from 'rxjs';

import { ActiveCaseFacade } from '@gq/core/store/active-case/active-case.facade';
import { CreateCaseFacade } from '@gq/core/store/create-case/create-case.facade';
import { DialogHeaderModule } from '@gq/shared/components/header/dialog-header/dialog-header.module';
import { LOCALE_DE } from '@gq/shared/constants';
import { IdValue } from '@gq/shared/models/search/id-value.model';
import { TransformationService } from '@gq/shared/services/transformation/transformation.service';
import * as miscUtils from '@gq/shared/utils/misc.utils';
import { TranslocoLocaleService } from '@jsverse/transloco-locale';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { PushPipe } from '@ngrx/component';
import { provideMockStore } from '@ngrx/store/testing';
import { when } from 'jest-when';
import { MockModule, MockProvider } from 'ng-mocks';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import {
  CREATE_CASE_STORE_STATE_MOCK,
  MATERIAL_TABLE_ITEM_MOCK,
  PROCESS_CASE_STATE_MOCK,
} from '../../../../../testing/mocks';
import { MaterialColumnFields } from '../../../ag-grid/constants/column-fields.enum';
import { VALIDATION_CODE, ValidationDescription } from '../../../models/table';
import { AutocompleteInputComponent } from '../../autocomplete-input/autocomplete-input.component';
import { AutocompleteRequestDialog } from '../../autocomplete-input/autocomplete-request-dialog.enum';
import { EditingMaterialModalComponent } from './editing-material-modal.component';

describe('EditingMaterialModalComponent', () => {
  let component: EditingMaterialModalComponent;
  let spectator: Spectator<EditingMaterialModalComponent>;

  const createComponent = createComponentFactory({
    component: EditingMaterialModalComponent,
    imports: [
      MatInputModule,
      AutocompleteInputComponent,
      PushPipe,
      ReactiveFormsModule,
      MockModule(DialogHeaderModule),
      provideTranslocoTestingModule({ en: {} }),
    ],
    providers: [
      MockProvider(ActiveCaseFacade, {
        quotationCustomer$: of({}),
      } as unknown as ActiveCaseFacade),
      MockProvider(CreateCaseFacade),
      MockProvider(TransformationService, {
        transformNumber: jest
          .fn()
          .mockImplementation((value) =>
            Intl.NumberFormat('en-US').format(value)
          ),
      }),
      MockProvider(TranslocoLocaleService, {
        getLocale: jest.fn(() => LOCALE_DE.id),
      }),
      provideMockStore({
        initialState: {
          processCase: PROCESS_CASE_STATE_MOCK,
          case: CREATE_CASE_STORE_STATE_MOCK,
        },
      }),
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
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.component;
    jest.restoreAllMocks();
  });

  describe('ngAfterViewInit', () => {
    let editFormControlQuantity: FormControl;
    let editFormControlTargetPrice: FormControl;
    let materialNumberAutocomplete: AutocompleteInputComponent;
    let materialDescriptionAutocomplete: AutocompleteInputComponent;

    beforeEach(() => {
      editFormControlQuantity = {
        setValue: jest.fn(),
        hasError: jest.fn(),
      } as any;

      editFormControlTargetPrice = {
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
      component['cdref'].detectChanges = jest.fn();
      component.editFormGroup.get = jest.fn();
      component.editFormGroup.hasError = jest.fn().mockReturnValue(false);
      const formGroupGetMock = (component.editFormGroup.get = jest.fn());
      when(formGroupGetMock)
        .calledWith(MaterialColumnFields.QUANTITY)
        .mockReturnValue(editFormControlQuantity);
      when(formGroupGetMock)
        .calledWith(MaterialColumnFields.TARGET_PRICE)
        .mockReturnValue(editFormControlTargetPrice);

      component.ngAfterViewInit();
      expect(formGroupGetMock).toHaveBeenCalledTimes(2);

      expect(formGroupGetMock(MaterialColumnFields.QUANTITY)).toBe(
        editFormControlQuantity
      );
      expect(formGroupGetMock(MaterialColumnFields.TARGET_PRICE)).toBe(
        editFormControlTargetPrice
      );

      expect(editFormControlQuantity.setValue).toHaveBeenCalledTimes(1);
      expect(editFormControlQuantity.setValue).toHaveBeenCalledWith(
        MATERIAL_TABLE_ITEM_MOCK.quantity
      );
      expect(editFormControlTargetPrice.setValue).toHaveBeenCalledTimes(1);
      expect(editFormControlTargetPrice.setValue).toHaveBeenCalledWith(
        MATERIAL_TABLE_ITEM_MOCK.targetPrice.toString()
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
        component.targetPriceInput.nativeElement.focus = jest.fn();
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
      test('should focus targetPrice', () => {
        Object.defineProperty(component, 'fieldToFocus', {
          value: MaterialColumnFields.TARGET_PRICE,
        });

        component.ngAfterViewInit();

        expect(materialDescriptionAutocomplete.focus).toHaveBeenCalledTimes(0);
        expect(materialNumberAutocomplete.focus).toHaveBeenCalledTimes(0);
        expect(component.valueInput.nativeElement.focus).toHaveBeenCalledTimes(
          0
        );
        expect(
          component.targetPriceInput.nativeElement.focus
        ).toHaveBeenCalledTimes(1);
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
        Object.defineProperty(component, 'materialToEdit', {
          value: MATERIAL_TABLE_ITEM_MOCK,
        });
        Object.defineProperty(component, 'targetPrice', {
          value: MATERIAL_TABLE_ITEM_MOCK.targetPrice,
        });
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

        const formGroupGetMock = (component.editFormGroup.get = jest.fn());
        when(formGroupGetMock)
          .calledWith(MaterialColumnFields.QUANTITY)
          .mockReturnValue({ value: MATERIAL_TABLE_ITEM_MOCK.quantity });
        when(formGroupGetMock)
          .calledWith(MaterialColumnFields.TARGET_PRICE)
          .mockReturnValue({ value: MATERIAL_TABLE_ITEM_MOCK.targetPrice });

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
      test('should return true for changed targetPrice', () => {
        component.targetPriceInput = {
          valueInput: {
            nativeElement: {
              value: '10.00',
            },
          },
        } as any;

        component.editFormGroup.get = jest
          .fn()
          .mockReturnValue({ value: '10.10' });

        expect(component.inputHasChanged()).toBeTruthy();
      });
    });
  });

  describe('handleQuantityKeyDown', () => {
    test('should call validateQuantityInputKeyPress', () => {
      jest
        .spyOn(miscUtils, 'validateQuantityInputKeyPress')
        .mockImplementation();
      const event = {} as KeyboardEvent;

      component.handleQuantityKeyDown(event);
      expect(miscUtils.validateQuantityInputKeyPress).toHaveBeenCalledTimes(1);
      expect(miscUtils.validateQuantityInputKeyPress).toHaveBeenCalledWith(
        event
      );
    });
  });

  describe('closeDialog', () => {
    test('should close dialog', () => {
      component['autoCompleteFacade'].resetView = jest.fn();

      component['dialogRef'].close = jest.fn();

      component.closeDialog();

      expect(component['autoCompleteFacade'].resetView).toHaveBeenCalledTimes(
        1
      );
      expect(component['dialogRef'].close).toHaveBeenCalledTimes(1);
    });
  });

  describe('update', () => {
    test('should close dialog with updated material', () => {
      component.modalData = {
        material: {
          ...MATERIAL_TABLE_ITEM_MOCK,
          info: {
            ...MATERIAL_TABLE_ITEM_MOCK.info,
            codes: [VALIDATION_CODE.SDG101],
          },
        },
        field: MaterialColumnFields.MATERIAL,
        isCaseView: false,
      };
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
      const formGroupGetMock = (component.editFormGroup.get = jest.fn());
      when(formGroupGetMock)
        .calledWith(MaterialColumnFields.QUANTITY)
        .mockReturnValue({ value: MATERIAL_TABLE_ITEM_MOCK.quantity });
      when(formGroupGetMock)
        .calledWith(MaterialColumnFields.TARGET_PRICE)
        .mockReturnValue({ value: MATERIAL_TABLE_ITEM_MOCK.targetPrice });

      component.update();

      expect(component['dialogRef'].close).toHaveBeenCalledTimes(1);
      expect(component['dialogRef'].close).toHaveBeenCalledWith({
        materialDescription: 'newDesc',
        materialNumber: 'newNumber',
        quantity: MATERIAL_TABLE_ITEM_MOCK.quantity,
        targetPrice: MATERIAL_TABLE_ITEM_MOCK.targetPrice,
        id: MATERIAL_TABLE_ITEM_MOCK.id,
        info: {
          valid: true,
          description: [ValidationDescription.Valid],
          codes: [VALIDATION_CODE.SDG101],
        },
      });
    });
  });

  describe('ngOnInit', () => {
    test('should init component', () => {
      component['autoCompleteFacade'].resetView = jest.fn();
      component['autoCompleteFacade'].initFacade = jest.fn();

      component.ngOnInit();

      expect(component['autoCompleteFacade'].resetView).toHaveBeenCalledTimes(
        1
      );
      expect(component['autoCompleteFacade'].initFacade).toHaveBeenCalledWith(
        AutocompleteRequestDialog.EDIT_MATERIAL
      );
    });

    test('should set quantityValidator to FormControl', () => {
      component.isQuantityValidation = true;
      component.ngOnInit();
      expect(
        component.editFormGroup.get(MaterialColumnFields.QUANTITY)
          .asyncValidator
      ).toBeTruthy();
    });
    test('should NOT set quantityValidator to FormControl', () => {
      component.isQuantityValidation = false;
      component.ngOnInit();
      expect(
        component.editFormGroup.get(MaterialColumnFields.QUANTITY)
          .asyncValidator
      ).toBeFalsy();
    });

    test('should adjust the quantity when isQuantityValidation is true considering the deliveryUnit of the selected Material', () => {
      component.isQuantityValidation = true;
      Object.defineProperty(
        component.editFormGroup.controls['quantity'],
        'value',
        {
          value: 4,
          writable: true,
        }
      );

      component.selectedMaterialAutocomplete$ = of({
        id: '1',
        value: '2',
        deliveryUnit: 5,
        selected: true,
        uom: 'PC',
        value2: null,
      } as IdValue);
      spectator.detectChanges();
      component.ngOnInit();
      expect(component.editFormGroup.get('quantity').value).toBe(5);
    });
  });

  describe('afterViewInit', () => {
    test('should init', () => {
      component.ngAfterViewInit();
      expect(true).toBeTruthy();
    });
  });

  describe('autoComplete Methods', () => {
    test('should call autocompleteFacade.autocomplete', () => {
      component['autoCompleteFacade'].autocomplete = jest.fn();
      component.autocomplete(expect.anything(), expect.anything());
      expect(component['autoCompleteFacade'].autocomplete).toHaveBeenCalled();
    });
    test('should call autocompleteFacade.autocompleteSelectMaterialNumberOrDescription', () => {
      component['autoCompleteFacade'].selectMaterialNumberOrDescription =
        jest.fn();
      component.autocompleteSelectMaterialNumberOrDescription(
        expect.anything(),
        expect.anything()
      );
      expect(
        component['autoCompleteFacade'].selectMaterialNumberOrDescription
      ).toHaveBeenCalled();
    });
    test('should call autocompleteFacade.unselectOptions', () => {
      component['autoCompleteFacade'].unselectOptions = jest.fn();
      component.autocompleteUnselectOptions(expect.anything());
      expect(
        component['autoCompleteFacade'].unselectOptions
      ).toHaveBeenCalled();
    });
  });
});
