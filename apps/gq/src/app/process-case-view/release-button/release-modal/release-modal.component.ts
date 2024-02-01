/* eslint-disable max-lines */
import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
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
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ActivatedRoute, Params, Router } from '@angular/router';

import {
  combineLatest,
  distinctUntilChanged,
  filter,
  Subject,
  take,
  takeUntil,
  tap,
} from 'rxjs';

import { AppRoutePath } from '@gq/app-route-path.enum';
import { ApprovalFacade } from '@gq/core/store/approval/approval.facade';
import { ProcessCaseRoutePath } from '@gq/process-case-view/process-case-route-path.enum';
import { UserSelectComponent } from '@gq/process-case-view/user-select/user-select.component';
import { DialogHeaderModule } from '@gq/shared/components/header/dialog-header/dialog-header.module';
import {
  ActiveDirectoryUser,
  ApprovalLevel,
  ApprovalWorkflowBaseInformation,
  ApprovalWorkflowInformation,
  Approver,
  Quotation,
  QuotationStatus,
} from '@gq/shared/models';
import { approversDifferValidator } from '@gq/shared/validators/approvers-differ-validator';
import { specialCharactersValidator } from '@gq/shared/validators/special-characters-validator';
import { userValidator } from '@gq/shared/validators/user-validator';
import { TranslocoService } from '@ngneat/transloco';
import { PushPipe } from '@ngrx/component';

import { LoadingSpinnerModule } from '@schaeffler/loading-spinner';
import { SharedTranslocoModule } from '@schaeffler/transloco';

interface ReleaseModalFormControl {
  approver1?: FormControl<Approver>;
  approver2?: FormControl<Approver>;
  approver3?: FormControl<Approver>;
  approverCC?: FormControl<ActiveDirectoryUser>;
  comment: FormControl<string>;
  projectInformation: FormControl<string>;
}

