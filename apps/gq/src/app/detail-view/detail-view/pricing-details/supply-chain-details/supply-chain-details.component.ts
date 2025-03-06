import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { QuotationDetail } from '@gq/shared/models/quotation-detail';

@Component({
  selector: 'gq-supply-chain-details',
  templateUrl: './supply-chain-details.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class SupplyChainDetailsComponent {
  @Input() quotationDetail: QuotationDetail;
  @Input() productionPlantStochasticType: string;
  @Input() supplyPlantStochasticType: string;
}
