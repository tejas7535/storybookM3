import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import {
  ApprovalEventType,
  ApprovalWorkflowEvent,
  QuotationStatus,
} from '@gq/shared/models';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { APPROVAL_STATE_MOCK } from '../../../../../../../testing/mocks';
import { ApprovalWorkflowHistoryComponent } from './approval-workflow-history.component';

describe('ApprovalWorkflowHistoryComponent', () => {
  let component: ApprovalWorkflowHistoryComponent;
  let spectator: Spectator<ApprovalWorkflowHistoryComponent>;

  const createComponent = createComponentFactory({
    component: ApprovalWorkflowHistoryComponent,
    imports: [provideTranslocoTestingModule({ en: {} })],
    detectChanges: false,
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });

  test('should set workflow events', () => {
    component.workflowEvents =
      APPROVAL_STATE_MOCK.approvalCockpit.approvalEvents;

    expect(component.workflowEvents).toEqual(
      APPROVAL_STATE_MOCK.approvalCockpit.approvalEvents
    );

    expect(component.startedEvent).toEqual(
      [...APPROVAL_STATE_MOCK.approvalCockpit.approvalEvents].reverse()[0]
    );
  });

  describe('filterApprovalEventsForIterations', () => {
    test('should return empty list when undefined', () => {
      expect(
        component.filterApprovalEventsForIterations(
          undefined as ApprovalWorkflowEvent[]
        )
      ).toStrictEqual([]);
    });
    test('should not return auto approval', () => {
      const input: ApprovalWorkflowEvent[] = [
        { event: ApprovalEventType.APPROVED } as ApprovalWorkflowEvent,
        { event: ApprovalEventType.FORWARDED } as ApprovalWorkflowEvent,
        { event: ApprovalEventType.PRE_APPROVED } as ApprovalWorkflowEvent,
        { event: ApprovalEventType.REJECTED } as ApprovalWorkflowEvent,
        { event: ApprovalEventType.CANCELLED } as ApprovalWorkflowEvent,
        { event: ApprovalEventType.AUTO_APPROVAL } as ApprovalWorkflowEvent,
      ];
      const expected = [...input];
      expected.pop();

      const result = component.filterApprovalEventsForIterations(input);
      expect(result).toStrictEqual(expected);
    });

    test('should return dismiss start event', () => {
      const expected: ApprovalWorkflowEvent[] = [
        { event: ApprovalEventType.APPROVED } as ApprovalWorkflowEvent,
        { event: ApprovalEventType.APPROVED } as ApprovalWorkflowEvent,
      ];

      const input = [
        ...expected,
        { event: ApprovalEventType.STARTED } as ApprovalWorkflowEvent,
      ];
      const result = component.filterApprovalEventsForIterations(input);
      expect(result).toStrictEqual(expected);
    });

    test('should return dismiss released event', () => {
      const expected: ApprovalWorkflowEvent[] = [
        { event: ApprovalEventType.APPROVED } as ApprovalWorkflowEvent,
        { event: ApprovalEventType.APPROVED } as ApprovalWorkflowEvent,
      ];

      const input = [
        ...expected,
        { event: ApprovalEventType.RELEASED } as ApprovalWorkflowEvent,
      ];
      const result = component.filterApprovalEventsForIterations(input);
      expect(result).toStrictEqual(expected);
    });

    test('should return dismiss rejected/rejected (quotationStatus/eventType) event', () => {
      const expected: ApprovalWorkflowEvent[] = [
        { event: ApprovalEventType.APPROVED } as ApprovalWorkflowEvent,
        {
          event: ApprovalEventType.REJECTED,
        } as ApprovalWorkflowEvent,
      ];

      const input = [
        ...expected,
        {
          event: ApprovalEventType.REJECTED,
          quotationStatus: QuotationStatus.REJECTED,
        } as ApprovalWorkflowEvent,
      ];
      const result = component.filterApprovalEventsForIterations(input);
      expect(result).toStrictEqual(expected);
    });

    test('should return dismiss released and started event', () => {
      const expected: ApprovalWorkflowEvent[] = [
        { event: ApprovalEventType.APPROVED } as ApprovalWorkflowEvent,
        { event: ApprovalEventType.APPROVED } as ApprovalWorkflowEvent,
      ];

      const input = [
        ...expected,
        { event: ApprovalEventType.RELEASED } as ApprovalWorkflowEvent,
        { event: ApprovalEventType.STARTED } as ApprovalWorkflowEvent,
      ];
      const result = component.filterApprovalEventsForIterations(input);
      expect(result).toStrictEqual(expected);
    });

    test('should return dismiss released and started event, but keep Start Events within the list', () => {
      const expected: ApprovalWorkflowEvent[] = [
        { event: ApprovalEventType.APPROVED } as ApprovalWorkflowEvent,
        { event: ApprovalEventType.APPROVED } as ApprovalWorkflowEvent,
        { event: ApprovalEventType.STARTED } as ApprovalWorkflowEvent,
        { event: ApprovalEventType.CANCELLED } as ApprovalWorkflowEvent,
      ];

      const input = [
        ...expected,
        { event: ApprovalEventType.RELEASED } as ApprovalWorkflowEvent,
        { event: ApprovalEventType.STARTED } as ApprovalWorkflowEvent,
      ];
      const result = component.filterApprovalEventsForIterations(input);
      expect(result).toStrictEqual(expected);
    });
  });
});
