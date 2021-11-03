import { MatButtonModule } from '@angular/material/button';
import { MATERIAL_SANITY_CHECKS } from '@angular/material/core';
import { MatDialogRef } from '@angular/material/dialog';

import { createComponentFactory, Spectator } from '@ngneat/spectator';
import { ReactiveComponentModule } from '@ngrx/component';
import { MockStore, provideMockStore } from '@ngrx/store/testing';

import { LoadingSpinnerModule } from '@schaeffler/loading-spinner';
import { provideTranslocoTestingModule } from '@schaeffler/transloco';

import { CREATE_CASE_STORE_STATE_MOCK } from '../../../../testing/mocks';
import {
  autocomplete,
  importCase,
  selectAutocompleteOption,
  unselectAutocompleteOptions,
} from '../../../core/store';
import { AutocompleteInputModule } from '../../../shared/autocomplete-input/autocomplete-input.module';
import { FilterNames } from '../../../shared/autocomplete-input/filter-names.enum';
import { DialogHeaderModule } from '../../../shared/header/dialog-header/dialog-header.module';
import { AutocompleteSearch, IdValue } from '../../../shared/models/search';
import { ImportCaseComponent } from './import-case.component';

describe('ImportCaseComponent', () => {
  let component: ImportCaseComponent;
  let spectator: Spectator<ImportCaseComponent>;
  let mockStore: MockStore;

  const createComponent = createComponentFactory({
    component: ImportCaseComponent,
    imports: [
      AutocompleteInputModule,
      ReactiveComponentModule,
      MatButtonModule,
      LoadingSpinnerModule,
      DialogHeaderModule,
      provideTranslocoTestingModule({ en: {} }),
    ],
    providers: [
      { provide: MATERIAL_SANITY_CHECKS, useValue: false },
      provideMockStore({
        initialState: {
          case: CREATE_CASE_STORE_STATE_MOCK,
        },
      }),
      {
        provide: MatDialogRef,
        useValue: {},
      },
    ],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
    mockStore = spectator.inject(MockStore);
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });
  describe('closeDialog', () => {
    test('should close matDialog', () => {
      component['dialogRef'].close = jest.fn();

      component.closeDialog();

      expect(component['dialogRef'].close).toHaveBeenCalledTimes(1);
    });
  });

  describe('ngOnInit', () => {
    test('should set observables', () => {
      // tslint:disable-next-line: no-lifecycle-call
      component.ngOnInit();

      expect(component.quotation$).toBeDefined();
      expect(component.createCaseLoading$).toBeDefined();
    });
  });

  describe('autocomplete', () => {
    test('should dispatch autocomplete action', () => {
      mockStore.dispatch = jest.fn();
      const autocompleteSearch = new AutocompleteSearch('234', 'customer');

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

  describe('importQuotation', () => {
    test('should set quotationValid', () => {
      mockStore.dispatch = jest.fn();

      component.importQuotation();
      expect(mockStore.dispatch).toHaveBeenCalledWith(importCase());
    });
  });
});
