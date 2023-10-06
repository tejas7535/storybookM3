import { Component, Input } from '@angular/core';

@Component({
  selector: 'gq-market-value-drivers',
  templateUrl: './market-value-drivers.component.html',
})
export class MarketValueDriversComponent {
  @Input() referencePrice: number;
  @Input() marketValueDriversValue: number;
  @Input() technicalValueDriversValue: number;
  @Input() sanityCheckValue: number;
  @Input() finalPrice: number;
  @Input() currency: string;
}
