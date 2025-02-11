import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';

import { BehaviorSubject, of } from 'rxjs';

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
  const getAutocompleteOptionsSuccessMock: BehaviorSubject<{
    options: IdValue[];
    filter: FilterNames;
  }> = new BehaviorSubject({} as any);

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
        getAutocompleteOptionsSuccess$:
          getAutocompleteOptionsSuccessMock.asObservable(),
        resetView: jest.fn(),
        initFacade: jest.fn(),
        autocomplete: jest.fn(),
        selectMaterialNumberDescriptionOrCustomerMaterial: jest.fn(),
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
    let materialNumberAutocomplete: any;
    let materialDescriptionAutocomplete: any;
    let customerMaterialNumberAutocomplete: any;

    beforeEach(() => {
      materialNumberAutocomplete = {
        searchFormControl: {
          setValue: jest.fn(),
          markAllAsTouched: jest.fn(),
        },
        focus: jest.fn(),
      } as any;
      materialDescriptionAutocomplete = {
        searchFormControl: {
          setValue: jest.fn(),
          markAllAsTouched: jest.fn(),
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

    test('should detect changes', () => {
      component['cdref'].detectChanges = jest.fn();
      component[
        'initializeMaterialControlService'
      ].initializeMaterialFormControls = jest.fn();

      component.ngAfterViewInit();

      expect(component['cdref'].detectChanges).toHaveBeenCalledTimes(1);
      expect(
        component['initializeMaterialControlService']
          .initializeMaterialFormControls
      ).toHaveBeenCalledTimes(1);

      const expectedInputs = {
        matNumberInput: component.matNumberInput,
        matDescInput: component.matDescInput,
        customerMaterialInput: component.customerMaterialInput,
        quantityInput: component.valueInput,
        targetPriceInput: component.targetPriceInput,
        targetPriceSourceInput: component.targetPriceSourceInput,
      };
      expect(
        component['initializeMaterialControlService']
          .initializeMaterialFormControls
      ).toHaveBeenCalledWith(
        component['fieldToFocus'],
        component['materialToEdit'],
        expectedInputs,
        component['cdref']
      );
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

    describe('customerMaterialHasInput', () => {
      test('should call rowInputValid', () => {
        component.rowInputValid = jest.fn();
        component.customerMaterialHasInput();
        expect(component.rowInputValid).toHaveBeenCalled();
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

      component.update(5);

      expect(component['dialogRef'].close).toHaveBeenCalledTimes(1);
      expect(component['dialogRef'].close).toHaveBeenCalledWith({
        materialDescription: 'newDesc',
        deliveryUnit: 5,
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
        component['autoCompleteFacade']
          .selectMaterialNumberDescriptionOrCustomerMaterial
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
