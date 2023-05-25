import { Component, Input } from '@angular/core';

import {
  MaterialCostDetails,
  QuotationDetail,
} from '@gq/shared/models/quotation-detail';

@Component({
  selector: 'gq-production-cost-details',
  templateUrl: './production-cost-details.component.html',
})
export class ProductionCostDetailsComponent {
  @Input() quotationDetail: QuotationDetail;
  @Input() currency: string;
  @Input() materialCostDetails: MaterialCostDetails;
}
