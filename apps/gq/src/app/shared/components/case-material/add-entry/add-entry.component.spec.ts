import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

import { addMaterialRowDataItems } from '@gq/core/store/actions';
import { AutoCompleteFacade } from '@gq/core/store/facades';
import { LOCALE_DE } from '@gq/shared/constants';
import { PasteMaterialsService } from '@gq/shared/services/paste-materials/paste-materials.service';
import { createComponentFactory, Spectator } from '@ngneat/spectator';
import { TranslocoLocaleService } from '@ngneat/transloco-locale';
import { PushModule } from '@ngrx/component';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { MockProvider } from 'ng-mocks';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { CREATE_CASE_STORE_STATE_MOCK } from '../../../../../testing/mocks';
import { SharedDirectivesModule } from '../../../../shared/directives/shared-directives.module';
import {
  MaterialTableItem,
  ValidationDescription,
} from '../../../models/table';
import { HelperService } from '../../../services/helper/helper.service';
import { AddEntryComponent } from './add-entry.component';

describe('AddEntryComponent', () => {
  let component: AddEntryComponent;
  let mockStore: MockStore;
  let spectator: Spectator<AddEntryComponent>;

  const createComponent = createComponentFactory({
    component: AddEntryComponent,
    imports: [
      provideTranslocoTestingModule({ en: {} }),
      ReactiveFormsModule,
      SharedDirectivesModule,
      PushModule,
    ],
    providers: [
      MockProvider(PasteMaterialsService),
      MockProvider(MatSnackBar),
      MockProvider(AutoCompleteFacade),
      MockProvider(TranslocoLocaleService, {
        getLocale: jest.fn(() => LOCALE_DE.id),
      }),
      provideMockStore({
        initialState: {
          case: CREATE_CASE_STORE_STATE_MOCK,
        },
      }),
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
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
  });
  describe('materialNumberValid', () => {
    test('should set materialNumberisValid', () => {
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

      component.quantityFormControl = {
        reset: jest.fn(),
      } as any;

      component.targetPriceFormControl = {
        reset: jest.fn(),
      } as any;

      component.addRow();
      expect(mockStore.dispatch).toHaveBeenCalledWith(
        addMaterialRowDataItems({ items: [item] })
      );
      expect(component.matNumberInput.clearInput).toHaveBeenCalledTimes(1);
      expect(component.matDescInput.clearInput).toHaveBeenCalledTimes(1);
      expect(component.quantityFormControl.reset).toHaveBeenCalledTimes(1);
      expect(component.targetPriceFormControl.reset).toHaveBeenCalledTimes(1);
    });
  });
  describe('onQuantityKeyPress', () => {
    test('should call validateQuantityInputKeyPress', () => {
      HelperService.validateQuantityInputKeyPress = jest.fn();
      const event = {} as KeyboardEvent;

      component.onQuantityKeyPress(event);
      expect(HelperService.validateQuantityInputKeyPress).toHaveBeenCalledTimes(
        1
      );
      expect(HelperService.validateQuantityInputKeyPress).toHaveBeenCalledWith(
        event
      );
    });

    test('should addRow on Enter if data is valid', () => {
      component.addRowEnabled = true;

      component.addRow = jest.fn();
      HelperService.validateQuantityInputKeyPress = jest.fn();
      const event = { key: 'Enter' } as KeyboardEvent;

      component.onQuantityKeyPress(event);
      expect(
        HelperService.validateQuantityInputKeyPress
      ).not.toHaveBeenCalled();
      expect(component.addRow).toHaveBeenCalled();
    });

    test('should NOT caddRow on Enter if data is invalid', () => {
      component.addRowEnabled = false;

      component.addRow = jest.fn();
      HelperService.validateQuantityInputKeyPress = jest.fn();
      const event = { key: 'Enter' } as KeyboardEvent;

      component.onQuantityKeyPress(event);
      expect(HelperService.validateQuantityInputKeyPress).toHaveBeenCalledTimes(
        1
      );
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
