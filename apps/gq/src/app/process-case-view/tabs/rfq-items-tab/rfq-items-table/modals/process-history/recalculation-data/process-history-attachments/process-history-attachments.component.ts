import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  InputSignal,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';

import { RfqCalculatorAttachment } from '@gq/calculator/rfq-4-detail-view/models/rfq-calculator-attachments.interface';
import { Rfq4ProcessFacade } from '@gq/core/store/rfq-4-process/rfq-4-process.facade';
import { PushPipe } from '@ngrx/component';

import { LoadingSpinnerModule } from '@schaeffler/loading-spinner';

@Component({
  selector: 'gq-process-history-attachments',
  imports: [CommonModule, LoadingSpinnerModule, PushPipe],
  templateUrl: './process-history-attachments.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProcessHistoryAttachmentsComponent {
  caption: InputSignal<string> = input(null);

  private readonly rfq4ProcessesFacade: Rfq4ProcessFacade =
    inject(Rfq4ProcessFacade);

  readonly attachments = toSignal(this.rfq4ProcessesFacade.processAttachments$);
  readonly attachmentLoading$ = this.rfq4ProcessesFacade.attachmentLoading$;

  downloadAttachment(attachment: RfqCalculatorAttachment) {
    this.rfq4ProcessesFacade.downloadAttachment(attachment);
  }
}
