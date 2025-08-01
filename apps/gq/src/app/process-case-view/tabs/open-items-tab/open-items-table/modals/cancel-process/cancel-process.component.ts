import { CommonModule } from '@angular/common';
import { Component, inject, input, InputSignal, output } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';

import { Rfq4ProcessFacade } from '@gq/core/store/rfq-4-process/rfq-4-process.facade';
import { QuotationDetail } from '@gq/shared/models';

import { LoadingSpinnerModule } from '@schaeffler/loading-spinner';
import { SharedTranslocoModule } from '@schaeffler/transloco';

import { ModalFooterComponent } from '../modal-footer/modal-footer.component';

export type CancellationReason = 'CUSTOMER' | 'SCHAEFFLER';

@Component({
  selector: 'gq-cancel-process',
  imports: [
    MatFormFieldModule,
    MatRadioModule,
    ReactiveFormsModule,
    MatInputModule,
    SharedTranslocoModule,
    LoadingSpinnerModule,
    CommonModule,
    ModalFooterComponent,
  ],
  templateUrl: './cancel-process.component.html',
})
export class CancelProcessComponent {
  private readonly rfq4ProcessesFacade = inject(Rfq4ProcessFacade);

  quotationDetail: InputSignal<QuotationDetail> = input<QuotationDetail>(null);
  cancelButtonClicked = output();

  readonly MAX_COMMENT_LENGTH = 1000;

  cancelFormGroup = new FormGroup({
    reasonForCancellation: new FormControl<CancellationReason>('CUSTOMER', [
      Validators.required,
    ]),
    comment: new FormControl<string>(
      null,
      Validators.maxLength(this.MAX_COMMENT_LENGTH)
    ),
  });

  cancelProcess(): void {
    const reasonForCancellation = this.cancelFormGroup.get(
      'reasonForCancellation'
    ).value;
    const comment = this.cancelFormGroup.get('comment').value;
    this.rfq4ProcessesFacade.sendCancelProcessRequest(
      this.quotationDetail().gqPositionId,
      reasonForCancellation,
      comment
    );
  }

  closeDialog(): void {
    this.cancelButtonClicked.emit();
  }
}
