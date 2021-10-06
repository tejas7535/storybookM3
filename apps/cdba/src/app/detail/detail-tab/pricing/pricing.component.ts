import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { PriceDetails } from './model/price.details.model';

@Component({
  selector: 'cdba-pricing',
  templateUrl: './pricing.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PricingComponent {
  @Input() salesPrice: PriceDetails;

  currentYear = new Date().getFullYear();
}
