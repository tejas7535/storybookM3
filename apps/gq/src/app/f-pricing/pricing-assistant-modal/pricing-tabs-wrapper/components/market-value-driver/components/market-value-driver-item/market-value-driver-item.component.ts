import { Component, EventEmitter, Input, Output } from '@angular/core';

import {
  MarketValueDriverDisplayItem,
  MarketValueDriverOptionItem,
} from '../../../../../models/market-value-driver-display-item.interface';

@Component({
  selector: 'gq-market-value-driver-item',
  templateUrl: './market-value-driver-item.component.html',
})
export class MarketValueDriverItemComponent {
  @Input() item: MarketValueDriverDisplayItem;
  @Output() optionChange = new EventEmitter<MarketValueDriverDisplayItem>();

  onOptionChange(option: MarketValueDriverOptionItem): void {
    this.item.options = this.item.options.map((o) => ({
      selected: o.optionId === option.optionId,
      optionId: o.optionId,
    }));

    this.optionChange.emit(this.item);
  }

  trackByFn(index: number): number {
    return index;
  }
}
