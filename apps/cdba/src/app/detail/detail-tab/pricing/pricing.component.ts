import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { PriceDetails } from '@cdba/shared/models';

@Component({
  selector: 'cdba-pricing',
  templateUrl: './pricing.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class PricingComponent {
  @Input() priceDetails: PriceDetails;

  currentYear = new Date().getFullYear();
}
