/* tslint:disable:no-unused-variable */
import {
  CUSTOM_ELEMENTS_SCHEMA,
  SimpleChange,
  SimpleChanges,
} from '@angular/core';

import { ApprovalWorkflowEvent } from '@gq/shared/models';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';

import { ApprovalWorkflowHistoryIterationsComponent } from './approval-workflow-history-iterations.component';

describe('ApprovalWorkflowHistoryIterationsComponent', () => {
  let component: ApprovalWorkflowHistoryIterationsComponent;
  let spectator: Spectator<ApprovalWorkflowHistoryIterationsComponent>;

  const createComponent = createComponentFactory({
    component: ApprovalWorkflowHistoryIterationsComponent,
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('toggleIteration', () => {
    test('should toggle', () => {
      const input = false;
      component.iterationVisible = input;
      component.toggleIteration();
      expect(component.iterationVisible).toBe(!input);
    });
  });

  describe('getIconColor on ngOnChanges', () => {
    let changes: SimpleChanges;

    beforeEach(() => {
      component.isApproved = false;
      component.inApproval = false;
      component.rejectedEvent = undefined;
      component.cancelledEvent = undefined;
    });
    test('should return empty string', () => {
      changes = { anyField: new SimpleChange(undefined, 'hello', true) };
      component.ngOnChanges(changes);
      expect(component.iconColor).toBe('');
    });
    test('should return empty string as default', () => {
      changes = { isApproved: new SimpleChange(undefined, false, true) };
      component.ngOnChanges(changes);
      expect(component.iconColor).toBe('');
    });
    test('should return green', () => {
      changes = { isApproved: new SimpleChange(undefined, true, true) };
      component.ngOnChanges(changes);
      expect(component.iconColor).toBe('text-approval-status-green');
    });
    test('should return red when rejected', () => {
      changes = {
        rejectedEvent: new SimpleChange(
          undefined,
          {} as ApprovalWorkflowEvent,
          true
        ),
      };
      component.ngOnChanges(changes);
      expect(component.iconColor).toBe('text-error');
    });
    test('should return red when cancelled', () => {
      changes = {
        cancelledEvent: new SimpleChange(
          undefined,
          {} as ApprovalWorkflowEvent,
          true
        ),
      };
      component.ngOnChanges(changes);
      expect(component.iconColor).toBe('text-error');
    });
  });
});
