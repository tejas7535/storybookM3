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

  const createComponent = createComponentFactory({
    component: AddEntryComponent,
    imports: [
      provideTranslocoTestingModule({ en: {} }),
      ReactiveFormsModule,
      SharedDirectivesModule,
      PushPipe,
    ],
    providers: [
      MockProvider(PasteMaterialsService),
      MockProvider(MatSnackBar),
      MockProvider(AutoCompleteFacade),
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
    test('should set quantityvalid if when quantityFormControl valuechanges', () => {
      component.rowInputValid = jest.fn();

      component.ngOnInit();
      const testValue = 10;
      component.quantityFormControl.setValue(testValue);

      expect(component.quantityValid).toBeTruthy();
      expect(component.quantity).toEqual(10);
      expect(component.rowInputValid).toHaveBeenCalled();
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
        component.targetPriceSourceFormControl.setValue(
          TargetPriceSource.NO_ENTRY
        );
        component.targetPriceSourceFormControl.setValue = jest.fn();
        component.addSubscriptions();
        component.targetPriceFormControl.setValue('123');
        expect(
          component.targetPriceSourceFormControl.setValue
        ).toHaveBeenCalledWith(TargetPriceSource.INTERNAL, {
          emitEvent: false,
        });
      });
      test('should not set set the TargetPriceSource when targetPriceFormControl is NOT valid', () => {
        component.targetPriceFormControl.setValue(null);
        component.targetPriceSourceFormControl.setValue = jest.fn();
        component.addSubscriptions();
        component.targetPriceFormControl.setValue('sdf');
        expect(
          component.targetPriceSourceFormControl.setValue
        ).not.toHaveBeenCalled();
      });
      test('should not update the targetPriceSource when it is already set to <> No_ENTRY when targetPrice is set/changed', () => {
        component.targetPriceFormControl.setValue(null);
        component.targetPriceSourceFormControl.setValue(
          TargetPriceSource.CUSTOMER
        );
        component.targetPriceSourceFormControl.setValue = jest.fn();
        component.addSubscriptions();
        component.targetPriceFormControl.setValue('123');
        expect(
          component.targetPriceSourceFormControl.setValue
        ).not.toHaveBeenCalled();
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
        component.targetPriceFormControl.reset = jest.fn();
        component.addSubscriptions();
        component.targetPriceSourceFormControl.setValue(
          TargetPriceSource.NO_ENTRY
        );
        expect(component.targetPriceFormControl.reset).toHaveBeenCalledWith(
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
  });
  describe('materialNumberValid', () => {
    test('should set materialNumberIsValid', () => {
      component.rowInputValid = jest.fn();
      component.materialInputValid(true);

      expect(component.materialInputIsValid).toBeTruthy();
      expect(component.rowInputValid).toHaveBeenCalledTimes(1);
    });
  });

  describe('rowInputValid', () => {
    beforeEach(() => {
      component.materialNumberInput = true;
    });
    test('should set addRowEnabled to true', () => {
      component.materialInputIsValid = true;
      component.quantityValid = true;
      component.quantity = 10;
      component.rowInputValid();
      expect(component.addRowEnabled).toBeTruthy();
    });
    test('should set addRowEnabled to false', () => {
      component.materialInputIsValid = false;
      component.rowInputValid();
      expect(component.addRowEnabled).toBeFalsy();
    });
  });
  describe('quantityValidator', () => {
    test('should return undefined', () => {
      const control = { value: 10 } as unknown as any;
      component.rowInputValid = jest.fn();
      const response = component.quantityValidator(control);

      expect(component.quantityValid).toBeTruthy();
      expect(component.quantity).toEqual(10);
      expect(component.quantityValid).toBeTruthy();
      expect(component.rowInputValid).toHaveBeenCalledTimes(1);
      expect(response).toBeUndefined();
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
      component.quantity = item.quantity;
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
      component.quantity = item.quantity;
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
      component.quantity = item.quantity;
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
});
