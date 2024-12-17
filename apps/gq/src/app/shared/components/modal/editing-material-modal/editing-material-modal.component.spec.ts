import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';

import { of } from 'rxjs';

import { ActiveCaseFacade } from '@gq/core/store/active-case/active-case.facade';
import { CreateCaseFacade } from '@gq/core/store/create-case/create-case.facade';
import { AutoCompleteFacade } from '@gq/core/store/facades/autocomplete.facade';
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
import {
  MaterialTableItem,
  VALIDATION_CODE,
  ValidationDescription,
} from '../../../models/table';
import { AutocompleteRequestDialog } from '../../autocomplete-input/autocomplete-request-dialog.enum';
import { FilterNames } from '../../autocomplete-input/filter-names.enum';
import { EditingMaterialModalComponent } from './editing-material-modal.component';

describe('EditingMaterialModalComponent', () => {
  let component: EditingMaterialModalComponent;
  let spectator: Spectator<EditingMaterialModalComponent>;

  const createComponent = createComponentFactory({
    component: EditingMaterialModalComponent,
    imports: [
      MatInputModule,
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
      MockProvider(AutoCompleteFacade, {
        materialDescForEditMaterial$: of({}),
        materialDescAutocompleteLoading$: of({}),
        materialNumberForEditMaterial$: of({}),
        materialNumberAutocompleteLoading$: of({}),
        customerMaterialNumberForEditMaterial$: of({}),
        customerMaterialNumberLoading$: of({}),
        getSelectedAutocompleteMaterialNumberForEditMaterial$: of({}),
        optionSelectedForAutoCompleteFilter$: of({}),
        resetView: jest.fn(),
        initFacade: jest.fn(),
        autocomplete: jest.fn(),
        selectMaterialNumberOrDescription: jest.fn(),
        unselectOptions: jest.fn(),
      } as unknown as AutoCompleteFacade),
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
    detectChanges: false,
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.component;
    component['cdref'].detectChanges = jest.fn();
    jest.restoreAllMocks();
  });

  describe('addSubscriptions', () => {
    test('should subscribe to targetPriceSource for new case creation', () => {
      component.isNewCaseCreation = true;
      const control = {
        setValue: jest.fn(),
        valueChanges: of(undefined as any),
        updateValueAndValidity: jest.fn(),
      };
      const getTargetPriceValue = jest.spyOn(miscUtils, 'getTargetPriceValue');
      const getTargetPriceSourceValue = jest.spyOn(
        miscUtils,
        'getTargetPriceSourceValue'
      );

      component.editFormGroup = {
        get: jest.fn(() => control),
      } as any;
      component.rowInputValid = jest.fn();

      component.addSubscriptions();

      expect(component.rowInputValid).toHaveBeenCalled();
      expect(getTargetPriceValue).toHaveBeenCalledTimes(1);
      expect(getTargetPriceSourceValue).toHaveBeenCalledTimes(1);
      expect(control.updateValueAndValidity).toHaveBeenCalledTimes(2);
    });

    test('should not subscribe to targetPriceSource for old case creation', () => {
      component.isNewCaseCreation = false;
      const control = {
        setValue: jest.fn(),
        valueChanges: of(undefined as any),
        updateValueAndValidity: jest.fn(),
      };
      const getTargetPriceValue = jest.spyOn(miscUtils, 'getTargetPriceValue');
      const getTargetPriceSourceValue = jest.spyOn(
        miscUtils,
        'getTargetPriceSourceValue'
      );

      component.editFormGroup = {
        get: jest.fn(() => control),
      } as any;
      component.rowInputValid = jest.fn();

      component.addSubscriptions();

      expect(component.rowInputValid).toHaveBeenCalled();
      expect(getTargetPriceValue).not.toHaveBeenCalled();
      expect(getTargetPriceSourceValue).not.toHaveBeenCalled();
      expect(control.updateValueAndValidity).toHaveBeenCalledTimes(2);
    });
  });
  describe('ngAfterViewInit', () => {
    let editFormControlQuantity: FormControl;
    let editFormControlTargetPrice: FormControl;
    let editFormControlTargetPriceSource: FormControl;
    let materialNumberAutocomplete: any;
    let materialDescriptionAutocomplete: any;
    let customerMaterialNumberAutocomplete: any;

    beforeEach(() => {
      editFormControlQuantity = {
        setValue: jest.fn(),
        hasError: jest.fn(),
      } as any;

      editFormControlTargetPrice = {
        setValue: jest.fn(),
      } as any;

      editFormControlTargetPriceSource = {
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
      customerMaterialNumberAutocomplete = {
        searchFormControl: {
          setValue: jest.fn(),
        },
        focus: jest.fn(),
      } as any;
      component.matDescInput = materialDescriptionAutocomplete;
      component.matNumberInput = materialNumberAutocomplete;
      component.customerMaterialInput = customerMaterialNumberAutocomplete;
      component.ngOnInit();
    });
    test('should set form values', () => {
      component['cdref'].detectChanges = jest.fn();
      component.editFormGroup.get = jest.fn();
      component.editFormGroup.hasError = jest.fn().mockReturnValue(false);
      component[
        'autoCompleteFacade'
      ].selectMaterialNumberDescriptionOrCustomerMaterial = jest.fn();
      const formGroupGetMock = (component.editFormGroup.get = jest.fn());
      when(formGroupGetMock)
        .calledWith(MaterialColumnFields.QUANTITY)
        .mockReturnValue(editFormControlQuantity);
      when(formGroupGetMock)
        .calledWith(MaterialColumnFields.TARGET_PRICE)
        .mockReturnValue(editFormControlTargetPrice);
      when(formGroupGetMock)
        .calledWith(MaterialColumnFields.TARGET_PRICE_SOURCE)
        .mockReturnValue(editFormControlTargetPriceSource);

      component.ngAfterViewInit();
      expect(formGroupGetMock).toHaveBeenCalledTimes(3);

      expect(formGroupGetMock(MaterialColumnFields.QUANTITY)).toBe(
        editFormControlQuantity
      );
      expect(formGroupGetMock(MaterialColumnFields.TARGET_PRICE)).toBe(
        editFormControlTargetPrice
      );
      expect(formGroupGetMock(MaterialColumnFields.TARGET_PRICE_SOURCE)).toBe(
        editFormControlTargetPriceSource
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
        component['autoCompleteFacade']
          .selectMaterialNumberDescriptionOrCustomerMaterial
      ).toBeCalledTimes(1);
      expect(
        component['autoCompleteFacade']
          .selectMaterialNumberDescriptionOrCustomerMaterial
      ).toHaveBeenCalledWith(
        {
          id: component['materialToEdit'].materialNumber,
          value: component['materialToEdit'].materialDescription,
          value2: component['materialToEdit'].customerMaterialNumber,
          deliveryUnit: component['materialToEdit'].deliveryUnit,
          uom: component['materialToEdit'].UoM,
          selected: true,
        },
        FilterNames.MATERIAL_NUMBER
      );
    });
    test('should detect changes', () => {
      component['cdref'].detectChanges = jest.fn();

      component.ngAfterViewInit();

      expect(component['cdref'].detectChanges).toHaveBeenCalledTimes(1);
    });
    describe('should focus input fields', () => {
      beforeEach(() => {
        component['cdref'].detectChanges = jest.fn();
        component.ngOnInit();
        component.valueInput = {
          nativeElement: {
            focus: jest.fn(),
          } as any,
        };
        component.targetPriceInput = {
          nativeElement: {
            focus: jest.fn(),
          } as any,
        };
        component.targetPriceSourceInput = { focus: jest.fn() } as any;
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
      test('should focus customerMaterialNumber', () => {
        Object.defineProperty(component, 'fieldToFocus', {
          value: MaterialColumnFields.CUSTOMER_MATERIAL_NUMBER,
        });

        component.ngAfterViewInit();

        expect(materialDescriptionAutocomplete.focus).toHaveBeenCalledTimes(0);
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

      test('should focus targetPriceSource', () => {
        Object.defineProperty(component, 'fieldToFocus', {
          value: MaterialColumnFields.TARGET_PRICE_SOURCE,
        });

        component.ngAfterViewInit();

        expect(materialDescriptionAutocomplete.focus).toHaveBeenCalledTimes(0);
        expect(materialNumberAutocomplete.focus).toHaveBeenCalledTimes(0);
        expect(component.valueInput.nativeElement.focus).toHaveBeenCalledTimes(
          0
        );
        expect(
          component.targetPriceInput.nativeElement.focus
        ).toHaveBeenCalledTimes(0);
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
      beforeEach(() => {
        component.ngOnInit();
      });
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

        component.customerMaterialInput = {
          valueInput: {
            nativeElement: {
              value: MATERIAL_TABLE_ITEM_MOCK.customerMaterialNumber,
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
        when(formGroupGetMock)
          .calledWith(MaterialColumnFields.TARGET_PRICE_SOURCE)
          .mockReturnValue({
            value: MATERIAL_TABLE_ITEM_MOCK.targetPriceSource,
          });

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
        component.customerMaterialInput = {
          valueInput: {
            nativeElement: {
              value: MATERIAL_TABLE_ITEM_MOCK.customerMaterialNumber,
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

        component.customerMaterialInput = {
          valueInput: {
            nativeElement: {
              value: MATERIAL_TABLE_ITEM_MOCK.customerMaterialNumber,
            },
          },
        } as any;
        component.editFormGroup.get = jest
          .fn()
          .mockReturnValue({ value: MATERIAL_TABLE_ITEM_MOCK.quantity });

        expect(component.inputHasChanged()).toBeTruthy();
      });

      test('should return true for changed customerMaterialNumber', () => {
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
        component.customerMaterialInput = {
          valueInput: {
            nativeElement: {
              value: 'newCustomerMatNumber',
            },
          },
        } as any;
        component.editFormGroup.get = jest
          .fn()
          .mockReturnValue({ value: MATERIAL_TABLE_ITEM_MOCK.quantity });

        expect(component.inputHasChanged()).toBeTruthy();
      });
      test('should return false for unchanged customerMaterialNumber', () => {
        const materialToUpdate: MaterialTableItem = {
          ...MATERIAL_TABLE_ITEM_MOCK,
          customerMaterialNumber: null,
        };
        Object.defineProperty(component, 'materialToEdit', {
          value: materialToUpdate,
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
        component.customerMaterialInput = {
          valueInput: {
            nativeElement: {
              value: '',
            },
          },
        } as any;
        const formGroupGetMock = (component.editFormGroup.get = jest.fn());
        when(formGroupGetMock)
          .calledWith(MaterialColumnFields.QUANTITY)
          .mockReturnValue({ value: MATERIAL_TABLE_ITEM_MOCK.quantity });
        when(formGroupGetMock)
          .calledWith(MaterialColumnFields.TARGET_PRICE)
          .mockReturnValue({
            value: MATERIAL_TABLE_ITEM_MOCK.targetPrice.toString(),
          });
        when(formGroupGetMock)
          .calledWith(MaterialColumnFields.TARGET_PRICE_SOURCE)
          .mockReturnValue({
            value: MATERIAL_TABLE_ITEM_MOCK.targetPriceSource,
          });

        expect(component.inputHasChanged()).toBeFalsy();
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
        component.customerMaterialInput = {
          valueInput: {
            nativeElement: {
              value: MATERIAL_TABLE_ITEM_MOCK.customerMaterialNumber,
            },
          },
        } as any;
        component.editFormGroup.get = jest
          .fn()
          .mockReturnValue({ value: 'newQuantity' });

        expect(component.inputHasChanged()).toBeTruthy();
      });
      test('should return true for changed targetPrice', () => {
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
        component.customerMaterialInput = {
          valueInput: {
            nativeElement: {
              value: MATERIAL_TABLE_ITEM_MOCK.customerMaterialNumber,
            },
          },
        } as any;
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
      test('should return true when targetPriceSourceChanged', () => {
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
        component.customerMaterialInput = {
          valueInput: {
            nativeElement: {
              value: MATERIAL_TABLE_ITEM_MOCK.customerMaterialNumber,
            },
          },
        } as any;
        component.targetPriceInput = {
          valueInput: {
            nativeElement: {
              value: '10.00',
            },
          },
        } as any;
        component.targetPriceSourceInput = {
          valueInput: {
            nativeElement: {
              value: 'newSource',
            },
          },
        } as any;

        component.editFormGroup.get = jest
          .fn()
          .mockReturnValue({ value: 'sthElse' });

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
      jest.resetAllMocks();
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
      component.isNewCaseCreation = true;
      component.ngOnInit();
      component.isNewCaseCreation = true;
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
      component.customerMaterialInput = {
        valueInput: {
          nativeElement: {
            value: MATERIAL_TABLE_ITEM_MOCK.customerMaterialNumber,
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
      when(formGroupGetMock)
        .calledWith(MaterialColumnFields.TARGET_PRICE_SOURCE)
        .mockReturnValue({ value: MATERIAL_TABLE_ITEM_MOCK.targetPriceSource });

      component.update();

      expect(component['dialogRef'].close).toHaveBeenCalledTimes(1);
      expect(component['dialogRef'].close).toHaveBeenCalledWith({
        materialDescription: 'newDesc',
        materialNumber: 'newNumber',
        quantity: MATERIAL_TABLE_ITEM_MOCK.quantity,
        customerMaterialNumber: MATERIAL_TABLE_ITEM_MOCK.customerMaterialNumber,
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
      jest.resetAllMocks();
      component.ngOnInit();

      expect(component['autoCompleteFacade'].resetView).toHaveBeenCalledTimes(
        1
      );
      expect(component['autoCompleteFacade'].initFacade).toHaveBeenCalledWith(
        AutocompleteRequestDialog.EDIT_MATERIAL
      );
    });

    test('should set quantityValidator to FormControl', () => {
      component.isNewCaseCreation = true;
      component.ngOnInit();
      expect(
        component.editFormGroup.get(MaterialColumnFields.QUANTITY)
          .asyncValidator
      ).toBeTruthy();
    });
    test('should NOT set quantityValidator to FormControl', () => {
      component.isNewCaseCreation = false;
      component.ngOnInit();
      expect(
        component.editFormGroup.get(MaterialColumnFields.QUANTITY)
          .asyncValidator
      ).toBeFalsy();
    });

    test('should adjust the quantity when isQuantityValidation is true considering the deliveryUnit of the selected Material', () => {
      component.isNewCaseCreation = true;
      component['adjustQuantityFormFieldToDeliveryUnit'] = jest.fn();
      component.ngOnInit();
      component.selectedMaterialAutocomplete$ = of({
        id: '1',
        value: '2',
        deliveryUnit: 5,
        selected: true,
        uom: 'PC',
        value2: null,
      } as IdValue);
      expect(
        component['adjustQuantityFormFieldToDeliveryUnit']
      ).toHaveBeenCalledTimes(1);
    });
  });

  describe('autoComplete Methods', () => {
    test('should call autocompleteFacade.autocomplete', () => {
      component.autocomplete(expect.anything(), expect.anything());
      expect(component['autoCompleteFacade'].autocomplete).toHaveBeenCalled();
    });
    test('should call autocompleteFacade.autocompleteSelectMaterialNumberOrDescription', () => {
      component.autocompleteSelectMaterialNumberDescriptionOrCustomerMaterial(
        expect.anything(),
        expect.anything()
      );
      expect(
        component['autoCompleteFacade'].selectMaterialNumberOrDescription
      ).toHaveBeenCalled();
    });
    test('should call autocompleteFacade.unselectOptions', () => {
      component.autocompleteUnselectOptions(expect.anything());
      expect(
        component['autoCompleteFacade'].unselectOptions
      ).toHaveBeenCalled();
    });
  });
});
