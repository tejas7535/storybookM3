import { CommonModule } from '@angular/common';
import {
  Component,
  DestroyRef,
  inject,
  input,
  InputSignal,
  output,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { Rfq4ProcessFacade } from '@gq/core/store/rfq-4-process/rfq-4-process.facade';
import { PushPipe } from '@ngrx/component';

import { LoadingSpinnerModule } from '@schaeffler/loading-spinner';
import { SharedTranslocoModule } from '@schaeffler/transloco';

import { ModalFooterComponent } from '../modal-footer/modal-footer.component';
import { ProcessesModalDialogData } from '../models/processes-modal-dialog-data.interface';

@Component({
  selector: 'gq-start-process',
  templateUrl: './start-process.component.html',
  imports: [
    MatFormFieldModule,
    ReactiveFormsModule,
    MatInputModule,
    SharedTranslocoModule,
    LoadingSpinnerModule,
    CommonModule,
    PushPipe,
    ModalFooterComponent,
    PushPipe,
  ],
})
export class StartProcessComponent {
  private readonly rfq4ProcessesFacade = inject(Rfq4ProcessFacade);
  private readonly destroyRef: DestroyRef = inject(DestroyRef);

  modalData: InputSignal<ProcessesModalDialogData> =
    input<ProcessesModalDialogData>(null);
  cancelButtonClicked = output();

  readonly recalculateSqvLoading$ =
    this.rfq4ProcessesFacade.sendRecalculateSqvLoading$;

  MESSAGE_MAX_LENGTH = 1000;
  messageControl = new FormControl<string>(
    null,
    Validators.maxLength(this.MESSAGE_MAX_LENGTH)
  );

  sendRequest(): void {
    this.rfq4ProcessesFacade.sendRecalculateSqvSuccess$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.closeDialog());
    this.rfq4ProcessesFacade.sendRecalculateSqvRequest(
      this.modalData().quotationDetail.gqPositionId,
      this.messageControl.value
    );
  }

  closeDialog(): void {
    this.cancelButtonClicked.emit();
  }
}
