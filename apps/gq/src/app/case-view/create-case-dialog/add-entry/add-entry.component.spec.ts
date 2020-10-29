import { BACKSLASH, FIVE, PAGE_UP } from '@angular/cdk/keycodes';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { configureTestSuite } from 'ng-bullet';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import {
  addRowDataItem,
  autocomplete,
  selectAutocompleteOption,
  unselectAutocompleteOptions,
} from '../../../core/store';
import { AutocompleteSearch, IdValue } from '../../../core/store/models';
import { SharedModule } from '../../../shared';
import { AutocompleteInputModule } from '../autocomplete-input/autocomplete-input.module';
import { AddEntryComponent } from './add-entry.component';

describe('InputbarComponent', () => {
  let component: AddEntryComponent;
  let fixture: ComponentFixture<AddEntryComponent>;
  let mockStore: MockStore;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [AddEntryComponent],
      imports: [
        AutocompleteInputModule,
        MatInputModule,
        MatButtonModule,
        MatCardModule,
        MatIconModule,
        SharedTranslocoModule,
        SharedModule,
        ReactiveFormsModule,
      ],
      providers: [provideMockStore({})],
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    mockStore = TestBed.inject(MockStore);
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    test('should set quantityvalid if when quantityFormControl valuechanges', () => {
      component.rowInputValid = jest.fn();

      // tslint:disable-next-line: no-lifecycle-call
      component.ngOnInit();
      const testValue = '10';
      component.quantityFormControl.setValue(testValue);

      expect(component.quantityValid).toBeTruthy();
      expect(component.quantity).toEqual(testValue);
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

      component.unselectOptions('customer');

      expect(mockStore.dispatch).toHaveBeenCalledWith(
        unselectAutocompleteOptions({ filter: 'customer' })
      );
    });
  });
  describe('selectAutocompleteOption', () => {
    test('should dispatch selectAutocompleteOption action', () => {
      mockStore.dispatch = jest.fn();
      const option = new IdValue('aud', 'Audi', true);
      const filter = 'customer';
      component.selectOption(option, filter);

      expect(mockStore.dispatch).toHaveBeenCalledWith(
        selectAutocompleteOption({ option, filter })
      );
    });
  });
  describe('materialNumberValid', () => {
    test('should set materialNumberisValid', () => {
      component.rowInputValid = jest.fn();
      component.materialNumberValid(true);

      expect(component.materialNumberIsValid).toBeTruthy();
      expect(component.rowInputValid).toHaveBeenCalledTimes(1);
    });
  });

  describe('rowInputValid', () => {
    test('should set addRowEnabled to true', () => {
      component.materialNumberIsValid = true;
      component.quantityValid = true;
      component.rowInputValid();
      expect(component.addRowEnabled).toBeTruthy();
    });
    test('should set addRowEnabled to false', () => {
      component.materialNumberIsValid = false;
      component.rowInputValid();
      expect(component.addRowEnabled).toBeFalsy();
    });
  });

  describe('addRow', () => {
    test('should dispatch action', () => {
      const item = { materialNumber: '1234', quantity: 10, info: true };
      component.materialNumber = item.materialNumber;
      component.quantity = item.quantity;
      mockStore.dispatch = jest.fn();
      component.matNumberInput = {
        clearInput: jest.fn(),
      } as any;

      component.quantityFormControl = {
        setValue: jest.fn(),
      } as any;

      component.addRow();
      expect(mockStore.dispatch).toHaveBeenCalledWith(
        addRowDataItem({ items: [item] })
      );
      expect(component.matNumberInput.clearInput).toHaveBeenCalledTimes(1);
      expect(component.quantityFormControl.setValue).toHaveBeenCalledTimes(1);
    });
  });
  describe('materialHasInput', () => {
    test('should set materialNumberInput and emitHasInput', () => {
      component.emitHasInput = jest.fn();
      component.materialNumberInput = false;
      component.materialHasInput(true);
      expect(component.materialNumberInput).toBeTruthy();
      expect(component.emitHasInput).toHaveBeenCalledTimes(1);
    });
  });
  describe('numberOnly', () => {
    test('should return false if not number', () => {
      const eventMock = {
        keyCode: PAGE_UP,
      };
      expect(component.numberOnly(eventMock)).toBeFalsy();
    });
    test('should return false if not number', () => {
      const eventMock = {
        which: BACKSLASH,
      };
      expect(component.numberOnly(eventMock)).toBeFalsy();
    });
    test('should return true if number', () => {
      const eventMock = {
        keyCode: FIVE,
      };
      expect(component.numberOnly(eventMock)).toBeTruthy();
    });
  });
  describe('toggle Expanded', () => {
    test('toggle', () => {
      component.isExpanded = false;
      component.toggleExpanded();
      expect(component.isExpanded).toBeTruthy();
    });
  });
});
