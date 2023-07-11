import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import {
  MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA,
  MatLegacyDialogRef as MatDialogRef,
} from '@angular/material/legacy-dialog';

import { of } from 'rxjs';

import { ApprovalFacade } from '@gq/core/store/approval/approval.facade';
import {
  ActiveDirectoryUser,
  ApprovalWorkflowInformation,
  Approver,
  Quotation,
} from '@gq/shared/models';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { TranslocoService } from '@ngneat/transloco';
import { MockProvider } from 'ng-mocks';
import { marbles } from 'rxjs-marbles';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { ReleaseModalComponent } from './release-modal.component';

describe('ReleaseModalComponent', () => {
  let component: ReleaseModalComponent;
  let spectator: Spectator<ReleaseModalComponent>;

  const createComponent = createComponentFactory({
    component: ReleaseModalComponent,
    imports: [provideTranslocoTestingModule({})],
    providers: [
      { provide: MatDialogRef, useValue: {} },
      FormBuilder,
      MockProvider(TranslocoService),
      MockProvider(ApprovalFacade),
      {
        provide: MAT_DIALOG_DATA,
        useValue: {
          sapId: '12345',
        } as Quotation,
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
        getAllApprovalData: jest.fn(),
        approvalCockpitInformation$: of({
          thirdApproverRequired: false,
        } as ApprovalWorkflowInformation),
        triggerApprovalWorkflowSucceeded$: of(),
        saveApprovalWorkflowInformationSucceeded$: of(),
      } as unknown as ApprovalFacade;

      Object.defineProperty(component, 'approvalFacade', {
        value: facadeMock,
      });
    });
    it('should call getAllApprover', () => {
      component.ngOnInit();
      expect(component.approvalFacade.getAllApprovalData).toHaveBeenCalled();
    });
    test('should set approver one and two in formGroup', () => {
      component.ngOnInit();
      expect(component.formGroup.get('approver1')).toBeDefined();
      expect(component.formGroup.get('approver2')).toBeDefined();
      expect(component.formGroup.get('approver3')).toBeNull();
      expect(component.formGroup.get('approverCC')).toBeDefined();
      expect(component.formGroup.get('comment')).toBeDefined();
      expect(component.formGroup.get('projectInformation')).toBeDefined();
    });
    test('should set approver one, two and three in formGroup', () => {
      const facadeMock: ApprovalFacade = {
        getAllApprovalData: jest.fn(),
        approvalCockpitInformation$: of({
          thirdApproverRequired: true,
        } as ApprovalWorkflowInformation),
        triggerApprovalWorkflowSucceeded$: of(),
        saveApprovalWorkflowInformationSucceeded$: of(),
      } as unknown as ApprovalFacade;

      Object.defineProperty(component, 'approvalFacade', {
        value: facadeMock,
      });
      component.ngOnInit();
      expect(component.formGroup.get('approver1')).toBeDefined();
      expect(component.formGroup.get('approver2')).toBeDefined();
      expect(component.formGroup.get('approver3')).toBeDefined();
      expect(component.formGroup.get('approverCC')).toBeDefined();
      expect(component.formGroup.get('comment')).toBeDefined();
      expect(component.formGroup.get('projectInformation')).toBeDefined();
    });

    test('should set only comment and project information in formGroup', () => {
      const facadeMock: ApprovalFacade = {
        getAllApprovalData: jest.fn(),
        approvalCockpitInformation$: of({
          autoApproval: true,
        } as ApprovalWorkflowInformation),
        triggerApprovalWorkflowSucceeded$: of(),
        saveApprovalWorkflowInformationSucceeded$: of(),
      } as unknown as ApprovalFacade;

      Object.defineProperty(component, 'approvalFacade', {
        value: facadeMock,
      });
      component.ngOnInit();
      expect(component.formGroup.get('approver1')).toBeNull();
      expect(component.formGroup.get('approver2')).toBeNull();
      expect(component.formGroup.get('approver3')).toBeNull();
      expect(component.formGroup.get('approverCC')).toBeNull();
      expect(component.formGroup.get('comment')).toBeDefined();
      expect(component.formGroup.get('projectInformation')).toBeDefined();
    });

    describe('calculate loadingComplete', () => {
      test(
        'should return false when ApprovalCockpit is on loading',
        marbles((m) => {
          const facadeMock: ApprovalFacade = {
            getAllApprovalData: jest.fn(),
            approvalCockpitInformation$: of({
              thirdApproverRequired: true,
              sapId: undefined,
            } as ApprovalWorkflowInformation),
            allApproversLoading$: of(false),
            approvalCockpitLoading$: of(true),
            triggerApprovalWorkflowSucceeded$: of(),
            saveApprovalWorkflowInformationSucceeded$: of(),
          } as unknown as ApprovalFacade;

          Object.defineProperty(component, 'approvalFacade', {
            value: facadeMock,
          });
          component.ngOnInit();
          m.expect(component.dataLoadingComplete$).toBeObservable('(a|)', {
            a: false,
          });
        })
      );

      test(
        'should return false when AllApprovers is on loading',
        marbles((m) => {
          const facadeMock: ApprovalFacade = {
            getAllApprovalData: jest.fn(),
            approvalCockpitInformation$: of({
              thirdApproverRequired: true,
              sapId: '12',
            } as ApprovalWorkflowInformation),
            allApproversLoading$: of(true),
            approvalCockpitLoading$: of(false),
            triggerApprovalWorkflowSucceeded$: of(),
            saveApprovalWorkflowInformationSucceeded$: of(),
          } as unknown as ApprovalFacade;

          Object.defineProperty(component, 'approvalFacade', {
            value: facadeMock,
          });
          component.ngOnInit();
          m.expect(component.dataLoadingComplete$).toBeObservable('(a|)', {
            a: false,
          });
        })
      );
      test(
        'should return true when data received completely',
        marbles((m) => {
          const facadeMock: ApprovalFacade = {
            getAllApprovalData: jest.fn(),
            approvalCockpitInformation$: of({
              thirdApproverRequired: true,
              sapId: '12',
            } as ApprovalWorkflowInformation),
            allApproversLoading$: of(false),
            approvalCockpitLoading$: of(false),
            triggerApprovalWorkflowSucceeded$: of(),
            saveApprovalWorkflowInformationSucceeded$: of(),
          } as unknown as ApprovalFacade;

          Object.defineProperty(component, 'approvalFacade', {
            value: facadeMock,
          });
          component.ngOnInit();
          m.expect(component.dataLoadingComplete$).toBeObservable('(a|)', {
            a: true,
          });
        })
      );
    });

    describe('trigger approval workflow success', () => {
      test('should close dialog when trigger approval workflow succeeded', () => {
        const facadeMock: ApprovalFacade = {
          getAllApprovalData: jest.fn(),
          approvalCockpitInformation$: of(),
          triggerApprovalWorkflowSucceeded$: of(true),
          saveApprovalWorkflowInformationSucceeded$: of(),
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

    describe('save approval workflow information success', () => {
      test('should close dialog when save approval workflow information succeeded', () => {
        const facadeMock: ApprovalFacade = {
          getAllApprovalData: jest.fn(),
          approvalCockpitInformation$: of(),
          approvalStatus$: of(),
          triggerApprovalWorkflowSucceeded$: of(),
          saveApprovalWorkflowInformationSucceeded$: of(true),
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

  describe('getErrorMessageOfControl', () => {
    beforeEach(() => {
      Object.defineProperty(component, 'REQUIRED_ERROR_MESSAGE', {
        value: 'requiredError',
      });
      Object.defineProperty(component, 'INVALID_APPROVER_ERROR_MESSAGE', {
        value: 'invalidApprover',
      });
      Object.defineProperty(component, 'INVALID_USER_ERROR_MESSAGE', {
        value: 'invalidUser',
      });
    });

    test('should return an errorErrorMessage for required', () => {
      const control: FormControl = new FormControl();
      control.setErrors({ required: true });
      const result = component.getErrorMessageOfControl(control);
      expect(result).toBe('requiredError');
    });
    test('should return an errorErrorMessage for invalid approver', () => {
      const control: FormControl = new FormControl();
      control.setErrors({ invalidUser: true });
      const result = component.getErrorMessageOfControl(control, true);
      expect(result).toBe('invalidApprover');
    });
    test('should return an errorErrorMessage for invalid user', () => {
      const control: FormControl = new FormControl();
      control.setErrors({ invalidUser: true });
      const result = component.getErrorMessageOfControl(control);
      expect(result).toBe('invalidUser');
    });
    test('should return empty string when control has no errors', () => {
      const control: FormControl = new FormControl();
      const result = component.getErrorMessageOfControl(control);
      expect(result).toBe('');
    });
  });

  describe('closeDialog', () => {
    it('should close the dialog', () => {
      const clearUsersSpy = jest.spyOn(
        component.approvalFacade,
        'clearActiveDirectoryUsers'
      );
      component['dialogRef'].close = jest.fn();

      component.closeDialog();

      expect(clearUsersSpy).toHaveBeenCalled();
      expect(component['dialogRef'].close).toHaveBeenCalledTimes(1);
    });
  });

  describe('handleUserSearchExpressionChanged', () => {
    test('should get active directory users', () => {
      const searchExpression = 'test';
      const getActiveDirectoryUsersSpy = jest.spyOn(
        component.approvalFacade,
        'getActiveDirectoryUsers'
      );

      component.handleUserSearchExpressionChanged(searchExpression);

      expect(getActiveDirectoryUsersSpy).toHaveBeenCalledWith(searchExpression);
    });

    test('should clear active directory users', () => {
      const searchExpression = 't';
      const clearActiveDirectoryUsersSpy = jest.spyOn(
        component.approvalFacade,
        'clearActiveDirectoryUsers'
      );

      component.handleUserSearchExpressionChanged(searchExpression);

      expect(clearActiveDirectoryUsersSpy).toHaveBeenCalled();
    });
  });

  describe('Approval workflow', () => {
    test('should start approval workflow', () => {
      component.approvalFacade.approvalCockpitInformation$ = of({
        thirdApproverRequired: true,
      } as ApprovalWorkflowInformation);
      component.approvalFacade.triggerApprovalWorkflowSucceeded$ = of();
      component.approvalFacade.saveApprovalWorkflowInformationSucceeded$ = of();
      component.ngOnInit();

      const formValue = {
        approver1: { userId: 'APPR1' } as Approver,
        approver2: { userId: 'APPR2' } as Approver,
        approver3: { userId: 'APPR3' } as Approver,
        approverCC: { userId: 'CCuser' } as ActiveDirectoryUser,
        comment: 'test comment',
        projectInformation: 'test project info',
      };
      const triggerApprovalWorkflowSpy = jest.spyOn(
        component.approvalFacade,
        'triggerApprovalWorkflow'
      );

      component.formGroup.setValue(formValue);
      component.startWorkflow();

      expect(triggerApprovalWorkflowSpy).toHaveBeenCalledWith({
        firstApprover: formValue.approver1.userId,
        secondApprover: formValue.approver2.userId,
        thirdApprover: formValue.approver3.userId,
        infoUser: formValue.approverCC.userId,
        comment: formValue.comment,
        projectInformation: formValue.projectInformation,
      });
    });

    test('should start auto approval', () => {
      component.approvalFacade.approvalCockpitInformation$ = of({
        autoApproval: true,
      } as ApprovalWorkflowInformation);
      component.approvalFacade.triggerApprovalWorkflowSucceeded$ = of();
      component.approvalFacade.saveApprovalWorkflowInformationSucceeded$ = of();
      component.ngOnInit();

      const formValue = {
        comment: 'test comment    ',
        projectInformation: 'test project info',
      };
      const triggerApprovalWorkflowSpy = jest.spyOn(
        component.approvalFacade,
        'triggerApprovalWorkflow'
      );

      component.formGroup.setValue(formValue);
      component.triggerAutoApproval();

      expect(triggerApprovalWorkflowSpy).toHaveBeenCalledWith({
        comment: formValue.comment.trim(),
        projectInformation: formValue.projectInformation,
      });
    });

    test('should save approval workflow information', () => {
      component.approvalFacade.approvalCockpitInformation$ = of({
        thirdApproverRequired: true,
      } as ApprovalWorkflowInformation);
      component.approvalFacade.triggerApprovalWorkflowSucceeded$ = of();
      component.approvalFacade.saveApprovalWorkflowInformationSucceeded$ = of();
      component.ngOnInit();

      const formValue = {
        approver1: { userId: 'APPR1' } as Approver,
        approver2: { userId: 'APPR2' } as Approver,
        approver3: { userId: 'APPR3' } as Approver,
        approverCC: { userId: 'CCuser' } as ActiveDirectoryUser,
        comment: 'test comment',
        projectInformation: 'test project info',
      };
      const saveApprovalWorkflowInformationSpy = jest.spyOn(
        component.approvalFacade,
        'saveApprovalWorkflowInformation'
      );

      component.formGroup.setValue(formValue);
      component.save();

      expect(saveApprovalWorkflowInformationSpy).toHaveBeenCalledWith({
        firstApprover: formValue.approver1.userId,
        secondApprover: formValue.approver2.userId,
        thirdApprover: formValue.approver3.userId,
        infoUser: formValue.approverCC.userId,
        comment: formValue.comment,
        projectInformation: formValue.projectInformation,
      });
    });
  });
});
