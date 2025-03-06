import { Component, Input } from '@angular/core';

import { QuotationDetail } from '../../../models/quotation-detail';

@Component({
  selector: 'gq-material-price-header-content',
  templateUrl: './material-price-header-content.component.html',
  standalone: false,
})
export class MaterialPriceHeaderContentComponent {
  @Input() quotationDetail: QuotationDetail;
  @Input() price: number;
  @Input() currency: string;
}
