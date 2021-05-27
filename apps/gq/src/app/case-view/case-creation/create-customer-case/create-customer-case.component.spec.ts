import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

import { createComponentFactory, Spectator } from '@ngneat/spectator';
import { ReactiveComponentModule } from '@ngrx/component';
import { MockStore, provideMockStore } from '@ngrx/store/testing';

import { UnderConstructionModule } from '@schaeffler/empty-states';
import { provideTranslocoTestingModule } from '@schaeffler/transloco';

import {
  autocomplete,
  selectAutocompleteOption,
  unselectAutocompleteOptions,
} from '../../../core/store';
import { AutocompleteInputModule } from '../../../shared/autocomplete-input/autocomplete-input.module';
import { FilterNames } from '../../../shared/autocomplete-input/filter-names.enum';
import { DialogHeaderModule } from '../../../shared/header/dialog-header/dialog-header.module';
import { AutocompleteSearch, IdValue } from '../../../shared/models/search';
import { SelectSalesOrgModule } from '../../../shared/select-sales-org/select-sales-org.module';
import { AdditionalFiltersComponent } from './additional-filters/additional-filters.component';
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
      UnderConstructionModule,
      SelectSalesOrgModule,
      AutocompleteInputModule,
      provideTranslocoTestingModule({}),
    ],
    providers: [
      provideMockStore({}),
      {
        provide: MatDialogRef,
        useValue: {},
      },
    ],
    declarations: [
      StatusBarComponent,
      MaterialSelectionComponent,
      AdditionalFiltersComponent,
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

  describe('resetAll', () => {
    test('should reset all', () => {
      component.materialSelection = { resetAll: jest.fn() } as any;
      component.unselectOptions = jest.fn();
      component.autocompleteComponent = { resetInputField: jest.fn() } as any;
      component.resetAll();

      expect(component.materialSelection.resetAll).toHaveBeenCalledTimes(1);
      expect(component.unselectOptions).toHaveBeenCalledTimes(1);
      component.autocompleteComponent.resetInputField();
    });
  });
});
