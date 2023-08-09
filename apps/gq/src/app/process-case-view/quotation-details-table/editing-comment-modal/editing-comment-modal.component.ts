import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { Component, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import {
  MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA,
  MatLegacyDialogRef as MatDialogRef,
} from '@angular/material/legacy-dialog';

import { combineLatest, map, Observable, pairwise, Subscription } from 'rxjs';

import {
  ActiveCaseActions,
  activeCaseFeature,
  UpdateQuotationDetail,
} from '@gq/core/store/active-case';
import { QuotationDetail } from '@gq/shared/models/quotation-detail';
import { specialCharactersValidator } from '@gq/shared/validators/special-characters-validator';
import { Store } from '@ngrx/store';

@Component({
  selector: 'gq-editing-comment-modal',
  templateUrl: './editing-comment-modal.component.html',
  styleUrls: ['./editing-comment-modal.component.scss'],
})
export class EditingCommentModalComponent implements OnInit, OnDestroy {
  private readonly subscription: Subscription = new Subscription();

  commentDisabled = true;
  commentFormControl: UntypedFormControl;
  updateLoading$: Observable<boolean>;
  @ViewChild('autosize') autosize: CdkTextareaAutosize;

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public modalData: QuotationDetail,
    private readonly dialogRef: MatDialogRef<EditingCommentModalComponent>,
    private readonly store: Store
  ) {}

  ngOnInit(): void {
    this.commentFormControl = new UntypedFormControl(
      this.modalData.comment,
      specialCharactersValidator()
    );

    this.updateLoading$ = this.store.select(
      activeCaseFeature.selectUpdateLoading
    );
    this.addSubscriptions();
  }

  addSubscriptions(): void {
    const loadingStopped$ = this.store
      .select(activeCaseFeature.selectUpdateLoading)
      .pipe(
        pairwise(),
        // eslint-disable-next-line ngrx/avoid-mapping-selectors
        map(([preVal, curVal]) => preVal && !curVal)
      );
    const isErrorMessage$ = this.store.select(
      activeCaseFeature.selectQuotationLoadingErrorMessage
    );

    this.subscription.add(
      combineLatest([isErrorMessage$, loadingStopped$]).subscribe(
        ([isErrorMessage, loadingStopped]) => {
          if (!isErrorMessage && loadingStopped) {
            this.closeDialog();
          }
        }
      )
    );

    this.subscription.add(
      this.commentFormControl.valueChanges.subscribe((val: string) => {
        this.commentDisabled =
          val === null ||
          val === this.modalData.comment ||
          (val !== null && val.trim() === this.modalData.comment);
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
  closeDialog(): void {
    this.dialogRef.close();
  }

  confirmComment(): void {
    const comment = (this.commentFormControl.value as string).trim();
    const updateQuotationDetailList: UpdateQuotationDetail[] = [
      {
        gqPositionId: this.modalData.gqPositionId,
        comment,
      },
    ];
    this.store.dispatch(
      ActiveCaseActions.updateQuotationDetails({ updateQuotationDetailList })
    );
  }
}
