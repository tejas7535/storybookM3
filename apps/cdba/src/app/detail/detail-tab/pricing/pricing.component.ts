import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { PriceDetails } from './model/price.details.model';

@Component({
  selector: 'cdba-pricing',
  templateUrl: './pricing.component.html',
  styleUrls: ['./pricing.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PricingComponent {
  @Input() salesPrice: PriceDetails;
  @Input() errorMessage: string;

  currentYear = new Date().getFullYear();
}
