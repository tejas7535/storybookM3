import { ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MATERIAL_SANITY_CHECKS } from '@angular/material/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';

import { createComponentFactory, Spectator } from '@ngneat/spectator';
import { ReactiveComponentModule } from '@ngrx/component';
import { MockStore, provideMockStore } from '@ngrx/store/testing';

import { LoadingSpinnerModule } from '@schaeffler/loading-spinner';
import { provideTranslocoTestingModule } from '@schaeffler/transloco';

import { VIEW_CASE_STATE_MOCK } from '../../../../testing/mocks';
import {
  autocomplete,
  resetCustomerFilter,
  resetPLsAndSeries,
  resetProductLineAndSeries,
  selectAutocompleteOption,
  unselectAutocompleteOptions,
} from '../../../core/store';
import { AutocompleteInputModule } from '../../../shared/autocomplete-input/autocomplete-input.module';
import { FilterNames } from '../../../shared/autocomplete-input/filter-names.enum';
import { DialogHeaderModule } from '../../../shared/header/dialog-header/dialog-header.module';
import { AutocompleteSearch, IdValue } from '../../../shared/models/search';
import { SharedPipesModule } from '../../../shared/pipes/shared-pipes.module';
import { SelectSalesOrgModule } from '../../../shared/select-sales-org/select-sales-org.module';
import { AdditionalFiltersComponent } from './additional-filters/additional-filters.component';
import { FilterSelectionComponent } from './additional-filters/filter-selection/filter-selection.component';
import { CreateCustomerCaseComponent } from './create-customer-case.component';
import { MaterialSelectionComponent } from './material-selection/material-selection.component';
import { StatusBarComponent } from './status-bar/status-bar.component';

describe('CreateCustomerCaseComponent', () => {
  let component: CreateCustomerCaseComponent;
  let spectator: Spectator<CreateCustomerCaseComponent>;
  let mockStore: MockStore;

  const createComponent = createComponentFactory({
    component: CreateCustomerCaseComponent,
    imports: [
      ReactiveComponentModule,
      DialogHeaderModule,
      MatIconModule,
      MatCheckboxModule,
      SelectSalesOrgModule,
      AutocompleteInputModule,
      MatFormFieldModule,
      MatSelectModule,
      ReactiveFormsModule,
      LoadingSpinnerModule,
      SharedPipesModule,
      provideTranslocoTestingModule({}),
    ],
    providers: [
      { provide: MATERIAL_SANITY_CHECKS, useValue: false },
      provideMockStore({
        initialState: { case: VIEW_CASE_STATE_MOCK },
      }),
      {
        provide: MatDialogRef,
        useValue: {},
      },
    ],
    declarations: [
      StatusBarComponent,
      MaterialSelectionComponent,
      AdditionalFiltersComponent,
      FilterSelectionComponent,
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
      mockStore.dispatch = jest.fn();
      component['dialogRef'].close = jest.fn();

      component.closeDialog();

      expect(component['dialogRef'].close).toHaveBeenCalledTimes(1);
      expect(mockStore.dispatch).toHaveBeenCalledWith(resetCustomerFilter());
      expect(mockStore.dispatch).toHaveBeenCalledWith(resetPLsAndSeries());
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

  describe('createCase', () => {
    test('should dispatch store', () => {
      mockStore.dispatch = jest.fn();

      component.createCase();

      expect(mockStore.dispatch).toHaveBeenCalledTimes(1);
    });
  });
  describe('resetAll', () => {
    test('should reset all', () => {
      mockStore.dispatch = jest.fn();
      component.materialSelection = { resetAll: jest.fn() } as any;
      component.unselectOptions = jest.fn();
      component.autocompleteComponent = { resetInputField: jest.fn() } as any;
      component.resetAll();

      expect(component.materialSelection.resetAll).toHaveBeenCalledTimes(1);
      expect(component.unselectOptions).toHaveBeenCalledTimes(1);
      component.autocompleteComponent.resetInputField();
      expect(mockStore.dispatch).toHaveBeenCalledWith(
        resetProductLineAndSeries()
      );
    });
  });
});
