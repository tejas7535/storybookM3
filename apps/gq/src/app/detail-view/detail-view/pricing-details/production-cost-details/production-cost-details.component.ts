import { Component, Input } from '@angular/core';

import { QuotationDetail } from '@gq/shared/models/quotation-detail';

@Component({
  selector: 'gq-production-cost-details',
  templateUrl: './production-cost-details.component.html',
})
export class ProductionCostDetailsComponent {
  @Input() quotationDetail: QuotationDetail;
  @Input() currency: string;
  @Input() materialCostUpdateAvl: boolean;
  @Input() updateMaterialCostsInQuotationDetailLoading: boolean; // TODO: use to spin refresh icon - use loading information from store

  refreshPrice(): void {
    // eslint-disable-next-line no-console
    console.log('emit action here');
  }
}
