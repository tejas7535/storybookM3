import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

import { Subject } from 'rxjs';

import {
  clearCreateCaseRowData,
  clearCustomer,
  resetAllAutocompleteOptions,
} from '@gq/core/store/actions';
import { AutoCompleteFacade } from '@gq/core/store/facades';
import { PurchaseOrderTypeFacade } from '@gq/core/store/purchase-order-type/purchase-order-type.facade';
import {
  CASE_CREATION_TYPES,
  CaseCreationEventParams,
  EVENT_NAMES,
} from '@gq/shared/models';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { PushModule } from '@ngrx/component';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { MockProvider } from 'ng-mocks';

import { ApplicationInsightsService } from '@schaeffler/application-insights';
import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { CreateManualCaseComponent } from './create-manual-case.component';

describe('CreateManualCaseComponent', () => {
  let component: CreateManualCaseComponent;
  let spectator: Spectator<CreateManualCaseComponent>;
  let mockStore: MockStore;
  let applicationInsightsService: ApplicationInsightsService;
  // const beforeClosed: () => Subject<boolean> = () => new Subject<boolean>();
  let mockSubjectClose: Subject<boolean>;

  const createComponent = createComponentFactory({
    component: CreateManualCaseComponent,
    imports: [provideTranslocoTestingModule({}), PushModule],
    providers: [
      MockProvider(AutoCompleteFacade),
      MockProvider(PurchaseOrderTypeFacade),
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
          beforeClosed: () => new Subject<boolean>(),
        } as unknown as MatDialogRef<CreateManualCaseComponent>,
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
    jest.restoreAllMocks();
    mockSubjectClose = new Subject<boolean>();
    // beforeClosed = () => mockSubjectClose;
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

  describe('purchaseOrderTypeChanged', () => {
    test('should call selectPurchaseOrderTypeForCaseCreation', () => {
      component[
        'purchaseOrderTypeFacade'
      ].selectPurchaseOrderTypeForCaseCreation = jest.fn();
      const purchaseOrderType = { id: 'test', name: 'test' };
      component.purchaseOrderTypeChanged(purchaseOrderType);

      expect(
        component['purchaseOrderTypeFacade']
          .selectPurchaseOrderTypeForCaseCreation
      ).toHaveBeenCalledWith(purchaseOrderType);
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
