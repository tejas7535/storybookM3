import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ValidationErrors } from '@angular/forms';
import { MatLegacyDialogRef as MatDialogRef } from '@angular/material/legacy-dialog';

import { of } from 'rxjs';

import { ApprovalFacade } from '@gq/core/store/approval/approval.facade';
import { Approver, UpdateFunction } from '@gq/shared/models';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { MockProvider } from 'ng-mocks';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { ForwardApprovalWorkflowModalComponent } from './forward-approval-workflow-modal.component';

describe('ForwardApprovalWorkflowModalComponent', () => {
  let component: ForwardApprovalWorkflowModalComponent;
  let spectator: Spectator<ForwardApprovalWorkflowModalComponent>;

  const createComponent = createComponentFactory({
    component: ForwardApprovalWorkflowModalComponent,
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
    test('should close dialog when forward approval workflow succeeded', () => {
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

  describe('set error message', () => {
    const requiredApproverError = 'requiredApproverError';
    const invalidApproverError = 'invalidApproverError';

    beforeEach(() => {
      Object.defineProperty(component, 'REQUIRED_APPROVER_ERROR_MESSAGE', {
        value: requiredApproverError,
      });
      Object.defineProperty(component, 'INVALID_APPROVER_ERROR_MESSAGE', {
        value: invalidApproverError,
      });

      const facadeMock: ApprovalFacade = {
        updateApprovalWorkflowSucceeded$: of(),
      } as unknown as ApprovalFacade;

      Object.defineProperty(component, 'approvalFacade', {
        value: facadeMock,
      });

      component.ngOnInit();
    });

    test('should init error message', () => {
      expect(component.errorMessage).toBe(requiredApproverError);
    });

    test('should set an error message for required', () => {
      component.errorMessage = undefined;
      component.approverFormControl.setErrors({ required: true });
      expect(component.errorMessage).toBe(requiredApproverError);
    });

    test('should set an error message for invalid approver', () => {
      component.approverFormControl.setErrors({ invalidUser: true });
      expect(component.errorMessage).toBe(invalidApproverError);
    });

    test('should set empty string when control has no errors', () => {
      component.approverFormControl.setErrors(undefined as ValidationErrors);
      expect(component.errorMessage).toBe('');
    });
  });

  describe('forwardApprovalWorkflow', () => {
    test('should forward approval workflow', () => {
      const updateApprovalWorkflowSpy = jest.spyOn(
        component.approvalFacade,
        'updateApprovalWorkflow'
      );
      const userId = 'testUserId';

      component.approverFormControl.setValue({ userId } as Approver);

      component.forwardApprovalWorkflow();

      expect(updateApprovalWorkflowSpy).toHaveBeenCalledWith({
        updateFunction: UpdateFunction.FORWARD_WF_ITEM,
        forwardTo: userId,
      });
    });

    test('should not forward approval workflow if approver is not valid', () => {
      const updateApprovalWorkflowSpy = jest.spyOn(
        component.approvalFacade,
        'updateApprovalWorkflow'
      );

      component.approverFormControl.setValue({
        firstName: 'tester',
      } as Approver);

      component.forwardApprovalWorkflow();

      expect(updateApprovalWorkflowSpy).not.toHaveBeenCalled();
    });

    test('should not forward approval workflow if approver is not set', () => {
      const updateApprovalWorkflowSpy = jest.spyOn(
        component.approvalFacade,
        'updateApprovalWorkflow'
      );

      component.forwardApprovalWorkflow();

      expect(updateApprovalWorkflowSpy).not.toHaveBeenCalled();
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
