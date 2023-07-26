/* tslint:disable:no-unused-variable */

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import {
  ApprovalEventType,
  ApprovalWorkflowEvent,
  QuotationStatus,
} from '@gq/shared/models';
import { TransformationService } from '@gq/shared/services/transformation/transformation.service';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { MockPipe } from 'ng-mocks';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { ApprovalWorkflowApproverComponent } from './approval-workflow-approver.component';
import { APPROVAL_STATUS_OF_APPROVER_DISPLAY } from './consts/approval-status-display';
import { ApproverDisplayPipe } from './pipes/approver-display.pipe';
import { UserInitialLettersPipe } from './pipes/user-initial-letters.pipe';

describe('ApprovalWorkflowApproverComponent', () => {
  let component: ApprovalWorkflowApproverComponent;
  let spectator: Spectator<ApprovalWorkflowApproverComponent>;

  const createComponent = createComponentFactory({
    component: ApprovalWorkflowApproverComponent,
    imports: [provideTranslocoTestingModule({ en: {} })],
    declarations: [UserInitialLettersPipe, ApproverDisplayPipe],
    providers: [
      MockPipe(UserInitialLettersPipe),
      MockPipe(ApproverDisplayPipe),
      {
        provide: TransformationService,
        useValue: {
          transformDate: jest.fn(() => 'transformedDate'),
        },
      },
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
  });
  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('eventComment', () => {
    test('should return translated Text when forwarded', () => {
      Object.defineProperty(component, 'workflowEvent', {
        value: {
          event: ApprovalEventType.FORWARDED,
          comment: 'anyComment',
        } as unknown as ApprovalWorkflowEvent,
      });

      expect(component.eventComment).toBe(
        'processCaseView.tabs.overview.approvalCockpit.approvalStatusOfApprover.forwardedTo'
      );
    });

    test('should return the comment', () => {
      Object.defineProperty(component, 'workflowEvent', {
        value: {
          event: ApprovalEventType.STARTED,
          comment: 'anyComment',
        } as unknown as ApprovalWorkflowEvent,
      });

      expect(component.eventComment).toBe('anyComment');
    });
  });

  describe('workflowStatus', () => {
    test('when workflow is in Progress, but event is undefined, user has not approved yet --> IN_APPROVAL', () => {
      Object.defineProperty(component, 'workflowEvent', {
        value: undefined,
      });

      Object.defineProperty(component, 'workflowInProgress', {
        value: true,
      });

      expect(component.approvalStatusOfApprover).toBe(
        APPROVAL_STATUS_OF_APPROVER_DISPLAY.IN_APPROVAL
      );
    });
    test('when workflow is in Progress, and event is APPROVED --> APPROVED', () => {
      Object.defineProperty(component, 'workflowEvent', {
        value: { event: ApprovalEventType.APPROVED },
      });

      Object.defineProperty(component, 'workflowInProgress', {
        value: true,
      });

      expect(component.approvalStatusOfApprover).toBe(
        APPROVAL_STATUS_OF_APPROVER_DISPLAY.APPROVED
      );
    });

    test('when workflow is in Progress, and event is FORWARDED --> FORWARDED', () => {
      Object.defineProperty(component, 'workflowEvent', {
        value: { event: ApprovalEventType.FORWARDED },
      });

      Object.defineProperty(component, 'workflowInProgress', {
        value: true,
      });

      expect(component.approvalStatusOfApprover).toBe(
        APPROVAL_STATUS_OF_APPROVER_DISPLAY.FORWARDED
      );
    });

    test('when workflow is in Progress, and event is REJECTED --> REJECTED', () => {
      Object.defineProperty(component, 'workflowEvent', {
        value: { event: ApprovalEventType.REJECTED },
      });

      Object.defineProperty(component, 'workflowInProgress', {
        value: true,
      });

      expect(component.approvalStatusOfApprover).toBe(
        APPROVAL_STATUS_OF_APPROVER_DISPLAY.REJECTED
      );
    });

    test('when workflow is in Progress, and event is not found --> emptyString', () => {
      Object.defineProperty(component, 'workflowEvent', {
        value: { event: 'ANY-FANCY-EVENT' },
      });

      Object.defineProperty(component, 'workflowInProgress', {
        value: true,
      });

      expect(component.approvalStatusOfApprover).toBe('');
    });

    test('when quotation status is REJECTED and event is REJECTED --> REJECTED', () => {
      Object.defineProperty(component, 'quotationStatus', {
        value: QuotationStatus.REJECTED,
      });

      Object.defineProperty(component, 'workflowEvent', {
        value: { event: ApprovalEventType.REJECTED },
      });

      expect(component.approvalStatusOfApprover).toBe(
        APPROVAL_STATUS_OF_APPROVER_DISPLAY.REJECTED
      );
    });

    test('when quotation status is REJECTED but event is undefined --> emptyString', () => {
      Object.defineProperty(component, 'quotationStatus', {
        value: QuotationStatus.REJECTED,
      });

      Object.defineProperty(component, 'workflowEvent', {
        value: undefined,
      });

      expect(component.approvalStatusOfApprover).toBe('');
    });
  });
});
