/* tslint:disable:no-unused-variable */
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';

import { ApprovalWorkflowHistorySectionComponent } from './approval-workflow-history-section.component';

describe('ApprovalWorkflowHistorySectionComponent', () => {
  let component: ApprovalWorkflowHistorySectionComponent;
  let spectator: Spectator<ApprovalWorkflowHistorySectionComponent>;

  const createComponent = createComponentFactory({
    component: ApprovalWorkflowHistorySectionComponent,
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('getBorderClass', () => {
    it('should return empty string if borderClass is undefined', () => {
      expect(component.getBorderClass).toEqual('');
    });

    it('should return borderClass as string', () => {
      component.borderClass = ['border-1', 'border-2'];
      expect(component.getBorderClass).toEqual('border-1 border-2');
    });
  });
});
