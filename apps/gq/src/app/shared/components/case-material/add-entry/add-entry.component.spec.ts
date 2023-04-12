import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MATERIAL_SANITY_CHECKS } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBarModule } from '@angular/material/snack-bar';

import { addMaterialRowDataItems } from '@gq/core/store/actions';
import { PasteButtonComponent } from '@gq/shared/ag-grid/custom-status-bar/paste-button/paste-button.component';
import { createComponentFactory, Spectator } from '@ngneat/spectator';
import { PushModule } from '@ngrx/component';
import { MockStore, provideMockStore } from '@ngrx/store/testing';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { CREATE_CASE_STORE_STATE_MOCK } from '../../../../../testing/mocks';
import {
  MaterialTableItem,
  ValidationDescription,
} from '../../../models/table';
import { HelperService } from '../../../services/helper/helper.service';
import { AutocompleteInputModule } from '../../autocomplete-input/autocomplete-input.module';
import { AddEntryComponent } from './add-entry.component';

describe('AddEntryComponent', () => {
  let component: AddEntryComponent;
  let mockStore: MockStore;
  let spectator: Spectator<AddEntryComponent>;

  const createComponent = createComponentFactory({
    component: AddEntryComponent,
    imports: [
      AutocompleteInputModule,
      MatInputModule,
      MatButtonModule,
      MatCardModule,
      MatIconModule,
      provideTranslocoTestingModule({ en: {} }),
      ReactiveFormsModule,
      PushModule,
      MatSnackBarModule,
      PasteButtonComponent,
    ],
    providers: [
      { provide: MATERIAL_SANITY_CHECKS, useValue: false },
      provideMockStore({
        initialState: {
          case: CREATE_CASE_STORE_STATE_MOCK,
        },
      }),
    ],
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

      component.addRow();
      expect(mockStore.dispatch).toHaveBeenCalledWith(
        addMaterialRowDataItems({ items: [item] })
      );
      expect(component.matNumberInput.clearInput).toHaveBeenCalledTimes(1);
      expect(component.matDescInput.clearInput).toHaveBeenCalledTimes(1);
      expect(component.quantityFormControl.reset).toHaveBeenCalledTimes(1);
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
