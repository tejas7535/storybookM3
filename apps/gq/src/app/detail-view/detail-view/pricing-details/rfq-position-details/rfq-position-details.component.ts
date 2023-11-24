import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { QuotationRfqData } from '@gq/shared/models/quotation-detail/quotation-rfq-data.interface';

@Component({
  selector: 'gq-rfq-position-details',
  templateUrl: './rfq-position-details.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RfqPositionDetailsComponent {
  @Input() rfqData: QuotationRfqData;
  @Input() currency: string;
  @Input() rfqDataUpdateAvl: boolean;

  updateRfqData(): void {}
}
