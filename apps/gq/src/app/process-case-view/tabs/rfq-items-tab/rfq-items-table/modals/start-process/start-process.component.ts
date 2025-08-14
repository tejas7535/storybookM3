import { CommonModule } from '@angular/common';
import { Component, inject, input, output } from '@angular/core';

import { Rfq4ProcessFacade } from '@gq/core/store/rfq-4-process/rfq-4-process.facade';
import { CalculatorFoundComponent } from '@gq/process-case-view/tabs/rfq-items-tab/rfq-items-table/modals/calculator-found/calculator-found.component';
import { CalculatorMissingComponent } from '@gq/process-case-view/tabs/rfq-items-tab/rfq-items-table/modals/calculator-missing/calculator-missing.component';
import { QuotationDetail } from '@gq/shared/models';
import { Rfq4Status } from '@gq/shared/models/quotation-detail/cost';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { ModalFooterComponent } from '../modal-footer/modal-footer.component';

@Component({
  selector: 'gq-start-process',
  imports: [
    CommonModule,
    CalculatorFoundComponent,
    CalculatorMissingComponent,
    ModalFooterComponent,
    SharedTranslocoModule,
  ],
  templateUrl: './start-process.component.html',
})
export class StartProcessComponent {
  private readonly rfq4ProcessesFacade = inject(Rfq4ProcessFacade);
  closeDialog = output();

  quotationDetail = input<QuotationDetail>(null);
  calculators = input<string[]>([]);
  rfq4Status = input<Rfq4Status>();

  message = '';

  cancelButtonClicked(): void {
    this.closeDialog.emit();
  }

  messageChanged(message: string): void {
    this.message = message;
  }

  sendRequest(): void {
    this.rfq4ProcessesFacade.sendRecalculateSqvRequest(
      this.quotationDetail().gqPositionId,
      this.message
    );
  }
}
