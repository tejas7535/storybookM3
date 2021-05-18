import { Component, Input } from '@angular/core';

import { QuotationDetail } from '../../../shared/models/quotation-detail';

@Component({
  selector: 'gq-pricing-details',
  templateUrl: './pricing-details.component.html',
})
export class PricingDetailsComponent {
  @Input() quotationDetail: QuotationDetail;
}
