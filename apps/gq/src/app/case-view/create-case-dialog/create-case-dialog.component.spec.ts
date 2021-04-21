import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { AgGridModule } from '@ag-grid-community/angular';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { ReactiveComponentModule } from '@ngrx/component';
import { MockStore, provideMockStore } from '@ngrx/store/testing';

import { provideTranslocoTestingModule } from '@schaeffler/transloco';

import {
  autocomplete,
  importCase,
  selectAutocompleteOption,
  unselectAutocompleteOptions,
} from '../../core/store/actions';
import { SharedModule } from '../../shared';
import { AutocompleteInputModule } from '../../shared/autocomplete-input/autocomplete-input.module';
import { FilterNames } from '../../shared/autocomplete-input/filter-names.enum';
import { AddEntryModule } from '../../shared/case-material/add-entry/add-entry.module';
import { InputTableModule } from '../../shared/case-material/input-table/input-table.module';
import { LoadingSpinnerModule } from '../../shared/loading-spinner/loading-spinner.module';
import { AutocompleteSearch, IdValue } from '../../shared/models/search';
import { CreateCaseDialogComponent } from './create-case-dialog.component';
import { SelectSalesOrgModule } from './select-sales-org/select-sales-org.module';

jest.mock('@ngneat/transloco', () => ({
  ...jest.requireActual('@ngneat/transloco'),
  translate: jest.fn(() => 'translate it'),
}));

describe('CreateCaseDialogComponent', () => {
  let component: CreateCaseDialogComponent;
  let spectator: Spectator<CreateCaseDialogComponent>;
  let mockStore: MockStore;

  const createComponent = createComponentFactory({
    component: CreateCaseDialogComponent,
    declarations: [CreateCaseDialogComponent],
    imports: [
      AddEntryModule,
      AgGridModule.withComponents([]),
      AutocompleteInputModule,
      InputTableModule,
      LoadingSpinnerModule,
      MatButtonModule,
      MatIconModule,
      MatInputModule,
      MatCardModule,
      NoopAnimationsModule,
      ReactiveComponentModule,
      SelectSalesOrgModule,
      SharedModule,
      provideTranslocoTestingModule({}),
    ],
    providers: [
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
  describe('toggle Expanded', () => {
    test('toggle', () => {
      component.isExpanded = false;
      component.toggleExpanded();
      expect(component.isExpanded).toBeTruthy();
    });
  });
});
