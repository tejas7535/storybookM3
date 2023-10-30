import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

import { of } from 'rxjs';

import { ApprovalFacade } from '@gq/core/store/approval/approval.facade';
import { UpdateFunction } from '@gq/shared/models';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { MockProvider } from 'ng-mocks';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { CancelWorkflowModalComponent } from './cancel-workflow-modal.component';

describe('CancelWorkflowModalComponent', () => {
  let component: CancelWorkflowModalComponent;
  let spectator: Spectator<CancelWorkflowModalComponent>;

  const createComponent = createComponentFactory({
    component: CancelWorkflowModalComponent,
    imports: [provideTranslocoTestingModule({})],
    providers: [
      { provide: MatDialogRef, useValue: {} },

      MockProvider(ApprovalFacade),
    ],
    detectChanges: false,
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.component;
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    test('should close dialog when cancel approval workflow information succeeded', () => {
      const facadeMock: ApprovalFacade = {
        updateApprovalWorkflowSucceeded$: of(true),
      } as unknown as ApprovalFacade;

      Object.defineProperty(component, 'approvalFacade', {
        value: facadeMock,
      });

      const closeDialogSpy = jest.spyOn(component, 'closeDialog');
      closeDialogSpy.mockImplementation();

      component.ngOnInit();

      expect(closeDialogSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('cancelApprovalWorkflow', () => {
    test('should cancel approval workflow', () => {
      const updateApprovalWorkflowSpy = jest.spyOn(
        component.approvalFacade,
        'updateApprovalWorkflow'
      );

      component.cancelApprovalWorkflow();

      expect(updateApprovalWorkflowSpy).toHaveBeenCalledWith({
        updateFunction: UpdateFunction.CANCEL_WORKFLOW,
      });
    });
  });

  describe('closeDialog', () => {
    test('should call dialogRef.close', () => {
      const closeMock = jest.fn();
      component['dialogRef'].close = closeMock;

      component.closeDialog();

      expect(closeMock).toHaveBeenCalledTimes(1);
    });
  });

  describe('ngOnDestroy', () => {
    test('should emit', () => {
      component['shutdown$$'].next = jest.fn();
      component['shutdown$$'].complete = jest.fn();

      component.ngOnDestroy();

      expect(component['shutdown$$'].next).toHaveBeenCalled();
      expect(component['shutdown$$'].complete).toHaveBeenCalled();
    });
  });
});
