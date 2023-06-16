import { Component, Input } from '@angular/core';

import { QuotationDetail } from '@gq/shared/models/quotation-detail';

@Component({
  selector: 'gq-relocation-cost-details',
  templateUrl: './relocation-cost-details.component.html',
})
export class RelocationCostDetailsComponent {
  @Input() quotationDetail: QuotationDetail;
  @Input() currency: string;
}
