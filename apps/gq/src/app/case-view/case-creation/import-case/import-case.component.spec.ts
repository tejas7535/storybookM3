import { MatButtonModule } from '@angular/material/button';
import { MATERIAL_SANITY_CHECKS } from '@angular/material/core';
import { MatDialogRef } from '@angular/material/dialog';

import {
  autocomplete,
  importCase,
  resetAllAutocompleteOptions,
  selectAutocompleteOption,
  unselectAutocompleteOptions,
} from '@gq/core/store/actions';
import { AutocompleteInputModule } from '@gq/shared/components/autocomplete-input/autocomplete-input.module';
import { FilterNames } from '@gq/shared/components/autocomplete-input/filter-names.enum';
import { DialogHeaderModule } from '@gq/shared/components/header/dialog-header/dialog-header.module';
import {
  CASE_CREATION_TYPES,
  CaseCreationEventParams,
  EVENT_NAMES,
} from '@gq/shared/models';
import { AutocompleteSearch, IdValue } from '@gq/shared/models/search';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { PushPipe } from '@ngrx/component';
import { MockStore, provideMockStore } from '@ngrx/store/testing';

import { ApplicationInsightsService } from '@schaeffler/application-insights';
import { LoadingSpinnerModule } from '@schaeffler/loading-spinner';
import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { CREATE_CASE_STORE_STATE_MOCK } from '../../../../testing/mocks';
import { ImportCaseComponent } from './import-case.component';

describe('ImportCaseComponent', () => {
  let component: ImportCaseComponent;
  let spectator: Spectator<ImportCaseComponent>;
  let mockStore: MockStore;
  let applicationInsightsService: ApplicationInsightsService;

  const createComponent = createComponentFactory({
    component: ImportCaseComponent,
    imports: [
      AutocompleteInputModule,
      PushPipe,
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
      {
        provide: ApplicationInsightsService,
        useValue: {
          logEvent: jest.fn(),
        },
      },
    ],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
    mockStore = spectator.inject(MockStore);
    applicationInsightsService = spectator.inject(ApplicationInsightsService);
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });
  describe('closeDialog', () => {
    test('should close matDialog and reset autocomplete', () => {
      component['dialogRef'].close = jest.fn();
      mockStore.dispatch = jest.fn();

      component.closeDialog();

      expect(component['dialogRef'].close).toHaveBeenCalledTimes(1);
      expect(mockStore.dispatch).toHaveBeenCalledWith(
        resetAllAutocompleteOptions()
      );
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

  describe('tracking', () => {
    test('should track CASE_CREATION_STARTED onInit', () => {
      component.ngOnInit();

      expect(applicationInsightsService.logEvent).toHaveBeenCalledWith(
        EVENT_NAMES.CASE_CREATION_STARTED,
        { type: CASE_CREATION_TYPES.SAP_IMPORT } as CaseCreationEventParams
      );
    });

    test('should track CASE_CREATION_CANCELLED on cancel', () => {
      component['dialogRef'].close = jest.fn();
      component.closeDialog();

      expect(applicationInsightsService.logEvent).toHaveBeenCalledWith(
        EVENT_NAMES.CASE_CREATION_CANCELLED,
        { type: CASE_CREATION_TYPES.SAP_IMPORT } as CaseCreationEventParams
      );
    });

    test('should track CASE_CREATION_FINISHED on submit', () => {
      component['dialogRef'].close = jest.fn();
      component.importQuotation();

      expect(applicationInsightsService.logEvent).toHaveBeenCalledWith(
        EVENT_NAMES.CASE_CREATION_FINISHED,
        { type: CASE_CREATION_TYPES.SAP_IMPORT } as CaseCreationEventParams
      );
    });
  });
});
