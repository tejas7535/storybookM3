import { Component, Input, input } from '@angular/core';

import { QuotationDetail } from '@gq/shared/models/quotation-detail';

@Component({
  selector: 'gq-last-customer-price-information-details',
  templateUrl: './last-customer-price-information-details.component.html',
  standalone: false,
})
export class LastCustomerPriceInformationDetailsComponent {
  @Input() quotationDetail: QuotationDetail;
  readonly currency = input<string>();
  readonly userHasGPCRole = input<boolean>();
  readonly userHasSQVRole = input<boolean>();
}
