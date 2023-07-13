import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  OnDestroy,
  OnInit,
} from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import {
  MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA,
  MatLegacyDialogRef as MatDialogRef,
} from '@angular/material/legacy-dialog';
import { ActivatedRoute, Params, Router } from '@angular/router';

import {
  combineLatest,
  distinctUntilChanged,
  filter,
  map,
  Observable,
  Subject,
  take,
  takeUntil,
  tap,
} from 'rxjs';

import { AppRoutePath } from '@gq/app-route-path.enum';
import { ApprovalFacade } from '@gq/core/store/approval/approval.facade';
import { ProcessCaseRoutePath } from '@gq/process-case-view/process-case-route-path.enum';
import {
  ActiveDirectoryUser,
  ApprovalLevel,
  ApprovalWorkflowBaseInformation,
  ApprovalWorkflowInformation,
  Approver,
  Quotation,
} from '@gq/shared/models';
import { approversDifferValidator } from '@gq/shared/validators/approvers-differ-validator';
import { userValidator } from '@gq/shared/validators/user-validator';
import { TranslocoService } from '@ngneat/transloco';

interface ReleaseModalFormControl {
  approver1?: FormControl<Approver>;
  approver2?: FormControl<Approver>;
  approver3?: FormControl<Approver>;
  approverCC?: FormControl<ActiveDirectoryUser>;
  comment: FormControl<string>;
  projectInformation: FormControl<string>;
}

