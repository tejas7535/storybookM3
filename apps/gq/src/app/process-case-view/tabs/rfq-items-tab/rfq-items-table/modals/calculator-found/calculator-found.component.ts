import { CommonModule } from '@angular/common';
import {
  Component,
  DestroyRef,
  inject,
  input,
  InputSignal,
  OnInit,
  output,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { Rfq4ProcessFacade } from '@gq/core/store/rfq-4-process/rfq-4-process.facade';
import { QuotationDetail } from '@gq/shared/models';

import { LoadingSpinnerModule } from '@schaeffler/loading-spinner';
import { SharedTranslocoModule } from '@schaeffler/transloco';

@Component({
  selector: 'gq-calculator-found',
  templateUrl: './calculator-found.component.html',
  imports: [
    MatFormFieldModule,
    ReactiveFormsModule,
    MatInputModule,
    SharedTranslocoModule,
    LoadingSpinnerModule,
    CommonModule,
  ],
})
export class CalculatorFoundComponent implements OnInit {
  private readonly rfq4ProcessesFacade = inject(Rfq4ProcessFacade);
  private readonly destroyRef = inject(DestroyRef);

  quotationDetail: InputSignal<QuotationDetail> = input<QuotationDetail>(null);
  cancelButtonClicked = output();
  messageChanged = output<string>();

  MESSAGE_MAX_LENGTH = 1000;
  messageControl: FormControl<string>;

  ngOnInit(): void {
    this.messageControl = new FormControl<string>(
      this.quotationDetail()?.rfq4?.message,
      Validators.maxLength(this.MESSAGE_MAX_LENGTH)
    );
    this.messageChanged.emit(this.messageControl.value);
    this.messageControl.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((value) => {
        this.messageChanged.emit(value);
      });
  }

  sendRequest(): void {
    this.rfq4ProcessesFacade.sendRecalculateSqvRequest(
      this.quotationDetail().gqPositionId,
      this.messageControl.value
    );
  }

  closeDialog(): void {
    this.cancelButtonClicked.emit();
  }
}
