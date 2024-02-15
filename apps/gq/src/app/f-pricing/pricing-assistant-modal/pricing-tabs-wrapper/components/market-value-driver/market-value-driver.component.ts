import { Component, EventEmitter, Input, Output } from '@angular/core';

import { MarketValueDriverDisplayItem } from './../../../models/market-value-driver-display-item.interface';

@Component({
  selector: 'gq-market-value-driver',
  templateUrl: './market-value-driver.component.html',
})
export class MarketValueDriverComponent {
  @Input() marketValueDriverItems: MarketValueDriverDisplayItem[];
  @Output() questionsSelectionChanged =
    new EventEmitter<MarketValueDriverDisplayItem>();

  trackByFn(_index: number, item: MarketValueDriverDisplayItem): number {
    return item.questionId;
  }
}
