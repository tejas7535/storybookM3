import { CUSTOM_ELEMENTS_SCHEMA, DestroyRef } from '@angular/core';

import { BehaviorSubject, of } from 'rxjs';

import { RfqProcessHistory } from '@gq/core/store/rfq-4-process/model/process-history.model';
import { Rfq4ProcessFacade } from '@gq/core/store/rfq-4-process/rfq-4-process.facade';
import { ActiveDirectoryUser } from '@gq/shared/models';
import { Rfq4Status } from '@gq/shared/models/quotation-detail/cost';
import { MicrosoftGraphMapperService } from '@gq/shared/services/rest/microsoft-graph-mapper/microsoft-graph-mapper.service';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { MockComponent } from 'ng-mocks';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { RFQ_4_PROCESS_HISTORY_MOCK } from '../../../../../../../testing/mocks/models/calculator/rfq-4-overview/rfq-4-overview-data-mock';
import { ProcessHistoryComponent } from './process-history.component';
import { RecalculationDataComponent } from './recalculation-data/recalculation-data.component';
import { RecalculationProgressComponent } from './recalculation-progress/recalculation-progress.component';

describe('ProcessHistoryComponent', () => {
  let component: ProcessHistoryComponent;
  let spectator: Spectator<ProcessHistoryComponent>;
  const processHistorySubject: BehaviorSubject<RfqProcessHistory> =
    new BehaviorSubject(RFQ_4_PROCESS_HISTORY_MOCK);

  const createComponent = createComponentFactory({
    component: ProcessHistoryComponent,
    imports: [
      provideTranslocoTestingModule({ en: {} }),
      MockComponent(RecalculationProgressComponent),
      MockComponent(RecalculationDataComponent),
    ],
    providers: [
      {
        provide: Rfq4ProcessFacade,
        useValue: {
          processHistory$: processHistorySubject.asObservable(),
        },
      },
      {
        provide: MicrosoftGraphMapperService,
        useValue: {
          getActiveDirectoryUserByUserId: jest.fn(() =>
            of({
              userId: 'user-1',
            } as ActiveDirectoryUser)
          ),
        },
      },
      {
        provide: DestroyRef,
        useValue: {
          onDestroy: jest.fn(),
        },
      },
    ],
    detectChanges: false,
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
  });

  beforeEach(() => {
    spectator = createComponent();
    spectator.setInput('quotationDetail', {
      gqPositionId: '123',
      rfq4: {
        rfq4Status: Rfq4Status.IN_PROGRESS,
      },
    });
    component = spectator.debugElement.componentInstance;
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    test('should fetch assignee if hasAssignee is true', () => {
      const msGraphMapperServiceSpy = jest.spyOn(
        component['msGraphMapperService'],
        'getActiveDirectoryUserByUserId'
      );
      expect(msGraphMapperServiceSpy).toHaveBeenCalledWith(
        RFQ_4_PROCESS_HISTORY_MOCK.assignedUserId
      );
    });
  });

  describe('activeStep', () => {
    test('should return 1 when in progress without assignee', () => {
      processHistorySubject.next({
        ...RFQ_4_PROCESS_HISTORY_MOCK,
        rfq4Status: Rfq4Status.IN_PROGRESS,
        assignedUserId: null,
      });
      spectator.detectChanges();
      expect(component.activeStep()).toBe(1);
    });
    test('should return 2 when in progress with assignee', () => {
      processHistorySubject.next({
        ...RFQ_4_PROCESS_HISTORY_MOCK,
        rfq4Status: Rfq4Status.IN_PROGRESS,
        assignedUserId: 'user-1',
      });
      spectator.detectChanges();
      expect(component.activeStep()).toBe(2);
    });

    test('should return 3 when confirmed', () => {
      processHistorySubject.next({
        ...RFQ_4_PROCESS_HISTORY_MOCK,
        rfq4Status: Rfq4Status.CONFIRMED,
      });
      spectator.detectChanges();
      expect(component.activeStep()).toBe(3);
    });
    test('should return 1 when cancelled without assignee', () => {
      processHistorySubject.next({
        ...RFQ_4_PROCESS_HISTORY_MOCK,
        rfq4Status: Rfq4Status.CANCELLED,
        assignedUserId: null,
      });
      spectator.detectChanges();
      expect(component.activeStep()).toBe(1);
    });
    test('should return 2 when cancelled with assignee', () => {
      processHistorySubject.next({
        ...RFQ_4_PROCESS_HISTORY_MOCK,
        rfq4Status: Rfq4Status.CANCELLED,
        assignedUserId: 'user-1',
      });
      spectator.detectChanges();
      expect(component.activeStep()).toBe(2);
    });
  });

  describe('canCancel', () => {
    test('should return true when status is IN_PROGRESS', () => {
      processHistorySubject.next({
        ...RFQ_4_PROCESS_HISTORY_MOCK,
        rfq4Status: Rfq4Status.IN_PROGRESS,
      });
      expect(component.canCancel()).toBe(true);
    });

    test('should return false when status is CONFIRMED', () => {
      processHistorySubject.next({
        ...RFQ_4_PROCESS_HISTORY_MOCK,
        rfq4Status: Rfq4Status.CONFIRMED,
      });
      expect(component.canCancel()).toBe(false);
    });

    test('should return false when status is CANCELLED', () => {
      processHistorySubject.next({
        ...RFQ_4_PROCESS_HISTORY_MOCK,
        rfq4Status: Rfq4Status.CANCELLED,
      });
      expect(component.canCancel()).toBe(false);
    });
  });
});
