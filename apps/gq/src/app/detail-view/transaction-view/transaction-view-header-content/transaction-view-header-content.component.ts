import { Component, Input } from '@angular/core';

import { QuotationDetail } from '../../../shared/models/quotation-detail';

@Component({
  selector: 'gq-transaction-view-header-content',
  templateUrl: './transaction-view-header-content.component.html',
})
export class TransactionViewHeaderContentComponent {
  @Input() quotationDetail: QuotationDetail;
  @Input() currency: string;
}
