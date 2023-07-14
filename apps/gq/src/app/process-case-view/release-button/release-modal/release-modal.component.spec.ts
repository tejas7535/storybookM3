import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import {
  MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA,
  MatLegacyDialogRef as MatDialogRef,
} from '@angular/material/legacy-dialog';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { of } from 'rxjs';

import { AppRoutePath } from '@gq/app-route-path.enum';
import { ApprovalFacade } from '@gq/core/store/approval/approval.facade';
import { ProcessCaseRoutePath } from '@gq/process-case-view/process-case-route-path.enum';
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
    imports: [provideTranslocoTestingModule({}), RouterTestingModule],
    providers: [
      { provide: MatDialogRef, useValue: {} },
      FormBuilder,
      MockProvider(TranslocoService),
      MockProvider(ApprovalFacade),
      {
        provide: MAT_DIALOG_DATA,
        useValue: {
          sapId: '1',
        } as Quotation,
      },
    ],
    detectChanges: false,
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.component;
    jest.resetAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    const firstApprover: Approver = { userId: 'appr1' } as Approver;
    const secondApprover: Approver = { userId: 'appr2' } as Approver;
    const thirdApprover: Approver = { userId: 'appr3' } as Approver;
    const infoUser: ActiveDirectoryUser = {
      userId: 'infoUser',
    } as ActiveDirectoryUser;
    const approvalStatusOfApprover = [
      firstApprover,
      secondApprover,
      thirdApprover,
    ];
    beforeEach(() => {
      const facadeMock: ApprovalFacade = {
        getActiveDirectoryUsers: jest.fn(),
        getAllApprovalData: jest.fn(),
        approvalCockpitInformation$: of({
          sapId: '1',
          thirdApproverRequired: false,
          autoApproval: false,
          infoUser: 'infoUser',
        } as ApprovalWorkflowInformation),
        triggerApprovalWorkflowSucceeded$: of(),
        saveApprovalWorkflowInformationSucceeded$: of(),
        approvalStatusOfRequestedApprover$: of(approvalStatusOfApprover),
        activeDirectoryUsers$: of([], [infoUser]),
        approvalCockpitLoading$: of(false),
        allApproversLoading$: of(false),
        clearActiveDirectoryUsers: jest.fn(),
        getActiveDirectoryUserByUserId: jest.fn(() =>
          of({} as ActiveDirectoryUser)
        ),
      } as unknown as ApprovalFacade;

      Object.defineProperty(component, 'approvalFacade', {
        value: facadeMock,
      });
    });
    describe('formgroups', () => {
      it('should call getAllApprover', () => {
        component.ngOnInit();
        expect(component.approvalFacade.getAllApprovalData).toHaveBeenCalled();
      });
      test('should set approver one and two in formGroup', () => {
        component['setInitialDataForApprovers'] = jest.fn();
        component.ngOnInit();

        expect(component.formGroup.get('approver1')).toBeDefined();
        expect(component.formGroup.get('approver2')).toBeDefined();
        expect(component.formGroup.get('approver3')).toBeNull();
        expect(component.formGroup.get('approverCC')).toBeDefined();
        expect(component.formGroup.get('comment')).toBeDefined();
        expect(component.formGroup.get('projectInformation')).toBeDefined();

        expect(component['setInitialDataForApprovers']).toHaveBeenCalled();
      });
      test('should set approver one, two and three in formGroup', () => {
        const facadeMock: ApprovalFacade = {
          getAllApprovalData: jest.fn(),
          approvalCockpitInformation$: of({
            sapId: '1',
            thirdApproverRequired: true,
            autoApproval: false,
          } as ApprovalWorkflowInformation),
          triggerApprovalWorkflowSucceeded$: of(),
          saveApprovalWorkflowInformationSucceeded$: of(),
          approvalStatusOfRequestedApprover$: of(approvalStatusOfApprover),
          approvalCockpitLoading$: of(false),
          allApproversLoading$: of(false),
          getActiveDirectoryUserByUserId: jest.fn(),
        } as unknown as ApprovalFacade;

        Object.defineProperty(component, 'approvalFacade', {
          value: facadeMock,
        });
        component['setInitialDataForApprovers'] = jest.fn();
        component.ngOnInit();
        expect(component.formGroup.get('approver1')).toBeDefined();
        expect(component.formGroup.get('approver2')).toBeDefined();
        expect(component.formGroup.get('approver3')).toBeDefined();
        expect(component.formGroup.get('approverCC')).toBeDefined();
        expect(component.formGroup.get('comment')).toBeDefined();
        expect(component.formGroup.get('projectInformation')).toBeDefined();
        expect(component['setInitialDataForApprovers']).toHaveBeenCalled();
      });

      test('should set only comment and project information in formGroup', () => {
        const facadeMock: ApprovalFacade = {
          getAllApprovalData: jest.fn(),
          approvalCockpitInformation$: of({
            sapId: '1',
            autoApproval: true,
            projectInformation: 'projectInfo',
            comment: 'comment',
          } as ApprovalWorkflowInformation),
          triggerApprovalWorkflowSucceeded$: of(),
          saveApprovalWorkflowInformationSucceeded$: of(),
          approvalStatusOfRequestedApprover$: of(),
          approvalCockpitLoading$: of(false),
          allApproversLoading$: of(false),
        } as unknown as ApprovalFacade;

        Object.defineProperty(component, 'approvalFacade', {
          value: facadeMock,
        });
        component['setInitialDataForApprovers'] = jest.fn();

        component.ngOnInit();
        expect(component.formGroup.get('approver1')).toBeNull();
        expect(component.formGroup.get('approver2')).toBeNull();
        expect(component.formGroup.get('approver3')).toBeNull();
        expect(component.formGroup.get('approverCC')).toBeNull();
        expect(component.formGroup.get('comment')).toBeDefined();
        expect(component.formGroup.get('projectInformation')).toBeDefined();
        expect(component['setInitialDataForApprovers']).not.toHaveBeenCalled();
      });
      describe('should set initialValues', () => {
        test('should set Approver1 and Approver2', () => {
          const approver1 = new FormControl(undefined);
          approver1.setValue = jest.fn();
          const approver2 = new FormControl(undefined);
          approver2.setValue = jest.fn();

          component.approver1FormControl = approver1;
          component.approver2FormControl = approver2;
          component.ngOnInit();
          expect(component.approver1FormControl.setValue).toHaveBeenCalled();
          expect(component.approver2FormControl.setValue).toHaveBeenCalled();

          expect(true).toBeTruthy();
        });

        test('should set Approver1 and Approver2, and Approver3', () => {
          const approver3 = new FormControl(undefined);
          approver3.setValue = jest.fn();

          component.approver3FormControl = approver3;
          component.approvalFacade.approvalCockpitInformation$ = of({
            sapId: '1',
            thirdApproverRequired: true,
          } as ApprovalWorkflowInformation);
          component.approvalFacade.allApproversLoading$ = of(false);
          component.approvalFacade.approvalCockpitLoading$ = of(false);

          component.ngOnInit();
          expect(component.approver3FormControl.setValue).toHaveBeenCalled();
        });
      });
      describe('infoUser', () => {
        test('initialUserInfo setValue', () => {
          component.approverCCFormControl =
            new FormControl<ActiveDirectoryUser>(undefined);
          component.approverCCFormControl.setValue = jest.fn();
          component.approvalFacade.getActiveDirectoryUserByUserId = jest.fn(
            () => of(infoUser)
          );

          component.ngOnInit();

          expect(component.approverCCFormControl.setValue).toHaveBeenCalledWith(
            infoUser
          );
        });
        test('should set error', () => {
          component.approverCCFormControl =
            new FormControl<ActiveDirectoryUser>(undefined);
          component.approverCCFormControl.setValue = jest.fn();
          component.approverCCFormControl.setErrors = jest.fn();
          component.approvalFacade.activeDirectoryUsers$ = of([], []);
          component.approvalFacade.getActiveDirectoryUserByUserId = jest.fn(
            () => of(undefined as ActiveDirectoryUser)
          );

          component.ngOnInit();

          expect(component.approverCCFormControl.setValue).toHaveBeenCalledWith(
            { userId: infoUser.userId }
          );
          expect(
            component.approverCCFormControl.setErrors
          ).toHaveBeenCalledWith({ invalidUser: true });
        });
      });
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
            approvalStatusOfRequestedApprover$: of(),
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
            approvalStatusOfRequestedApprover$: of(),
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
            approvalStatusOfRequestedApprover$: of(),
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
      test('should close dialog and navigate to overview tab when trigger approval workflow succeeded', () => {
        const facadeMock: ApprovalFacade = {
          getAllApprovalData: jest.fn(),
          approvalCockpitInformation$: of(),
          triggerApprovalWorkflowSucceeded$: of(true),
          saveApprovalWorkflowInformationSucceeded$: of(),
          approvalStatusOfRequestedApprover$: of(),
          approvalCockpitLoading$: of(false),
          allApproversLoading$: of(false),
        } as unknown as ApprovalFacade;

        const queryParams: Params = {
          quotation_number: '46791',
          customer_number: '4861',
          sales_org: '0615',
        };
        const activatedRouteMock: ActivatedRoute = {
          queryParams: of(queryParams),
        } as unknown as ActivatedRoute;

        const navigateMock = jest.fn();
        const routerMock: Router = {
          navigate: navigateMock,
        } as unknown as Router;

        Object.defineProperty(component, 'approvalFacade', {
          value: facadeMock,
        });

        Object.defineProperty(component, 'activatedRoute', {
          value: activatedRouteMock,
        });

        Object.defineProperty(component, 'router', {
          value: routerMock,
        });

        const closeDialogSpy = jest.spyOn(component, 'closeDialog');
        closeDialogSpy.mockImplementation();

        component.ngOnInit();

        expect(closeDialogSpy).toHaveBeenCalledTimes(1);
        expect(navigateMock).toHaveBeenCalledWith(
          [AppRoutePath.ProcessCaseViewPath, ProcessCaseRoutePath.OverviewPath],
          {
            queryParams,
          }
        );
      });
    });

    describe('save approval workflow information success', () => {
      test('should close dialog when save approval workflow information succeeded', () => {
        const facadeMock: ApprovalFacade = {
          getAllApprovalData: jest.fn(),
          approvalCockpitInformation$: of({
            sapId: '1',
          } as ApprovalWorkflowInformation),
          approvalStatus$: of(),
          triggerApprovalWorkflowSucceeded$: of(),
          saveApprovalWorkflowInformationSucceeded$: of(true),
          approvalStatusOfRequestedApprover$: of(),
        } as unknown as ApprovalFacade;

        Object.defineProperty(component, 'approvalFacade', {
          value: facadeMock,
        });

        const closeDialogSpy = jest.spyOn(component, 'closeDialog');
        closeDialogSpy.mockImplementation();
        component['setApprovalControlsAndInitialData'] = jest.fn(() => {});
        component.ngOnInit();
        component['setApprovalControlsAndInitialData'] = jest.fn(() => {});
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
        sapId: '1',
        thirdApproverRequired: true,
      } as ApprovalWorkflowInformation);
      component.approvalFacade.triggerApprovalWorkflowSucceeded$ = of();
      component.approvalFacade.saveApprovalWorkflowInformationSucceeded$ = of();
      component.approvalFacade.approvalStatusOfRequestedApprover$ = of();
      component.approvalFacade.allApproversLoading$ = of(false);
      component.approvalFacade.approvalCockpitLoading$ = of(false);
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
      component.dialogData = undefined;
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
        sapId: '1',
        autoApproval: true,
      } as ApprovalWorkflowInformation);
      component.approvalFacade.triggerApprovalWorkflowSucceeded$ = of();
      component.approvalFacade.saveApprovalWorkflowInformationSucceeded$ = of();
      component.approvalFacade.approvalStatusOfRequestedApprover$ = of();
      component.approvalFacade.allApproversLoading$ = of(false);
      component.approvalFacade.approvalCockpitLoading$ = of(false);
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
        sapId: '1',
        thirdApproverRequired: true,
      } as ApprovalWorkflowInformation);
      component.approvalFacade.triggerApprovalWorkflowSucceeded$ = of();
      component.approvalFacade.saveApprovalWorkflowInformationSucceeded$ = of();
      component.approvalFacade.approvalStatusOfRequestedApprover$ = of();
      component.approvalFacade.allApproversLoading$ = of(false);
      component.approvalFacade.approvalCockpitLoading$ = of(false);
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
