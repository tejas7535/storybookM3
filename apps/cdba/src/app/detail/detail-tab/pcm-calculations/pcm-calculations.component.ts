import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { PriceDetails } from '@cdba/shared/models';

@Component({
  selector: 'cdba-pcm-calculations',
  templateUrl: './pcm-calculations.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PcmCalculationsComponent {
  @Input() priceDetails: PriceDetails;

  headers: { label: string; hint?: boolean }[] = [
    { label: 'date' },
    { label: 'cost', hint: true },
    { label: 'quantity', hint: true },
    { label: 'toolingCost', hint: true },
  ];
}
