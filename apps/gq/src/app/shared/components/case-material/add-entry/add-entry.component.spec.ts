import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

import { BehaviorSubject, of } from 'rxjs';

import { ActiveCaseFacade } from '@gq/core/store/active-case/active-case.facade';
import { CreateCaseFacade } from '@gq/core/store/create-case/create-case.facade';
import { AutoCompleteFacade } from '@gq/core/store/facades';
import { ProcessCaseActions } from '@gq/core/store/process-case';
import { SalesOrg } from '@gq/core/store/reducers/models';
import { LOCALE_DE } from '@gq/shared/constants';
import { SharedDirectivesModule } from '@gq/shared/directives/shared-directives.module';
import { Customer, CustomerId } from '@gq/shared/models';
import { PasteMaterialsService } from '@gq/shared/services/paste-materials/paste-materials.service';
import * as miscUtils from '@gq/shared/utils/misc.utils';
import { TranslocoLocaleService } from '@jsverse/transloco-locale';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { PushPipe } from '@ngrx/component';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { MockProvider } from 'ng-mocks';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { CREATE_CASE_STORE_STATE_MOCK } from '../../../../../testing/mocks';
import {
  MaterialTableItem,
  ValidationDescription,
} from '../../../models/table';
import { AddEntryComponent } from './add-entry.component';

describe('AddEntryComponent', () => {
  let component: AddEntryComponent;
  let mockStore: MockStore;
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
    mockStore = spectator.inject(MockStore);
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
      mockStore.dispatch = jest.fn();
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
      expect(mockStore.dispatch).toHaveBeenCalledWith(
        ProcessCaseActions.addNewItemsToMaterialTable({
          items: [{ ...item, targetPriceSource: undefined }],
        })
      );
      expect(component.matNumberInput.clearInput).toHaveBeenCalledTimes(1);
      expect(component.matDescInput.clearInput).toHaveBeenCalledTimes(1);
      expect(component.quantityFormControl.reset).toHaveBeenCalledTimes(1);
      expect(component.targetPriceFormControl.reset).toHaveBeenCalledTimes(1);
      expect(component.customerMatNumberInput.clearInput).toHaveBeenCalled();
      expect(
        component.targetPriceSourceFormControl.setValue
      ).toHaveBeenCalled();
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
