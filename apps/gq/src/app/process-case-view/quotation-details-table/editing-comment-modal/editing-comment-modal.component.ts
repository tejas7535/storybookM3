import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { Component, inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { combineLatest, map, Observable, pairwise, Subscription } from 'rxjs';

import { ActiveCaseActions } from '@gq/core/store/active-case/active-case.action';
import { activeCaseFeature } from '@gq/core/store/active-case/active-case.reducer';
import { UpdateQuotationDetail } from '@gq/core/store/active-case/models';
import { QuotationDetail } from '@gq/shared/models/quotation-detail';
import { Store } from '@ngrx/store';

@Component({
  selector: 'gq-editing-comment-modal',
  templateUrl: './editing-comment-modal.component.html',
  styleUrls: ['./editing-comment-modal.component.scss'],
})
export class EditingCommentModalComponent implements OnInit, OnDestroy {
  @ViewChild('autosize') autosize: CdkTextareaAutosize;

  commentDisabled = true;
  commentFormControl: UntypedFormControl;
  updateLoading$: Observable<boolean>;

  modalData: QuotationDetail = inject(MAT_DIALOG_DATA);

  private readonly dialogRef = inject(
    MatDialogRef<EditingCommentModalComponent>
  );
  private readonly store: Store = inject(Store);

  private readonly subscription: Subscription = new Subscription();

  ngOnInit(): void {
    this.commentFormControl = new UntypedFormControl(this.modalData.comment);

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
      this.commentFormControl.valueChanges
        .pipe(map((value) => (value === '' ? null : value)))
        .subscribe((val: string) => {
          // If for some reason comment would be empty string convert it to null
          // to compare always the same values
          const comment =
            this.modalData.comment === '' ? null : this.modalData.comment;
          this.commentDisabled =
            val === comment || (val !== null && val.trim() === comment);
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
