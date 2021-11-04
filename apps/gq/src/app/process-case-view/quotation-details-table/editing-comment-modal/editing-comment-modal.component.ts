import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { Component, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { combineLatest, map, Observable, pairwise, Subscription } from 'rxjs';

import { Store } from '@ngrx/store';

import {
  getQuotationErrorMessage,
  getUpdateLoading,
  updateQuotationDetails,
} from '../../../core/store';
import { UpdateQuotationDetail } from '../../../core/store/reducers/process-case/models';
import { QuotationDetail } from '../../../shared/models/quotation-detail';

@Component({
  selector: 'gq-editing-comment-modal',
  templateUrl: './editing-comment-modal.component.html',
  styleUrls: ['./editing-comment-modal.component.scss'],
})
export class EditingCommentModalComponent implements OnInit, OnDestroy {
  private readonly subscription: Subscription = new Subscription();

  commentDisabled = true;
  commentFormControl: FormControl;
  updateLoading$: Observable<boolean>;
  @ViewChild('autosize') autosize: CdkTextareaAutosize;

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public modalData: QuotationDetail,
    private readonly dialogRef: MatDialogRef<EditingCommentModalComponent>,
    private readonly store: Store
  ) {}

  ngOnInit(): void {
    this.commentFormControl = new FormControl(this.modalData.comment);
    this.updateLoading$ = this.store.select(getUpdateLoading);
    this.addSubscriptions();
  }

  addSubscriptions(): void {
    const loadingStopped$ = this.store.select(getUpdateLoading).pipe(
      pairwise(),
      // eslint-disable-next-line ngrx/avoid-mapping-selectors
      map(([preVal, curVal]) => preVal && !curVal)
    );
    const isErrorMessage$ = this.store.select(getQuotationErrorMessage);

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
    this.store.dispatch(updateQuotationDetails({ updateQuotationDetailList }));
  }
}