@Component({
  standalone: true,
  imports: [
    MatFormFieldModule,
    SharedTranslocoModule,
    MatInputModule,
    CommonModule,
    LoadingSpinnerModule,
    PushPipe,
    MatButtonModule,
    UserSelectComponent,
    DialogHeaderModule,
    ReactiveFormsModule,
  ],
  selector: 'gq-release-modal',
  templateUrl: './release-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReleaseModalComponent implements OnInit, OnDestroy {
  formGroup: FormGroup<ReleaseModalFormControl>;

  INPUT_MAX_LENGTH = 200;
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

  formGroupInitialValue: typeof this.formGroup.value = undefined;

  hasValueChanged = false;

  readonly quotationStatus = QuotationStatus;
  readonly INVALID_SELECTION_APPROVER = '';

  isInvalidInput = false;

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
    private readonly activatedRoute: ActivatedRoute,
    private readonly changeDetectorRef: ChangeDetectorRef
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

    this.INVALID_SELECTION_APPROVER = this.translocoService.translate(
      'processCaseView.header.releaseModal.invalidSelectionApproverError'
    );
  }

  ngOnInit(): void {
    this.approvalFacade.getApprovers();

    this.formGroup = this.formBuilder.group<ReleaseModalFormControl>({
      comment: new FormControl(undefined, [
        specialCharactersValidator(),
        Validators.maxLength(this.INPUT_MAX_LENGTH),
      ]),
      projectInformation: new FormControl(undefined, [
        specialCharactersValidator(),
        Validators.maxLength(this.INPUT_MAX_LENGTH),
      ]),
    });
    this.setApprovalControlsAndInitialData();

    this.approvalFacade.triggerApprovalWorkflowSucceeded$
      .pipe(takeUntil(this.shutdown$$))
      .subscribe(() => this.handleTriggerApprovalWorkflowSucceeded());

    this.approvalFacade.saveApprovalWorkflowInformationSucceeded$
      .pipe(takeUntil(this.shutdown$$))
      .subscribe(() => this.closeDialog());
  }

  onPaste(event: ClipboardEvent): void {
    const pastedText = event.clipboardData?.getData('text/plain') || '';
    if (pastedText.length > this.INPUT_MAX_LENGTH) {
      this.isInvalidInput = true;

      // Clear the error after 3 seconds
      setTimeout(() => {
        this.isInvalidInput = false;
        this.changeDetectorRef.detectChanges();
      }, 3000);
    }
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
      comment: formGroupValue.comment?.trim(),
      projectInformation: formGroupValue.projectInformation?.trim(),
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
      firstApprover: formGroupValue.approver1?.userId, // on autoApproval first and second approver is not required
      secondApprover: formGroupValue.approver2?.userId,
      thirdApprover: formGroupValue.approver3?.userId,
      infoUser: formGroupValue.approverCC?.userId,
      comment: formGroupValue.comment?.trim(),
      projectInformation: formGroupValue.projectInformation?.trim(),
    };
  }

  /**
   * sets Approvers as FormControlValues, depending on the data of approvalStatusOfRequestedApprover$ of the facade
   */
  private setApprovalControlsAndInitialData() {
    combineLatest([
      this.approvalFacade.allApproversLoading$,
      this.approvalFacade.approvalCockpitInformation$,
    ])
      .pipe(
        distinctUntilChanged(),
        takeUntil(this.shutdown$$),
        filter(
          ([allApproversLoading, cockpitInformation]: [
            boolean,
            ApprovalWorkflowInformation
          ]) =>
            !allApproversLoading &&
            cockpitInformation.sapId === this.dialogData.sapId
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

              this.setInitialData(cockpitInformation);
            } else {
              this.setInitialDataForCommentAndProject(cockpitInformation);
              this.attachForChanges();
            }
          }
        )
      )
      .subscribe();
  }

  private setInitialData(
    workflowInformation: ApprovalWorkflowInformation
  ): void {
    this.setInitialDataForCommentAndProject(workflowInformation);
    this.setInfoUser(workflowInformation.infoUser);

    this.approvalFacade.approvalStatusOfRequestedApprover$
      .pipe(
        take(1),
        tap((approvalStatusOfApprovers) => {
          // approvalStatusOfApprovers and workflowInformation have the same data for users
          // approvalStatusOfApprovers has additionally mapped the user Id to an Approver Object
          // the Approver Object is set as the value of the formControl, to always display the latest data
          this.approver1FormControl.setValue(
            approvalStatusOfApprovers[0]?.approver
          );

          this.approver2FormControl.setValue(
            approvalStatusOfApprovers[1]?.approver
          );

          this.approver3FormControl.setValue(
            approvalStatusOfApprovers[2]?.approver
          );

          // Approver 1-2 are required fields, if Approver1 or 2 don't have data formGroup is status 'pristine'
          // when either Approver 1 or 2 have data, the complete form is touched, and all required error and other error should be shown on startUp
          if (
            workflowInformation.firstApprover ||
            workflowInformation.secondApprover
          ) {
            this.formGroup.markAllAsTouched();
          }

          this.attachForChanges();
        })
      )
      .subscribe();
  }

  private setInitialDataForCommentAndProject(
    workflowInformation: ApprovalWorkflowInformation
  ): void {
    this.formGroup
      .get('projectInformation')
      .setValue(workflowInformation?.projectInformation);
    this.formGroup.get('comment').setValue(workflowInformation?.comment);
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

  private attachForChanges(): void {
    this.formGroupInitialValue = this.formGroup.value;

    this.formGroup.valueChanges.pipe(takeUntil(this.shutdown$$)).subscribe(
      () =>
        (this.hasValueChanged =
          // falsy value will be transformed into undefined for object and into empty string for strings,
          // so that !== check will work easily
          this.isNotEqual(
            this.formGroupInitialValue?.approver1,
            this.formGroup.value.approver1
          ) ||
          this.isNotEqual(
            this.formGroupInitialValue?.approver2,
            this.formGroup.value.approver2
          ) ||
          this.isNotEqual(
            this.formGroupInitialValue?.approver3,
            this.formGroup.value.approver3
          ) ||
          this.isNotEqual(
            this.formGroupInitialValue?.approverCC,
            this.formGroup.value.approverCC
          ) ||
          this.isNotEqual(
            this.formGroupInitialValue?.comment,
            this.formGroup.value.comment
          ) ||
          this.isNotEqual(
            this.formGroupInitialValue?.projectInformation,
            this.formGroup.value.projectInformation
          ))
    );
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

  /**
   * checks if value are non equal,
   * two falsy values compared are equal
   * e.g. null !== undefined  will return false
   */
  private isNotEqual(
    formControlValueInitial: any,
    formControlValueChanged: any
  ): boolean {
    return (
      (formControlValueInitial || undefined) !==
      (formControlValueChanged || undefined)
    );
  }
}
