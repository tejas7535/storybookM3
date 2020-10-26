import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { AgGridModule } from '@ag-grid-community/angular';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { configureTestSuite } from 'ng-bullet';

import { provideTranslocoTestingModule } from '@schaeffler/transloco';

import {
  autocomplete,
  selectAutocompleteOption,
  unselectAutocompleteOptions,
} from '../../core/store/actions';
import { AutocompleteSearch, IdValue } from '../../core/store/models';
import { SharedModule } from '../../shared';
import { AddEntryModule } from './add-entry/add-entry.module';
import { AutocompleteInputModule } from './autocomplete-input/autocomplete-input.module';
import { CreateCaseDialogComponent } from './create-case-dialog.component';
import { InputTableModule } from './input-table/input-table.module';

jest.mock('@ngneat/transloco', () => ({
  ...jest.requireActual('@ngneat/transloco'),
  translate: jest.fn(() => 'translate it'),
}));

describe('CreateCaseDialogComponent', () => {
  let component: CreateCaseDialogComponent;
  let fixture: ComponentFixture<CreateCaseDialogComponent>;
  let mockStore: MockStore;
  let router: Router;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [CreateCaseDialogComponent],
      imports: [
        AddEntryModule,
        AgGridModule.withComponents([]),
        AutocompleteInputModule,
        InputTableModule,
        MatButtonModule,
        MatInputModule,
        MatCardModule,
        NoopAnimationsModule,
        SharedModule,
        RouterTestingModule.withRoutes([]),
        provideTranslocoTestingModule({}),
      ],
      providers: [provideMockStore({})],
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateCaseDialogComponent);

    router = TestBed.inject(Router);
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
      component.selectOption(
        {
          value: '1224',
          selected: true,
          id: '12345',
        },
        'quotation'
      );
      spyOn(router, 'navigate');
      component.openQuotation();
      expect(router.navigate).toHaveBeenCalled();
    });
  });
});
