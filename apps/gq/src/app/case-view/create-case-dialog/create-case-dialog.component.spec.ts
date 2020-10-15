import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { configureTestSuite } from 'ng-bullet';

import { provideTranslocoTestingModule } from '@schaeffler/transloco';

import {
  autocomplete,
  selectQuotationOption,
  unselectQuotationOptions,
} from '../../core/store/actions';
import { AutocompleteSearch, IdValue } from '../../core/store/models';
import { AutocompleteInputModule } from './autocomplete-input/autocomplete-input.module';
import { CreateCaseDialogComponent } from './create-case-dialog.component';

describe('CreateCaseDialogComponent', () => {
  let component: CreateCaseDialogComponent;
  let fixture: ComponentFixture<CreateCaseDialogComponent>;
  let mockStore: MockStore;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [CreateCaseDialogComponent],
      imports: [
        provideTranslocoTestingModule({}),
        AutocompleteInputModule,
        FlexLayoutModule,
        MatButtonModule,
        MatCardModule,
      ],
      providers: [provideMockStore({})],
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

      component.unselectQuotationOptions();

      expect(mockStore.dispatch).toHaveBeenCalledWith(
        unselectQuotationOptions()
      );
    });
  });
  describe('addQuotationOption', () => {
    test('should dispatch addOption action', () => {
      mockStore.dispatch = jest.fn();
      const option = new IdValue('aud', 'Audi', true);
      component.selectQuotationOption(option);

      expect(mockStore.dispatch).toHaveBeenCalledWith(
        selectQuotationOption({ option })
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
});
