import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { Component, inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { combineLatest, map, Observable, pairwise, Subscription } from 'rxjs';

import { ActiveCaseFacade } from '@gq/core/store/active-case/active-case.facade';
import { UpdateQuotationDetail } from '@gq/core/store/active-case/models';
import { QuotationDetail } from '@gq/shared/models/quotation-detail';

@Component({
  selector: 'gq-editing-comment-modal',
  templateUrl: './editing-comment-modal.component.html',
  styleUrls: ['./editing-comment-modal.component.scss'],
})
export class EditingCommentModalComponent implements OnInit, OnDestroy {
  @ViewChild('autosize') autosize: CdkTextareaAutosize;

  private readonly dialogRef = inject(
    MatDialogRef<EditingCommentModalComponent>
  );
  private readonly activeCaseFacade = inject(ActiveCaseFacade);
  private readonly subscription: Subscription = new Subscription();
  modalData: QuotationDetail = inject(MAT_DIALOG_DATA);

  commentDisabled = true;
  commentFormControl: UntypedFormControl;

  updateLoading$: Observable<boolean> =
    this.activeCaseFacade.quotationDetailUpdating$;
  loadingErrorMessage$: Observable<string> =
    this.activeCaseFacade.loadingErrorMessage$;
  quotationIsEditable$: Observable<boolean> =
    this.activeCaseFacade.canEditQuotation$;

  ngOnInit(): void {
    this.commentFormControl = new UntypedFormControl(this.modalData.comment);

    this.addSubscriptions();
  }

  addSubscriptions(): void {
    this.subscription.add(
      this.quotationIsEditable$.subscribe((editable) =>
        editable
          ? this.commentFormControl.enable()
          : this.commentFormControl.disable()
      )
    );

    const loadingStopped$ = this.updateLoading$.pipe(
      pairwise(),
      map(([preVal, curVal]) => preVal && !curVal)
    );

    this.subscription.add(
      combineLatest([this.loadingErrorMessage$, loadingStopped$]).subscribe(
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
    this.activeCaseFacade.updateQuotationDetails(updateQuotationDetailList);
  }
}
