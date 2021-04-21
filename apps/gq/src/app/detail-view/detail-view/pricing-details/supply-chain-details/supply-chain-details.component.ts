import { Component, Input } from '@angular/core';

import { QuotationDetail } from '../../../../shared/models/quotation-detail';

@Component({
  selector: 'gq-supply-chain-details',
  templateUrl: './supply-chain-details.component.html',
  styleUrls: ['./supply-chain-details.component.scss'],
})
export class SupplyChainDetailsComponent {
  @Input() quotationDetail: QuotationDetail;
}
