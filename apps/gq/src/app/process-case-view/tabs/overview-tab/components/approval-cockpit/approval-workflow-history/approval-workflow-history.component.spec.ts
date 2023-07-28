import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

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
    expect(component.workflowEventsAsc).toEqual(
      [...APPROVAL_STATE_MOCK.approvalCockpit.approvalEvents].reverse()
    );
  });
});
