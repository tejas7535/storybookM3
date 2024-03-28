import { Component, EventEmitter, Input, Output } from '@angular/core';

import { MarketValueDriverSelection } from '@gq/f-pricing/pricing-assistant-modal/models/market-value-driver.selection';

import { MarketValueDriverDisplayItem } from './../../../models/market-value-driver-display-item.interface';

@Component({
  selector: 'gq-market-value-driver',
  templateUrl: './market-value-driver.component.html',
})
export class MarketValueDriverComponent {
  @Input() marketValueDriverItems: MarketValueDriverDisplayItem[];
  @Output() questionsSelectionChanged =
    new EventEmitter<MarketValueDriverSelection>();

  onOptionChange(selection: MarketValueDriverSelection) {
    this.questionsSelectionChanged.emit(selection);
  }
}
