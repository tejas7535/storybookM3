import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

import { BehaviorSubject, of } from 'rxjs';

import { ActiveCaseFacade } from '@gq/core/store/active-case/active-case.facade';
import { CreateCaseFacade } from '@gq/core/store/create-case/create-case.facade';
import { AutoCompleteFacade } from '@gq/core/store/facades';
import { ProcessCaseFacade } from '@gq/core/store/process-case';
import { SalesOrg } from '@gq/core/store/reducers/models';
import { LOCALE_DE } from '@gq/shared/constants';
import { SharedDirectivesModule } from '@gq/shared/directives/shared-directives.module';
import { Customer, CustomerId } from '@gq/shared/models';
import { TargetPriceSource } from '@gq/shared/models/quotation/target-price-source.enum';
import { IdValue } from '@gq/shared/models/search';
import { PasteMaterialsService } from '@gq/shared/services/paste-materials/paste-materials.service';
import * as miscUtils from '@gq/shared/utils/misc.utils';
import { TranslocoLocaleService } from '@jsverse/transloco-locale';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { PushPipe } from '@ngrx/component';
import { provideMockStore } from '@ngrx/store/testing';
import { MockProvider } from 'ng-mocks';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { CREATE_CASE_STORE_STATE_MOCK } from '../../../../../testing/mocks';
import {
  MaterialTableItem,
  ValidationDescription,
} from '../../../models/table';
import { AutocompleteRequestDialog } from '../../autocomplete-input/autocomplete-request-dialog.enum';
import { AddEntryComponent } from './add-entry.component';

