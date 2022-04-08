import { MATERIAL_SANITY_CHECKS } from '@angular/material/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';

import { createComponentFactory, Spectator } from '@ngneat/spectator';
import { ReactiveComponentModule } from '@ngrx/component';
import { MockStore, provideMockStore } from '@ngrx/store/testing';

import { LoadingSpinnerModule } from '@schaeffler/loading-spinner';
import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import {
  autocomplete,
  resetCustomerFilter,
  selectAutocompleteOption,
  unselectAutocompleteOptions,
} from '../../../core/store';
import { AutocompleteInputModule } from '../../../shared/components/autocomplete-input/autocomplete-input.module';
import { FilterNames } from '../../../shared/components/autocomplete-input/filter-names.enum';
import { AddEntryModule } from '../../../shared/components/case-material/add-entry/add-entry.module';
import { InputTableModule } from '../../../shared/components/case-material/input-table/input-table.module';
import { DialogHeaderModule } from '../../../shared/components/header/dialog-header/dialog-header.module';
import { SelectSalesOrgModule } from '../../../shared/components/select-sales-org/select-sales-org.module';
import { AutocompleteSearch, IdValue } from '../../../shared/models/search';
import { CreateManualCaseComponent } from './create-manual-case.component';

describe('CreateManualCaseComponent', () => {
  let component: CreateManualCaseComponent;
  let spectator: Spectator<CreateManualCaseComponent>;
  let mockStore: MockStore;

  const createComponent = createComponentFactory({
    component: CreateManualCaseComponent,
    imports: [
      provideTranslocoTestingModule({}),
      SelectSalesOrgModule,
      InputTableModule,
      AutocompleteInputModule,
      AddEntryModule,
      LoadingSpinnerModule,
      ReactiveComponentModule,
      DialogHeaderModule,
      MatSnackBarModule,
    ],
    providers: [
      { provide: MATERIAL_SANITY_CHECKS, useValue: false },
      provideMockStore({
        initialState: {
          case: {
            autocompleteItems: [],
            customer: {
              salesOrg: [],
            },
          },
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
  describe('ngOnInit', () => {
    test('should set observables', () => {
      // tslint:disable-next-line: no-lifecycle-call
      component.ngOnInit();

      expect(component.customer$).toBeDefined();
      expect(component.createCaseLoading$).toBeDefined();
    });
  });
  describe('closeDialog', () => {
    test('should close matDialog', () => {
      mockStore.dispatch = jest.fn();
      component['dialogRef'].close = jest.fn();

      component.closeDialog();

      expect(component['dialogRef'].close).toHaveBeenCalledTimes(1);
      expect(mockStore.dispatch).toHaveBeenCalledWith(resetCustomerFilter());
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
});
