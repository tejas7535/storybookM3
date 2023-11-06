import { Component, Input } from '@angular/core';

@Component({
  selector: 'gq-delta-amount',
  templateUrl: './delta-amount.component.html',
})
export class DeltaAmountComponent {
  @Input({ required: true }) amount: number;
}
