import { CommonModule } from '@angular/common';
import { Component, inject, input, output } from '@angular/core';

import { Rfq4ProcessFacade } from '@gq/core/store/rfq-4-process/rfq-4-process.facade';
import { InfoBannerComponent } from '@gq/shared/components/info-banner/info-banner.component';
import { QuotationDetail } from '@gq/shared/models';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { ModalFooterComponent } from '../modal-footer/modal-footer.component';

@Component({
  selector: 'gq-reopen-process',
  imports: [
    CommonModule,
    ModalFooterComponent,
    SharedTranslocoModule,
    InfoBannerComponent,
  ],
  templateUrl: './reopen-process.component.html',
})
export class ReopenProcessComponent {
  private readonly rfq4ProcessesFacade = inject(Rfq4ProcessFacade);

  quotationDetail = input<QuotationDetail>(null);
  closeDialog = output();

  cancelButtonClicked(): void {
    this.closeDialog.emit();
  }

  sendRequest(): void {
    this.rfq4ProcessesFacade.sendReopenRecalculationRequest(
      this.quotationDetail().gqPositionId
    );
  }
}
