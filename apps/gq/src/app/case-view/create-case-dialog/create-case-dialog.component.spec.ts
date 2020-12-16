import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { AgGridModule } from '@ag-grid-community/angular';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { configureTestSuite } from 'ng-bullet';

import { provideTranslocoTestingModule } from '@schaeffler/transloco';

import {
  autocomplete,
  importCase,
  selectAutocompleteOption,
  unselectAutocompleteOptions,
} from '../../core/store/actions';
import { AutocompleteSearch, IdValue } from '../../core/store/models';
import { SharedModule } from '../../shared';
import { AutocompleteInputModule } from '../../shared/autocomplete-input/autocomplete-input.module';
import { AddEntryModule } from '../../shared/case-material/add-entry/add-entry.module';
import { InputTableModule } from '../../shared/case-material/input-table/input-table.module';
import { CreateCaseDialogComponent } from './create-case-dialog.component';

jest.mock('@ngneat/transloco', () => ({
  ...jest.requireActual('@ngneat/transloco'),
  translate: jest.fn(() => 'translate it'),
}));

describe('CreateCaseDialogComponent', () => {
  let component: CreateCaseDialogComponent;
  let fixture: ComponentFixture<CreateCaseDialogComponent>;
  let mockStore: MockStore;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [CreateCaseDialogComponent],
      imports: [
        AddEntryModule,
        AgGridModule.withComponents([]),
        AutocompleteInputModule,
        InputTableModule,
        MatButtonModule,
        MatIconModule,
        MatInputModule,
        MatCardModule,
        NoopAnimationsModule,
        SharedModule,
        provideTranslocoTestingModule({}),
      ],
      providers: [
        provideMockStore({}),
        {
          provide: MatDialogRef,
          useValue: {},
        },
      ],
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateCaseDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    mockStore = TestBed.inject(MockStore);
  });

  test('should create', () => {
    expect(component).toBeTruthy();
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
  describe('quotationValid', () => {
    test('should set quotationValid', () => {
      component.quotationIsValid = false;
      component.quotationValid(true);
      expect(component.quotationIsValid).toBeTruthy();
    });
  });
  describe('openQuotation', () => {
    test('should set quotationValid', () => {
      mockStore.dispatch = jest.fn();

      component.openQuotation();
      expect(mockStore.dispatch).toHaveBeenCalledWith(importCase());
    });
  });
  describe('quotationHasInput', () => {
    test('should set quotationInput', () => {
      component.customerDisabled = false;
      component.quotationHasInput(true);
      expect(component.customerDisabled).toBeTruthy();
    });
  });
  describe('customerHasInput', () => {
    test('should set customerInput', () => {
      component.quotationDisabled = false;
      component.customerHasInput(true);
      expect(component.quotationDisabled).toBeTruthy();
    });
  });
});
