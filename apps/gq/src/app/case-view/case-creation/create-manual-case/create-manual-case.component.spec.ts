import { MATERIAL_SANITY_CHECKS } from '@angular/material/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';

import { of, Subject } from 'rxjs';

import {
  clearCreateCaseRowData,
  clearCustomer,
  resetAllAutocompleteOptions,
} from '@gq/core/store/actions';
import { createComponentFactory, Spectator } from '@ngneat/spectator';
import { PushModule } from '@ngrx/component';
import { MockStore, provideMockStore } from '@ngrx/store/testing';

import { ApplicationInsightsService } from '@schaeffler/application-insights';
import { LoadingSpinnerModule } from '@schaeffler/loading-spinner';
import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { AutocompleteInputModule } from '../../../shared/components/autocomplete-input/autocomplete-input.module';
import { AddEntryModule } from '../../../shared/components/case-material/add-entry/add-entry.module';
import { InputTableModule } from '../../../shared/components/case-material/input-table/input-table.module';
import { DialogHeaderModule } from '../../../shared/components/header/dialog-header/dialog-header.module';
import { SelectSalesOrgModule } from '../../../shared/components/select-sales-org/select-sales-org.module';
import {
  CASE_CREATION_TYPES,
  CaseCreationEventParams,
  EVENT_NAMES,
} from '../../../shared/models';
import { CreateManualCaseComponent } from './create-manual-case.component';

describe('CreateManualCaseComponent', () => {
  let component: CreateManualCaseComponent;
  let spectator: Spectator<CreateManualCaseComponent>;
  let mockStore: MockStore;
  let applicationInsightsService: ApplicationInsightsService;
  let beforeClosed: () => Subject<boolean>;
  let mockSubjectClose: Subject<boolean>;

  const createComponent = createComponentFactory({
    component: CreateManualCaseComponent,
    imports: [
      provideTranslocoTestingModule({}),
      SelectSalesOrgModule,
      InputTableModule,
      AutocompleteInputModule,
      AddEntryModule,
      LoadingSpinnerModule,
      PushModule,
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
        useValue: {
          beforeClosed: jest.fn(() => of(beforeClosed)),
        } as unknown as MatDialogRef<CreateManualCaseComponent>,
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
    jest.restoreAllMocks();
    mockSubjectClose = new Subject<boolean>();
    beforeClosed = () => mockSubjectClose;
    spectator = createComponent();

    component = spectator.debugElement.componentInstance;
    mockStore = spectator.inject(MockStore);
    applicationInsightsService = spectator.inject(ApplicationInsightsService);
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });
  describe('ngOnInit', () => {
    test('should set observables', () => {
      // tslint:disable-next-line: no-lifecycle-call
      component.ngOnInit();

      expect(component.createCaseLoading$).toBeDefined();
    });
  });

  describe('tracking', () => {
    test('should track CASE_CREATION_STARTED onInit', () => {
      component.ngOnInit();

      expect(applicationInsightsService.logEvent).toHaveBeenCalledWith(
        EVENT_NAMES.CASE_CREATION_STARTED,
        { type: CASE_CREATION_TYPES.MANUAL } as CaseCreationEventParams
      );
    });

    test('should track CASE_CREATION_CANCELLED on cancel', () => {
      component['dialogRef'].close = jest.fn();
      component.closeDialog();

      expect(applicationInsightsService.logEvent).toHaveBeenCalledWith(
        EVENT_NAMES.CASE_CREATION_CANCELLED,
        { type: CASE_CREATION_TYPES.MANUAL } as CaseCreationEventParams
      );
    });
  });

  describe('closeDialog', () => {
    test('should close matDialog', () => {
      mockStore.dispatch = jest.fn();
      component['dialogRef'].close = jest.fn();

      component.closeDialog();

      expect(component['dialogRef'].close).toHaveBeenCalledTimes(1);
    });

    test('should call resetActions when dialog closing', () => {
      mockStore.dispatch = jest.fn();
      component['dialogRef'].close = jest.fn();
      component['dialogRef'].beforeClosed().subscribe((_value) => {
        expect(mockStore.dispatch).toHaveBeenCalledWith(
          resetAllAutocompleteOptions()
        );
        expect(mockStore.dispatch).toHaveBeenCalledWith(
          clearCreateCaseRowData()
        );
        expect(mockStore.dispatch).toHaveBeenCalledWith(clearCustomer());
      });

      component.closeDialog();
      mockSubjectClose.next(true);
      component['shutdown$$'].next();
    });
  });
});
