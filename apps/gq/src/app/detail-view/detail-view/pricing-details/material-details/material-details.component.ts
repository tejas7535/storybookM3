import { Component, Input } from '@angular/core';

import { QuotationDetail } from '@gq/shared/models/quotation-detail';

@Component({
  selector: 'gq-material-details',
  templateUrl: './material-details.component.html',
})
export class MaterialDetailsComponent {
  @Input() quotationDetail: QuotationDetail;
}
