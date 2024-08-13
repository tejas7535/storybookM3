import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

import {
  resetCustomerFilter,
  resetPLsAndSeries,
  resetProductLineAndSeries,
} from '@gq/core/store/actions';
import {
  CASE_CREATION_TYPES,
  CaseCreationEventParams,
  EVENT_NAMES,
} from '@gq/shared/models';
import { SharedPipesModule } from '@gq/shared/pipes/shared-pipes.module';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { PushPipe } from '@ngrx/component';
import { MockStore, provideMockStore } from '@ngrx/store/testing';

import { ApplicationInsightsService } from '@schaeffler/application-insights';
import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { VIEW_CASE_STATE_MOCK } from '../../../../testing/mocks';
import { CreateCustomerCaseComponent } from './create-customer-case.component';

describe('CreateCustomerCaseComponent', () => {
  let component: CreateCustomerCaseComponent;
  let spectator: Spectator<CreateCustomerCaseComponent>;
  let mockStore: MockStore;
  let applicationInsightsService: ApplicationInsightsService;

  const createComponent = createComponentFactory({
    component: CreateCustomerCaseComponent,
    imports: [PushPipe, SharedPipesModule, provideTranslocoTestingModule({})],
    providers: [
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
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
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
