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

import {
  combineLatest,
  map,
  merge,
  Observable,
  Subject,
  takeUntil,
  tap,
} from 'rxjs';

import { ApprovalFacade } from '@gq/core/store/approval/approval.facade';
import {
  ActiveDirectoryUser,
  ApprovalLevel,
  ApprovalStatus,
  ApprovalWorkflowBaseInformation,
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
    private readonly translocoService: TranslocoService
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
      this.approvalFacade.approvalStatusLoading$,
      this.approvalFacade.approvalStatus$,
    ]).pipe(
      takeUntil(this.shutdown$$),
      map(
        ([loadingAllApprovers, loadingApprovalStatus, approvalStatus]: [
          boolean,
          boolean,
          ApprovalStatus
        ]) =>
          !loadingAllApprovers &&
          !loadingApprovalStatus &&
          !!approvalStatus.sapId
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

    this.approvalFacade.approvalStatus$
      .pipe(
        takeUntil(this.shutdown$$),
        tap(({ thirdApproverRequired, autoApproval }: ApprovalStatus) => {
          if (!autoApproval) {
            this.formGroup.addControl('approver1', this.approver1FormControl);
            this.formGroup.addControl('approver2', this.approver2FormControl);
            this.formGroup.addControl('approverCC', this.approverCCFormControl);

            if (thirdApproverRequired) {
              this.formGroup.addControl('approver3', this.approver3FormControl);
            }

            this.formGroup.addValidators(approversDifferValidator().bind(this));
          }
        })
      )
      .subscribe();

    merge(
      this.approvalFacade.triggerApprovalWorkflowSucceeded$,
      this.approvalFacade.saveApprovalWorkflowInformationSucceeded$
    )
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
}