@Component({
  selector: 'gq-release-modal',
  templateUrl: './release-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReleaseModalComponent implements OnInit, OnDestroy {
  formGroup: FormGroup<ReleaseModalFormControl>;

  INPUT_MAX_LENGTH = 1000;
  readonly approvalLevelEnum = ApprovalLevel;

  approver1FormControl = new FormControl<Approver>(
    undefined,
    Validators.compose([userValidator().bind(this), Validators.required])
  );

  approver2FormControl = new FormControl<Approver>(
    undefined,
    Validators.compose([userValidator().bind(this), Validators.required])
  );

  approver3FormControl = new FormControl<Approver>(
    undefined,
    Validators.compose([userValidator().bind(this), Validators.required])
  );

  approverCCFormControl = new FormControl<ActiveDirectoryUser>(
    undefined,
    userValidator().bind(this)
  );

  dataLoadingComplete$: Observable<boolean>; // = NEVER;

  private readonly REQUIRED_ERROR_MESSAGE = '';
  private readonly INVALID_APPROVER_ERROR_MESSAGE = '';
  private readonly INVALID_USER_ERROR_MESSAGE = '';
  private readonly USER_SEARCH_EXPRESSION_MIN_LENGTH = 2;

  private readonly shutdown$$: Subject<void> = new Subject<void>();

  constructor(
    public readonly approvalFacade: ApprovalFacade,
    @Inject(MAT_DIALOG_DATA)
    public dialogData: Quotation,
    private readonly dialogRef: MatDialogRef<ReleaseModalComponent>,
    private readonly formBuilder: FormBuilder,
    private readonly translocoService: TranslocoService,
    private readonly router: Router,
    private readonly activatedRoute: ActivatedRoute
  ) {
    this.REQUIRED_ERROR_MESSAGE = this.translocoService.translate(
      'processCaseView.header.releaseModal.requiredError'
    );

    this.INVALID_APPROVER_ERROR_MESSAGE = this.translocoService.translate(
      'processCaseView.header.releaseModal.invalidApproverError'
    );

    this.INVALID_USER_ERROR_MESSAGE = this.translocoService.translate(
      'processCaseView.header.releaseModal.invalidUserError'
    );
  }

  ngOnInit(): void {
    this.approvalFacade.getAllApprovalData(this.dialogData.sapId);

    this.dataLoadingComplete$ = combineLatest([
      this.approvalFacade.allApproversLoading$,
      this.approvalFacade.approvalCockpitLoading$,
      this.approvalFacade.approvalCockpitInformation$,
    ]).pipe(
      takeUntil(this.shutdown$$),
      map(
        ([
          allApproversLoading,
          approvalInformationLoading,
          approvalInformation,
        ]: [boolean, boolean, ApprovalWorkflowInformation]) =>
          !allApproversLoading &&
          !approvalInformationLoading &&
          !!approvalInformation.sapId
      )
    );

    this.formGroup = this.formBuilder.group<ReleaseModalFormControl>({
      comment: new FormControl(
        undefined,
        Validators.maxLength(this.INPUT_MAX_LENGTH)
      ),
      projectInformation: new FormControl(
        undefined,
        Validators.maxLength(this.INPUT_MAX_LENGTH)
      ),
    });

    this.setApprovalControlsAndInitialData();

    this.approvalFacade.triggerApprovalWorkflowSucceeded$
      .pipe(takeUntil(this.shutdown$$))
      .subscribe(() => this.handleTriggerApprovalWorkflowSucceeded());

    this.approvalFacade.saveApprovalWorkflowInformationSucceeded$
      .pipe(takeUntil(this.shutdown$$))
      .subscribe(() => this.closeDialog());
  }

  getErrorMessageOfControl(
    control: AbstractControl,
    isApproverControl?: boolean
  ): string {
    if (control.hasError('required')) {
      return this.REQUIRED_ERROR_MESSAGE;
    }

    if (control.hasError('invalidUser')) {
      return isApproverControl
        ? this.INVALID_APPROVER_ERROR_MESSAGE
        : this.INVALID_USER_ERROR_MESSAGE;
    }

    return '';
  }

  handleUserSearchExpressionChanged(userSearchExpression: string): void {
    if (userSearchExpression.length >= this.USER_SEARCH_EXPRESSION_MIN_LENGTH) {
      this.approvalFacade.getActiveDirectoryUsers(userSearchExpression);
    } else {
      this.approvalFacade.clearActiveDirectoryUsers();
    }
  }

  startWorkflow() {
    this.approvalFacade.triggerApprovalWorkflow(this.getApprovalWorkflowData());
  }

  triggerAutoApproval() {
    const formGroupValue = this.formGroup.value;

    this.approvalFacade.triggerApprovalWorkflow({
      comment: formGroupValue.comment?.trim() || undefined,
      projectInformation:
        formGroupValue.projectInformation?.trim() || undefined,
    });
  }

  save() {
    this.approvalFacade.saveApprovalWorkflowInformation(
      this.getApprovalWorkflowData()
    );
  }

  closeDialog() {
    this.approvalFacade.clearActiveDirectoryUsers();
    this.dialogRef.close();
  }

  ngOnDestroy(): void {
    this.shutdown$$.next();
    this.shutdown$$.complete();
  }

  private getApprovalWorkflowData(): Omit<
    ApprovalWorkflowBaseInformation,
    'gqId'
  > {
    const formGroupValue = this.formGroup.value;

    return {
      firstApprover: formGroupValue.approver1.userId,
      secondApprover: formGroupValue.approver2.userId,
      thirdApprover: formGroupValue.approver3?.userId,
      infoUser: formGroupValue.approverCC?.userId,
      comment: formGroupValue.comment?.trim() || undefined,
      projectInformation:
        formGroupValue.projectInformation?.trim() || undefined,
    };
  }

  /**
   * sets Approvers as FormControlValues, depending on the data of approvalStatusOfRequestedApprover$ of the facade
   */
  private setApprovalControlsAndInitialData() {
    combineLatest([
      this.dataLoadingComplete$,
      this.approvalFacade.approvalCockpitInformation$,
    ])
      .pipe(
        distinctUntilChanged(),
        takeUntil(this.shutdown$$),
        filter(
          ([loadingComplete, _cockpitInformation]: [
            boolean,
            ApprovalWorkflowInformation
          ]) => !!loadingComplete
        ),
        tap(
          ([_loading, cockpitInformation]: [
            boolean,
            ApprovalWorkflowInformation
          ]) => {
            if (!cockpitInformation.autoApproval) {
              this.formGroup.addControl('approver1', this.approver1FormControl);
              this.formGroup.addControl('approver2', this.approver2FormControl);
              this.formGroup.addControl(
                'approverCC',
                this.approverCCFormControl
              );

              if (cockpitInformation.thirdApproverRequired) {
                this.formGroup.addControl(
                  'approver3',
                  this.approver3FormControl
                );
              }

              this.formGroup.addValidators(
                approversDifferValidator().bind(this)
              );
              this.setInitialDataForApprovers(cockpitInformation);
            }

            this.formGroup
              .get('projectInformation')
              .setValue(cockpitInformation?.projectInformation);
            this.formGroup.get('comment').setValue(cockpitInformation?.comment);
          }
        )
      )
      .subscribe();
  }

  private setInitialDataForApprovers(
    workflowInformation: ApprovalWorkflowInformation
  ): void {
    this.approvalFacade.approvalStatusOfRequestedApprover$
      .pipe(
        take(1),
        tap((approvalStatusOfApprovers) => {
          this.approver1FormControl.setValue(
            approvalStatusOfApprovers[0]?.approver
          );
          this.approver2FormControl.setValue(
            approvalStatusOfApprovers[1]?.approver
          );
          this.approver3FormControl.setValue(
            approvalStatusOfApprovers[2]?.approver
          );

          this.setInfoUser(workflowInformation.infoUser);
        })
      )
      .subscribe();
  }

  private setInfoUser(userId: string) {
    if (!userId) {
      this.approverCCFormControl.setValue(undefined as ActiveDirectoryUser);
      this.approverCCFormControl.markAsTouched();

      return;
    }

    this.approvalFacade
      .getActiveDirectoryUserByUserId(userId)
      .pipe(take(1))
      .subscribe((data) => {
        if (!data) {
          // set errors manually,
          // because validators do NOT know if user is present in AD,
          // validator can just check for the type BUT we want to display the value that has been saved
          this.approverCCFormControl.setValue({ userId } as any);
          this.approverCCFormControl.setErrors({ invalidUser: true });
          this.approverCCFormControl.markAsTouched();

          return;
        }

        this.approverCCFormControl.setValue(data);
      });

    this.approverCCFormControl.markAsTouched();
  }

  /**
   * Close the modal and navigate to overview tab
   */
  private handleTriggerApprovalWorkflowSucceeded(): void {
    this.closeDialog();

    this.activatedRoute.queryParams
      .pipe(take(1))
      .subscribe((queryParams: Params) => {
        this.router.navigate(
          [AppRoutePath.ProcessCaseViewPath, ProcessCaseRoutePath.OverviewPath],
          {
            queryParams,
          }
        );
      });
  }
}
