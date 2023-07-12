/* tslint:disable:no-unused-variable */
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { ApprovalFacade } from '@gq/core/store/approval/approval.facade';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';

import { ApprovalWorkflowHistoryIterationsComponent } from './approval-workflow-history-iterations.component';

describe('ApprovalWorkflowHistoryIterationsComponent', () => {
  let component: ApprovalWorkflowHistoryIterationsComponent;
  let spectator: Spectator<ApprovalWorkflowHistoryIterationsComponent>;

  const createComponent = createComponentFactory({
    component: ApprovalWorkflowHistoryIterationsComponent,
    providers: [
      {
        provide: ApprovalFacade,
        useValue: {},
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

  describe('toggleIteration', () => {
    test('should toggle', () => {
      const input = false;
      component.iterationVisible = input;
      component.toggleIteration();
      expect(component.iterationVisible).toBe(!input);
    });
  });
});
