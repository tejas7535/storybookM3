import { Component, Input } from '@angular/core';

import { MaterialStockByPlant } from '@gq/shared/models/quotation-detail';

@Component({
  selector: 'gq-stock-availability-details',
  templateUrl: './stock-availability-details.component.html',
})
export class StockAvailabilityDetailsComponent {
  @Input() materialStockByPlant: MaterialStockByPlant;
  @Input() uom: string;
}