describe('AddEntryComponent', () => {
  let component: AddEntryComponent;

  let spectator: Spectator<AddEntryComponent>;
  const createCaseCustomerIdSubject: BehaviorSubject<CustomerId> =
    new BehaviorSubject<CustomerId>({ customerId: '1234', salesOrg: '0815' });
  const customerIdForCaseCreationSubject: BehaviorSubject<string> =
    new BehaviorSubject<string>('1234');
  const selectedCustomerSalesOrgSubject: BehaviorSubject<SalesOrg> =
    new BehaviorSubject<SalesOrg>({ id: '0815', selected: true });

  const selectedMaterialAutocompleteSubject: BehaviorSubject<IdValue> =
    new BehaviorSubject<IdValue>({
      id: 'MatNumber',
      value: 'MatDesc',
      value2: null,
      selected: true,
      deliveryUnit: 1,
      uom: 'PC',
    });

  const selectedAutocompleteRequestDialogSubject: BehaviorSubject<AutocompleteRequestDialog> =
    new BehaviorSubject<AutocompleteRequestDialog>(
      AutocompleteRequestDialog.CREATE_CASE
    );

  const createComponent = createComponentFactory({
    component: AddEntryComponent,
    imports: [
      provideTranslocoTestingModule({ en: {} }),
      ReactiveFormsModule,
      SharedDirectivesModule,
      PushPipe,
    ],
    providers: [
      MockProvider(PasteMaterialsService, {
        onPasteStart: jest.fn(),
      }),
      MockProvider(MatSnackBar),
      MockProvider(AutoCompleteFacade, {
        materialDescAutocompleteLoading$: of(false),
        materialDescForCreateCase$: of(null),
        materialDescForAddEntry$: of(null),
        materialNumberAutocompleteLoading$: of(false),
        materialNumberForCreateCase$: of(null),
        materialNumberForAddEntry$: of(null),
        customerMaterialNumberLoading$: of(false),
        customerMaterialNumberForCreateCase$: of(null),
        customerMaterialNumberForAddEntry$: of(null),
        getSelectedAutocompleteMaterialNumber$:
          selectedMaterialAutocompleteSubject.asObservable(),
        getSelectedAutocompleteRequestDialog$:
          selectedAutocompleteRequestDialogSubject.asObservable(),
        autocomplete: jest.fn(),
        unselectOptions: jest.fn(),
        selectMaterialNumberDescriptionOrCustomerMaterial: jest.fn(),
      }),
      MockProvider(TranslocoLocaleService, {
        getLocale: jest.fn(() => LOCALE_DE.id),
      }),
      MockProvider(CreateCaseFacade, {
        customerIdentifier$: createCaseCustomerIdSubject.asObservable(),
        customerIdForCaseCreation$:
          customerIdForCaseCreationSubject.asObservable(),
        selectedCustomerSalesOrg$:
          selectedCustomerSalesOrgSubject.asObservable(),
        addRowDataItems: jest.fn(),
      }),
      MockProvider(ProcessCaseFacade, {
        addItemsToMaterialTable: jest.fn(),
      }),
      MockProvider(ActiveCaseFacade, {
        quotationCustomer$: of({
          identifier: { customerId: '1234', salesOrg: '0815' },
        } as Customer),
      }),
      provideMockStore({
        initialState: {
          case: CREATE_CASE_STORE_STATE_MOCK,
        },
      }),
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    detectChanges: false,
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.component;
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    beforeEach(() => {
      component['clearFields'] = jest.fn();
    });
    test('should set quantityValid if when quantityFormControl valueChanges', () => {
      component.rowInputValid = jest.fn();
      component.quantityFormControl.markAsTouched = jest.fn();

      component.ngOnInit();
      const testValue = 10;
      component.quantityFormControl.setValue(testValue);

      expect(component.rowInputValid).toHaveBeenCalled();
      expect(component.quantityFormControl.markAsTouched).toHaveBeenCalled();
    });

    test('should reset inputFields, when For CreateCase, the CustomerId changes', () => {
      component.newCaseCreation = true;
      Object.defineProperty(component, 'isCaseView', {
        value: true,
      });
      component['clearFields'] = jest.fn();
      customerIdForCaseCreationSubject.next('555');
      component.ngOnInit();
      customerIdForCaseCreationSubject.next('666');
      expect(component['clearFields']).toHaveBeenCalled();
    });
    test('should clearFields when ForCreateCase and selectedCustomerSalesOrg changes', () => {
      component.newCaseCreation = true;
      Object.defineProperty(component, 'isCaseView', {
        value: true,
      });
      component['clearFields'] = jest.fn();
      selectedCustomerSalesOrgSubject.next({ id: '0816', selected: true });
      component.ngOnInit();
      selectedCustomerSalesOrgSubject.next({ id: '0817', selected: true });
      expect(component['clearFields']).toHaveBeenCalled();
    });
    test('should init AutocompleteFacade with CREATE_CASE for new CaseCreation', () => {
      Object.defineProperty(component, 'isCaseView', {
        value: true,
        writable: true,
      });
      component['clearFields'] = jest.fn();
      component.newCaseCreation = true;
      component.autoCompleteFacade.initFacade = jest.fn();
      component.ngOnInit();
      expect(component.autoCompleteFacade.initFacade).toHaveBeenCalledWith(
        AutocompleteRequestDialog.CREATE_CASE
      );
    });
    test('should init AutocompleteFacade with Add_ENTRY for old CaseCreation', () => {
      Object.defineProperty(component, 'isCaseView', {
        value: true,
        writable: true,
      });
      component['clearFields'] = jest.fn();
      component.newCaseCreation = false;
      component.autoCompleteFacade.initFacade = jest.fn();
      component.ngOnInit();
      expect(component.autoCompleteFacade.initFacade).toHaveBeenCalledWith(
        AutocompleteRequestDialog.ADD_ENTRY
      );
    });

    test('should enable nonAutocompleteFields when CustomerId is set', () => {
      component.newCaseCreation = true;
      Object.defineProperty(component, 'isCaseView', {
        value: true,
        writable: true,
      });
      component['enableNonAutoCompleteFields'] = jest.fn();
      customerIdForCaseCreationSubject.next('555');
      selectedCustomerSalesOrgSubject.next({ id: '0816', selected: true });
      component.ngOnInit();
      expect(component['enableNonAutoCompleteFields']).toHaveBeenCalled();
    });

    test('should set the quantity to the next multiple of deliveryUnit when quantity < deliveryUnit', () => {
      component['clearFields'] = jest.fn();
      component.newCaseCreation = true;
      component.quantityFormControl.setValue('2');
      selectedMaterialAutocompleteSubject.next(
        new IdValue('MatNumber', 'MatDesc', true, null, 6, 'PC')
      );
      component.ngOnInit();
      expect(component.quantityFormControl.value).toEqual(6);
    });
    test('should set the quantity to the next multiple of deliveryUnit when quantity > deliveryUnit', () => {
      component.newCaseCreation = true;
      component.quantityFormControl.setValue('8');
      selectedMaterialAutocompleteSubject.next(
        new IdValue('MatNumber', 'MatDesc', true, null, 6, 'PC')
      );
      component.ngOnInit();
      expect(component.quantityFormControl.value).toEqual(12);
    });
    test('should set the quantity to deliveryUnit when quantity is falsy', () => {
      component.newCaseCreation = true;
      component.quantityFormControl.setValue('');
      selectedMaterialAutocompleteSubject.next(
        new IdValue('MatNumber', 'MatDesc', true, null, 6, 'PC')
      );
      component.ngOnInit();
      expect(component.quantityFormControl.value).toEqual(6);
    });

    test('should not adjust the quantity when deliveryUnit if not newCaseCreation', () => {
      component.newCaseCreation = false;
      component.quantityFormControl.setValue('8');
      selectedMaterialAutocompleteSubject.next(
        new IdValue('MatNumber', 'MatDesc', true, null, 6, 'PC')
      );
      component.ngOnInit();
      expect(component.quantityFormControl.value).toEqual('8');
    });

    describe('changes on RequestDialog', () => {
      beforeEach(() => {
        customerIdForCaseCreationSubject.next(null);
        selectedCustomerSalesOrgSubject.next(null);
      });
      test('should clear fields, when RequestDialog is EditMaterial', () => {
        component.newCaseCreation = true;
        component['clearFields'] = jest.fn();
        selectedAutocompleteRequestDialogSubject.next(
          AutocompleteRequestDialog.EDIT_MATERIAL
        );
        component.ngOnInit();
        expect(component['clearFields']).toHaveBeenCalled();
      });

      test('should not clear fields, when RequestDialog is not EditMaterial', () => {
        component.newCaseCreation = true;

        component['clearFields'] = jest.fn();
        selectedAutocompleteRequestDialogSubject.next(
          AutocompleteRequestDialog.CREATE_CASE
        );
        component.ngOnInit();
        selectedAutocompleteRequestDialogSubject.next(
          AutocompleteRequestDialog.CREATE_CASE
        );
        expect(component['clearFields']).not.toHaveBeenCalled();
      });
    });
  });

  describe('subscriptions', () => {
    describe('targetPriceFormControlChanges', () => {
      test('should set targetPriceSource to NO_ENTRY when targetPrice null', () => {
        Object.defineProperty(component.targetPriceFormControl, 'value', {
          value: '123',
          writable: true,
        });
        component.targetPriceSourceFormControl.setValue = jest.fn();
        component.addSubscriptions();
        component.targetPriceFormControl.setValue(null);
        expect(
          component.targetPriceSourceFormControl.setValue
        ).toHaveBeenCalledWith(TargetPriceSource.NO_ENTRY, {
          emitEvent: false,
        });
      });
      test('should set targetPriceSource to NO_ENTRY when targetPrice undefined', () => {
        Object.defineProperty(component.targetPriceFormControl, 'value', {
          value: '123',
          writable: true,
        });
        component.targetPriceSourceFormControl.setValue = jest.fn();
        component.addSubscriptions();
        component.targetPriceFormControl.setValue(undefined);
        expect(
          component.targetPriceSourceFormControl.setValue
        ).toHaveBeenCalledWith(TargetPriceSource.NO_ENTRY, {
          emitEvent: false,
        });
      });
      test('should set targetPriceSource to NO_ENTRY when targetPrice emptyString', () => {
        Object.defineProperty(component.targetPriceFormControl, 'value', {
          value: '123',
          writable: true,
        });
        component.targetPriceSourceFormControl.setValue = jest.fn();
        component.addSubscriptions();
        component.targetPriceFormControl.setValue('');
        expect(
          component.targetPriceSourceFormControl.setValue
        ).toHaveBeenCalledWith(TargetPriceSource.NO_ENTRY, {
          emitEvent: false,
        });
      });
      test('should set the targetPriceSource to INTERNAL when targetPriceSource is NO_ENTRY and targetPriceFormControl is valid', () => {
        component.targetPriceFormControl.setValue(null);
        component.targetPriceSourceFormControl.setValue = jest.fn();
        component.addSubscriptions();
        Object.defineProperty(component.targetPriceFormControl, 'valid', {
          value: true,
        });
        component.targetPriceFormControl.setValue('123');

        expect(
          component.targetPriceSourceFormControl.setValue
        ).toHaveBeenCalledWith(TargetPriceSource.INTERNAL, {
          emitEvent: false,
        });
      });
      test('should not set set the TargetPriceSource when targetPriceFormControl is NOT valid', () => {
        component.targetPriceFormControl.setValue(null);
        component.targetPriceSourceFormControl.setValue(
          TargetPriceSource.NO_ENTRY
        );
        component.addSubscriptions();
        component.targetPriceFormControl.setValue('sdf');
        expect(component.targetPriceSourceFormControl.value).toBe(
          TargetPriceSource.NO_ENTRY
        );
      });
      test('should not update the targetPriceSource when it is already set to <> No_ENTRY when targetPrice is set/changed', () => {
        component.targetPriceFormControl.setValue(null);
        component.targetPriceSourceFormControl.setValue(
          TargetPriceSource.CUSTOMER
        );
        component.targetPriceSourceFormControl.setValue = jest.fn();
        component.addSubscriptions();
        component.targetPriceFormControl.setValue('123');
        expect(component.targetPriceSourceFormControl.value).toEqual(
          TargetPriceSource.CUSTOMER
        );
      });
    });

    describe('targetPriceSourceFormControlChanges', () => {
      test('should not reset targetPriceFormControl when targetPriceSource is NO_ENTRY and targetPriceFormControl is null', () => {
        component.targetPriceFormControl.reset = jest.fn();
        component.addSubscriptions();
        component.targetPriceSourceFormControl.setValue(
          TargetPriceSource.NO_ENTRY
        );
        expect(component.targetPriceFormControl.reset).not.toHaveBeenCalled();
      });
      test('should reset targetPriceFormControl when targetPriceSource is NO_ENTRY', () => {
        component.targetPriceFormControl.setValue('123');
        component.targetPriceFormControl.setValue = jest.fn();
        component.addSubscriptions();
        component.targetPriceSourceFormControl.setValue(
          TargetPriceSource.NO_ENTRY
        );
        expect(component.targetPriceFormControl.setValue).toHaveBeenCalledWith(
          null,
          {
            emitEvent: false,
          }
        );
      });
      test('should not reset targetPriceFormControl when targetPriceSource is not NO_ENTRY', () => {
        component.targetPriceFormControl.reset = jest.fn();
        component.addSubscriptions();
        component.targetPriceSourceFormControl.setValue(
          TargetPriceSource.INTERNAL
        );
        expect(component.targetPriceFormControl.reset).not.toHaveBeenCalled();
      });
    });

    test('should set materialNumberIsValid', () => {
      component.rowInputValid = jest.fn();
      component.materialInputValid(true);

      expect(component.materialInputIsValid).toBeTruthy();
      expect(component.rowInputValid).toHaveBeenCalledTimes(1);
    });

    test('should enableNonAutocompleteFields when CustomerId is present', () => {
      component.newCaseCreation = true;
      component['enableNonAutoCompleteFields'] = jest.fn();
      customerIdForCaseCreationSubject.next('555');
      component.addSubscriptions();
      expect(component['enableNonAutoCompleteFields']).toHaveBeenCalled();
    });

    test('should enableNonAutocompleteFields when CustomerId is present on active case', () => {
      component.newCaseCreation = true;
      component['isCaseView'] = false;
      component['enableNonAutoCompleteFields'] = jest.fn();
      component.addSubscriptions();
      expect(component['enableNonAutoCompleteFields']).toHaveBeenCalled();
    });

    test('should call disableNonAutocompleteFields when CustomerId is not present', () => {
      component.newCaseCreation = true;
      component['isCaseView'] = true;
      component['disableNonAutoCompleteFields'] = jest.fn();
      customerIdForCaseCreationSubject.next(null);
      component.addSubscriptions();
      expect(component['disableNonAutoCompleteFields']).toHaveBeenCalled();
    });
  });

  describe('rowInputValid', () => {
    beforeEach(() => {
      component.materialNumberInput = true;
    });
    test('should set addRowEnabled to true', () => {
      component.materialInputIsValid = true;
      component.materialNumberInput = true;
      selectedMaterialAutocompleteSubject.next(
        new IdValue('MatNumber', 'MatDesc', true, null, 5, 'PC')
      );
      component.quantityFormControl = {
        valid: true,
        value: 'x',
      } as FormControl;

      component.targetPriceFormControl = {
        valid: true,
      } as FormControl;
      component.rowInputValid();
      expect(component.addRowEnabled).toBeTruthy();
    });
    test('should set addRowEnabled to false when materialInputIsValid is false', () => {
      component.materialInputIsValid = false;
      component.rowInputValid();
      expect(component.addRowEnabled).toBeFalsy();
    });
    test('should set addRowEnabled to false when materialNumberInput is false', () => {
      component.materialInputIsValid = true;
      component.materialNumberInput = false;
      component.rowInputValid();
      expect(component.addRowEnabled).toBeFalsy();
    });
    test('should set addRowEnabled to false when targetPriceFormControl is not Valid', () => {
      component.materialInputIsValid = true;
      component.materialNumberInput = true;

      component.targetPriceFormControl = {
        valid: false,
      } as FormControl;

      component.rowInputValid();
      expect(component.addRowEnabled).toBeFalsy();
    });
    test('should set addRowEnabled to false when quantityFormControl is not Valid', () => {
      component.materialInputIsValid = true;
      component.materialNumberInput = true;

      selectedMaterialAutocompleteSubject.next(
        new IdValue('MatNumber', 'MatDesc', true, null, 5, 'PC')
      );

      component.quantityFormControl = {
        valid: false,
        value: 'x',
      } as FormControl;

      component.targetPriceFormControl = {
        valid: true,
      } as FormControl;

      component.rowInputValid();
      expect(component.addRowEnabled).toBeFalsy();
    });
  });

  describe('addRow', () => {
    test('should dispatch action', () => {
      const item: MaterialTableItem = {
        materialNumber: '1234',
        materialDescription: 'desc',
        customerMaterialNumber: 'cust',
        targetPriceSource: 'noEntry',
        quantity: 10,
        info: {
          description: [ValidationDescription.Not_Validated],
          valid: false,
        },
      };

      component.matNumberInput = {
        searchFormControl: new FormControl(item.materialNumber),
        clearInput: jest.fn(),
      } as any;
      component.matDescInput = {
        searchFormControl: new FormControl(item.materialDescription),
        clearInput: jest.fn(),
      } as any;

      component.customerMatNumberInput = {
        searchFormControl: new FormControl(item.customerMaterialNumber),
        clearInput: jest.fn(),
      } as any;

      component.quantityFormControl = {
        value: 10,
        reset: jest.fn(),
      } as any;

      component.targetPriceFormControl = {
        reset: jest.fn(),
      } as any;

      component.targetPriceSourceFormControl = {
        setValue: jest.fn(),
      } as any;

      component.newCaseCreation = true;
      component.addRow();
      expect(
        component['processCaseFacade'].addItemsToMaterialTable
      ).toHaveBeenCalledWith([{ ...item, targetPriceSource: undefined }]);

      expect(component.matNumberInput.clearInput).toHaveBeenCalledTimes(1);
      expect(component.matDescInput.clearInput).toHaveBeenCalledTimes(1);
      expect(component.quantityFormControl.reset).toHaveBeenCalledTimes(1);
      expect(component.targetPriceFormControl.reset).toHaveBeenCalledTimes(1);
      expect(component.customerMatNumberInput.clearInput).toHaveBeenCalled();
      expect(
        component.targetPriceSourceFormControl.setValue
      ).toHaveBeenCalled();
    });

    test('should set targetPriceSource to undefined when targetPriceFormControl is empty', () => {
      const item: MaterialTableItem = {
        materialNumber: '1234',
        materialDescription: 'desc',
        customerMaterialNumber: 'cust',
        targetPriceSource: undefined,
        quantity: 10,
        info: {
          description: [ValidationDescription.Not_Validated],
          valid: false,
        },
      };

      component.matNumberInput = {
        searchFormControl: new FormControl(item.materialNumber),
        clearInput: jest.fn(),
      } as any;
      component.matDescInput = {
        searchFormControl: new FormControl(item.materialDescription),
        clearInput: jest.fn(),
      } as any;

      component.customerMatNumberInput = {
        searchFormControl: new FormControl(item.customerMaterialNumber),
        clearInput: jest.fn(),
      } as any;

      component.quantityFormControl = {
        value: 10,
        reset: jest.fn(),
      } as any;

      component.targetPriceFormControl = {
        setValue: jest.fn(),
        reset: jest.fn(),
      } as any;

      component.targetPriceSourceFormControl = {
        value: TargetPriceSource.CUSTOMER,
        setValue: jest.fn(),
      } as any;

      component.newCaseCreation = true;
      component.targetPriceFormControl.setValue(null);

      component.addRow();
      expect(
        component['processCaseFacade'].addItemsToMaterialTable
      ).toHaveBeenCalledWith([item]);
    });
    test('should set the targetPriceSource when the Value when <> NO Entry and targetPrice has a value', () => {
      const item: MaterialTableItem = {
        materialNumber: '1234',
        materialDescription: 'desc',
        customerMaterialNumber: 'cust',
        targetPrice: 15,
        targetPriceSource: TargetPriceSource.CUSTOMER,
        quantity: 10,
        info: {
          description: [ValidationDescription.Not_Validated],
          valid: false,
        },
      };

      component.matNumberInput = {
        searchFormControl: new FormControl(item.materialNumber),
        clearInput: jest.fn(),
      } as any;
      component.matDescInput = {
        searchFormControl: new FormControl(item.materialDescription),
        clearInput: jest.fn(),
      } as any;

      component.customerMatNumberInput = {
        searchFormControl: new FormControl(item.customerMaterialNumber),
        clearInput: jest.fn(),
      } as any;

      component.quantityFormControl = {
        value: 10,
        reset: jest.fn(),
      } as any;

      component.targetPriceFormControl = {
        value: 15,
        setValue: jest.fn(),
        reset: jest.fn(),
      } as any;

      component.targetPriceSourceFormControl = {
        value: TargetPriceSource.CUSTOMER,
        setValue: jest.fn(),
      } as any;

      component.newCaseCreation = true;
      component.targetPriceFormControl.setValue('123');

      component.addRow();
      expect(
        component['processCaseFacade'].addItemsToMaterialTable
      ).toHaveBeenCalledWith([item]);
    });
  });
  describe('onQuantityKeyPress', () => {
    afterEach(() => {
      jest.clearAllMocks();
    });
    test('should call validateQuantityInputKeyPress', () => {
      jest
        .spyOn(miscUtils, 'validateQuantityInputKeyPress')
        .mockImplementation();
      const event = {} as KeyboardEvent;

      component.onQuantityKeyPress(event);
      expect(miscUtils.validateQuantityInputKeyPress).toHaveBeenCalledTimes(1);
      expect(miscUtils.validateQuantityInputKeyPress).toHaveBeenCalledWith(
        event
      );
    });

    test('should addRow on Enter if data is valid', () => {
      component.addRowEnabled = true;

      component.addRow = jest.fn();
      const event = { key: 'Enter' } as KeyboardEvent;

      component.onQuantityKeyPress(event);
      expect(miscUtils.validateQuantityInputKeyPress).not.toHaveBeenCalled();
      expect(component.addRow).toHaveBeenCalled();
    });

    test('should NOT caddRow on Enter if data is invalid', () => {
      jest
        .spyOn(miscUtils, 'validateQuantityInputKeyPress')
        .mockImplementation();
      component.addRowEnabled = false;

      component.addRow = jest.fn();
      const event = { key: 'Enter' } as KeyboardEvent;

      component.onQuantityKeyPress(event);
      expect(miscUtils.validateQuantityInputKeyPress).toHaveBeenCalledTimes(1);
      expect(component.addRow).not.toHaveBeenCalled();
    });
  });

  describe('materialHasInput', () => {
    test('should set materialNumberInput and emitHasInput', () => {
      component.materialNumberInput = false;
      component.materialHasInput(true);
      expect(component.materialNumberInput).toBeTruthy();
    });
  });

  describe('pasteFromClipboard', () => {
    test('should call pasteMaterialsService.pasteFromClipboard', () => {
      component.pasteFromClipboard();
      expect(
        component['pasteMaterialsService'].onPasteStart
      ).toHaveBeenCalled();
    });
  });

  describe('displaySnackBar', () => {
    test('should call snackBar.open', () => {
      component['matSnackBar'].open = jest.fn();
      component.displaySnackBar();
      expect(component['matSnackBar'].open).toHaveBeenCalled();
    });
  });
  describe('autoComplete Methods', () => {
    test('should call autocompleteFacade.autocomplete', () => {
      component.autocomplete(expect.anything(), expect.anything());
      expect(component['autoCompleteFacade'].autocomplete).toHaveBeenCalled();
    });
    test('should call autocompleteFacade.selectMaterialNumberDescriptionOrCustomerMaterial', () => {
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
