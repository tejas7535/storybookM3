import { Component, Input } from '@angular/core';

import { QuotationDetail } from '@gq/shared/models/quotation-detail';

@Component({
  selector: 'gq-last-customer-price-information-details',
  templateUrl: './last-customer-price-information-details.component.html',
})
export class LastCustomerPriceInformationDetailsComponent {
  @Input() quotationDetail: QuotationDetail;
  @Input() currency: string;
}
