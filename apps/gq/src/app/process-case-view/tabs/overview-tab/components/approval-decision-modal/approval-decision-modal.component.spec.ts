import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { of } from 'rxjs';

import { ApprovalFacade } from '@gq/core/store/approval/approval.facade';
import { UpdateFunction } from '@gq/shared/models';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { TranslocoService } from '@ngneat/transloco';
import { MockProvider } from 'ng-mocks';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { ApprovalModalType } from '../../models';
import { ApprovalDecisionModalComponent } from './approval-decision-modal.component';
describe('ApprovalDecisionModalComponent', () => {
  let component: ApprovalDecisionModalComponent;
  let spectator: Spectator<ApprovalDecisionModalComponent>;

  const COMMENT_FORM_CONTROL_NAME = 'comment';

  const createComponent = createComponentFactory({
    component: ApprovalDecisionModalComponent,
    imports: [provideTranslocoTestingModule({})],
    providers: [
      { provide: MatDialogRef, useValue: {} },
      FormBuilder,
      MockProvider(TranslocoService),
      MockProvider(ApprovalFacade),
      {
        provide: MAT_DIALOG_DATA,
        useValue: { type: ApprovalModalType.APPROVE_CASE },
      },
    ],
    detectChanges: false,
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.component;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    beforeEach(() => {
      const facadeMock: ApprovalFacade = {
        updateApprovalWorkflowSucceeded$: of(),
      } as unknown as ApprovalFacade;

      Object.defineProperty(component, 'approvalFacade', {
        value: facadeMock,
      });
    });

    test('should set comment in formGroup', () => {
      component.ngOnInit();

      expect(component.formGroup.get(COMMENT_FORM_CONTROL_NAME)).toBeDefined();
      expect(
        component.formGroup
          .get(COMMENT_FORM_CONTROL_NAME)
          .hasValidator(Validators.required)
      ).toBe(false);
    });

    test('should set required validator for reject case', () => {
      (component as any).modalData = {
        type: ApprovalModalType.REJECT_CASE,
      };

      component.ngOnInit();

      expect(
        component.formGroup
          .get(COMMENT_FORM_CONTROL_NAME)
          .hasValidator(Validators.required)
      ).toBe(true);
    });

    test('should close dialog when update approval workflow succeeded', () => {
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

  describe('updateApprovalWorkflow', () => {
    test('should approve', () => {
      component.approvalFacade.updateApprovalWorkflowSucceeded$ = of();

      component.ngOnInit();

      const updateApprovalWorkflowSpy = jest.spyOn(
        component.approvalFacade,
        'updateApprovalWorkflow'
      );

      component.updateApprovalWorkflow();

      expect(updateApprovalWorkflowSpy).toHaveBeenCalledWith({
        updateFunction: UpdateFunction.APPROVE_QUOTATION,
        comment: undefined,
      });
    });

    test('should reject', () => {
      (component as any).modalData = {
        type: ApprovalModalType.REJECT_CASE,
      };
      component.approvalFacade.updateApprovalWorkflowSucceeded$ = of();

      component.ngOnInit();

      const formValue = {
        comment: 'test comment ',
      };
      const updateApprovalWorkflowSpy = jest.spyOn(
        component.approvalFacade,
        'updateApprovalWorkflow'
      );

      component.formGroup.setValue(formValue);
      component.updateApprovalWorkflow();

      expect(updateApprovalWorkflowSpy).toHaveBeenCalledWith({
        updateFunction: UpdateFunction.REJECT_QUOTATION,
        comment: 'test comment',
      });
    });

    test('should not update approval workflow', () => {
      component.formGroup = {
        valid: false,
      } as FormGroup;

      const updateApprovalWorkflowSpy = jest.spyOn(
        component.approvalFacade,
        'updateApprovalWorkflow'
      );

      component.updateApprovalWorkflow();

      expect(updateApprovalWorkflowSpy).not.toHaveBeenCalled();
    });
  });

  describe('closeDialog', () => {
    it('should call dialogRef.close', () => {
      component['dialogRef'].close = jest.fn();

      component.closeDialog();

      expect(component['dialogRef'].close).toHaveBeenCalled();
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
  describe('onPaste method test', () => {
    test('should handle pasted text exceeding max length', () => {
      const pastedText = 'a'.repeat(component.INPUT_MAX_LENGTH + 1);

      const event = {
        clipboardData: {
          getData: jest.fn().mockReturnValue(pastedText), // Mock clipboard data to return value longer then max_length
        },
      } as any;

      // Mock setTimeout
      jest.useFakeTimers();

      // Mock changeDetectorRef
      const changeDetectorRefMock = {
        detectChanges: jest.fn(),
      };
      Object.defineProperty(component, 'changeDetectorRef', {
        value: changeDetectorRefMock,
      });

      // Invoke the onPaste method
      component.onPaste(event);

      // Assertions
      expect(component.isInvalidInput).toBe(true);

      // Advance timers by 3000 ms to trigger setTimeout callback
      jest.advanceTimersByTime(3000);

      // Fast-forward timers to the end
      jest.runAllTimers();

      expect(component.isInvalidInput).toBe(false);
      expect(changeDetectorRefMock.detectChanges).toHaveBeenCalledTimes(1);
      expect(event.clipboardData.getData).toHaveBeenCalledWith('text/plain');
      expect(event.clipboardData.getData).toHaveBeenCalledTimes(1);

      jest.useRealTimers();
    });

    test('should handle pasted text within max length', () => {
      const pastedText = 'a'.repeat(component.INPUT_MAX_LENGTH - 1);

      const event = {
        clipboardData: {
          getData: jest.fn().mockReturnValue(pastedText), // Mock clipboard data to return value longer then max_length
        },
      } as any;

      // Invoke the onPaste method
      component.onPaste(event);

      // Assertions
      expect(component.isInvalidInput).toBe(false);
    });
  });
});
