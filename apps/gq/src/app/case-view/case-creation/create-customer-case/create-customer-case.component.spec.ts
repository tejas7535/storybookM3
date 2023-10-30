import { ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MATERIAL_SANITY_CHECKS } from '@angular/material/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';

import {
  resetCustomerFilter,
  resetPLsAndSeries,
  resetProductLineAndSeries,
} from '@gq/core/store/actions';
import { AutocompleteInputModule } from '@gq/shared/components/autocomplete-input/autocomplete-input.module';
import { DialogHeaderModule } from '@gq/shared/components/header/dialog-header/dialog-header.module';
import { SelectSalesOrgModule } from '@gq/shared/components/select-sales-org/select-sales-org.module';
import {
  CASE_CREATION_TYPES,
  CaseCreationEventParams,
  EVENT_NAMES,
} from '@gq/shared/models';
import { SharedPipesModule } from '@gq/shared/pipes/shared-pipes.module';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { PushModule } from '@ngrx/component';
import { MockStore, provideMockStore } from '@ngrx/store/testing';

import { ApplicationInsightsService } from '@schaeffler/application-insights';
import { LoadingSpinnerModule } from '@schaeffler/loading-spinner';
import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { VIEW_CASE_STATE_MOCK } from '../../../../testing/mocks';
import { AdditionalFiltersComponent } from './additional-filters/additional-filters.component';
import { FilterSelectionComponent } from './additional-filters/filter-selection/filter-selection.component';
import { CreateCustomerCaseComponent } from './create-customer-case.component';
import { MaterialSelectionComponent } from './material-selection/material-selection.component';
import { StatusBarComponent } from './status-bar/status-bar.component';

describe('CreateCustomerCaseComponent', () => {
  let component: CreateCustomerCaseComponent;
  let spectator: Spectator<CreateCustomerCaseComponent>;
  let mockStore: MockStore;
  let applicationInsightsService: ApplicationInsightsService;

  const createComponent = createComponentFactory({
    component: CreateCustomerCaseComponent,
    imports: [
      PushModule,
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
      {
        provide: ApplicationInsightsService,
        useValue: {
          logEvent: jest.fn(),
        },
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
    applicationInsightsService = spectator.inject(ApplicationInsightsService);
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
      component.autocompleteComponent = { resetInputField: jest.fn() } as any;
      component.resetAll();

      expect(component.materialSelection.resetAll).toHaveBeenCalledTimes(1);
      component.autocompleteComponent.resetInputField();
      expect(mockStore.dispatch).toHaveBeenCalledWith(
        resetProductLineAndSeries()
      );
    });
  });

  describe('tracking', () => {
    test('should track CASE_CREATION_STARTED onInit', () => {
      component.ngOnInit();

      expect(applicationInsightsService.logEvent).toHaveBeenCalledWith(
        EVENT_NAMES.CASE_CREATION_STARTED,
        { type: CASE_CREATION_TYPES.FROM_CUSTOMER } as CaseCreationEventParams
      );
    });

    test('should track CASE_CREATION_CANCELLED on cancel', () => {
      component['dialogRef'].close = jest.fn();
      component.closeDialog();

      expect(applicationInsightsService.logEvent).toHaveBeenCalledWith(
        EVENT_NAMES.CASE_CREATION_CANCELLED,
        { type: CASE_CREATION_TYPES.FROM_CUSTOMER } as CaseCreationEventParams
      );
    });

    test('should track CASE_CREATION_FINISHED on submit', () => {
      component['dialogRef'].close = jest.fn();
      component.createCase();

      expect(applicationInsightsService.logEvent).toHaveBeenCalledWith(
        EVENT_NAMES.CASE_CREATION_FINISHED,
        { type: CASE_CREATION_TYPES.FROM_CUSTOMER } as CaseCreationEventParams
      );
    });
  });
});
