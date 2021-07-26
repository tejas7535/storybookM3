import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { combineLatest, Observable, Subscription } from 'rxjs';
import { map, pairwise } from 'rxjs/operators';

import { TranslocoService } from '@ngneat/transloco';
import { Store } from '@ngrx/store';

import {
  getQuotationErrorMessage,
  getSelectedQuotationDetailId,
  getUpdateLoading,
} from '../../../../../core/store';
import { updateQuotationDetails } from '../../../../../core/store/actions';
import { UpdateQuotationDetail } from '../../../../../core/store/reducers/process-case/models';
import { HelperService } from '../../../../../shared/services/helper-service/helper-service.service';

@Component({
  selector: 'gq-quantity-modal',
  templateUrl: './quantity-modal.component.html',
})
export class QuantityModalComponent implements OnInit, OnDestroy {
  private readonly subscription: Subscription = new Subscription();

  title$: Observable<string>;
  updateLoading$: Observable<boolean>;
  confirmDisabled = true;
  quantityFormControl: FormControl;
  gqPositionId: string;

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public quantity: number,
    private readonly dialogRef: MatDialogRef<QuantityModalComponent>,
    private readonly translocoService: TranslocoService,
    private readonly store: Store
  ) {
    this.title$ = this.translocoService.selectTranslate(
      'filterPricing.changeQuantity.title',
      {},
      'detail-view'
    );
  }
  ngOnInit(): void {
    this.quantityFormControl = new FormControl(this.quantity);
    this.updateLoading$ = this.store.select(getUpdateLoading);
    this.addSubscriptions();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
  addSubscriptions(): void {
    const isErrorMessage$ = this.store.select(getQuotationErrorMessage);

    const loadingStopped$ = this.store.select(getUpdateLoading).pipe(
      pairwise(),
      // eslint-disable-next-line ngrx/avoid-mapping-selectors
      map(([preVal, curVal]) => preVal && !curVal)
    );

    this.subscription.add(
      this.quantityFormControl.valueChanges.subscribe((val) => {
        this.confirmDisabled = val === null || val === this.quantity;
      })
    );
    this.subscription.add(
      this.store
        .select(getSelectedQuotationDetailId)
        .subscribe((id) => (this.gqPositionId = id))
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
  }
  onKeyPress(event: KeyboardEvent): void {
    HelperService.validateQuantityInputKeyPress(event);
  }

  onPaste(event: ClipboardEvent): void {
    HelperService.validateQuantityInputPaste(event);
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

  selectNewQuantity(): void {
    const orderQuantity = this.quantityFormControl.value;

    const updateQuotationDetailList: UpdateQuotationDetail[] = [
      {
        orderQuantity,
        gqPositionId: this.gqPositionId,
      },
    ];

    this.store.dispatch(updateQuotationDetails({ updateQuotationDetailList }));
  }
}
