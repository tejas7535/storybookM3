import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MATERIAL_SANITY_CHECKS } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { createComponentFactory, Spectator } from '@ngneat/spectator';
import { TranslocoModule } from '@ngneat/transloco';
import { ReactiveComponentModule } from '@ngrx/component';
import { MockStore, provideMockStore } from '@ngrx/store/testing';

import { provideTranslocoTestingModule } from '@schaeffler/transloco';

import { CREATE_CASE_STORE_STATE_MOCK } from '../../../../testing/mocks';
import {
  addMaterialRowDataItem,
  autocomplete,
  setSelectedAutocompleteOption,
  unselectAutocompleteOptions,
} from '../../../core/store';
import { SharedModule } from '../../../shared';
import { FilterNames } from '../../autocomplete-input/filter-names.enum';
import { InfoIconModule } from '../../info-icon/info-icon.module';
import { AutocompleteSearch, IdValue } from '../../models/search';
import { MaterialTableItem, ValidationDescription } from '../../models/table';
import { AutocompleteInputModule } from './../../autocomplete-input/autocomplete-input.module';
import { AddEntryComponent } from './add-entry.component';

jest.mock('@ngneat/transloco', () => ({
  ...jest.requireActual<TranslocoModule>('@ngneat/transloco'),
  translate: jest.fn(() => 'translate it'),
}));

describe('AddEntryComponent', () => {
  let component: AddEntryComponent;
  let mockStore: MockStore;
  let spectator: Spectator<AddEntryComponent>;
  let matSnackBar: MatSnackBar;

  const createComponent = createComponentFactory({
    component: AddEntryComponent,
    imports: [
      AutocompleteInputModule,
      MatInputModule,
      MatButtonModule,
      MatCardModule,
      MatIconModule,
      InfoIconModule,
      provideTranslocoTestingModule({ en: {} }),
      SharedModule,
      ReactiveFormsModule,
      ReactiveComponentModule,
      MatSnackBarModule,
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
    matSnackBar = spectator.inject(MatSnackBar);
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
  describe('autocomplete', () => {
    test('should dispatch autocomplete action', () => {
      mockStore.dispatch = jest.fn();
      const autocompleteSearch = new AutocompleteSearch('name', 'Hans');

      component.autocomplete(autocompleteSearch);

      expect(mockStore.dispatch).toHaveBeenCalledWith(
        autocomplete({ autocompleteSearch })
      );
    });
  });
  describe('unselectQuotationOptions', () => {
    test('should dispatch unselectQuotationOptions action', () => {
      mockStore.dispatch = jest.fn();

      component.unselectOptions(FilterNames.CUSTOMER);

      expect(mockStore.dispatch).toHaveBeenCalledWith(
        unselectAutocompleteOptions({ filter: FilterNames.CUSTOMER })
      );
    });
  });
  describe('selectAutocompleteOption', () => {
    test('should dispatch selectAutocompleteOption action', () => {
      mockStore.dispatch = jest.fn();
      const option = new IdValue('aud', 'Audi', true);
      const filter = FilterNames.CUSTOMER;
      component.selectOption(option, filter);

      expect(mockStore.dispatch).toHaveBeenCalledWith(
        setSelectedAutocompleteOption({ option, filter })
      );
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
          description: [ValidationDescription.Valid],
          valid: true,
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
        addMaterialRowDataItem({ items: [item] })
      );
      expect(component.matNumberInput.clearInput).toHaveBeenCalledTimes(1);
      expect(component.matDescInput.clearInput).toHaveBeenCalledTimes(1);
      expect(component.quantityFormControl.reset).toHaveBeenCalledTimes(1);
    });
  });
  describe('materialHasInput', () => {
    test('should set materialNumberInput and emitHasInput', () => {
      component.materialNumberInput = false;
      component.materialHasInput(true);
      expect(component.materialNumberInput).toBeTruthy();
    });
  });
  describe('displaySnackBar', () => {
    test('show info message with action link', () => {
      matSnackBar.open = jest.fn();

      component.displaySnackBar();

      expect(matSnackBar.open).toHaveBeenCalledWith(
        'translate it',
        'translate it',
        { duration: 5000 }
      );
    });
  });
});
