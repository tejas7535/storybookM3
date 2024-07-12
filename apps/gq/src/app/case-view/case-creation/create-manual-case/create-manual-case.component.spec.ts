import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

import { BehaviorSubject, Subject } from 'rxjs';

import {
  clearCreateCaseRowData,
  clearCustomer,
  clearOfferType,
  clearPurchaseOrderType,
  clearSectorGpsd,
  resetAllAutocompleteOptions,
} from '@gq/core/store/actions';
import { AutoCompleteFacade, RolesFacade } from '@gq/core/store/facades';
import { OfferTypeFacade } from '@gq/core/store/offer-type/offer-type.facade';
import { PurchaseOrderTypeFacade } from '@gq/core/store/purchase-order-type/purchase-order-type.facade';
import {
  CASE_CREATION_TYPES,
  CaseCreationEventParams,
  EVENT_NAMES,
} from '@gq/shared/models/tracking/gq-events';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { PushPipe } from '@ngrx/component';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { MockProvider } from 'ng-mocks';
import { marbles } from 'rxjs-marbles';

import { ApplicationInsightsService } from '@schaeffler/application-insights';
import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { CreateManualCaseComponent } from './create-manual-case.component';

describe('CreateManualCaseComponent', () => {
  let component: CreateManualCaseComponent;
  let spectator: Spectator<CreateManualCaseComponent>;
  let mockStore: MockStore;
  let applicationInsightsService: ApplicationInsightsService;

  let mockSubjectClose: Subject<boolean>;
  const mockUserHasAccess$$: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);

  const createComponent = createComponentFactory({
    component: CreateManualCaseComponent,
    imports: [provideTranslocoTestingModule({}), PushPipe],
    providers: [
      MockProvider(AutoCompleteFacade),
      MockProvider(PurchaseOrderTypeFacade),
      MockProvider(RolesFacade, {
        userHasRegionWorldOrGreaterChinaRole$:
          mockUserHasAccess$$.asObservable(),
      }),
      MockProvider(OfferTypeFacade),
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

  describe('userHasOfferTypeAccess$', () => {
    test(
      'should provide userHasOfferTypeAccess$',
      marbles((m) => {
        mockUserHasAccess$$.next(true);
        m.expect(component.userHasOfferTypeAccess$).toBeObservable('a', {
          a: true,
        });
      })
    );
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

  describe('sectorGpsdChanged', () => {
    test('should call selectSectorGpsdForCaseCreation', () => {
      component['sectorGpsdFacade'].selectSectorGpsdForCaseCreation = jest.fn();
      const gpsd = { id: 'test', name: 'test' };
      component.sectorGpsdChanged(gpsd);

      expect(
        component['sectorGpsdFacade'].selectSectorGpsdForCaseCreation
      ).toHaveBeenCalledWith(gpsd);
    });
  });

  describe('offerTypeChanged', () => {
    test('should call selectOfferTypeForCaseCreation', () => {
      component['offerTypeFacade'].selectOfferTypeForCaseCreation = jest.fn();
      const offerType = { id: 1, name: 'test' };
      component.offerTypeChanged(offerType);

      expect(
        component['offerTypeFacade'].selectOfferTypeForCaseCreation
      ).toHaveBeenCalledWith(offerType);
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
        expect(mockStore.dispatch).toHaveBeenCalledWith(
          clearPurchaseOrderType()
        );
        expect(mockStore.dispatch).toHaveBeenCalledWith(clearOfferType());
        expect(mockStore.dispatch).toHaveBeenCalledWith(clearSectorGpsd());
      });

      component.closeDialog();
      mockSubjectClose.next(true);
      component['shutdown$$'].next();
    });
  });
});
