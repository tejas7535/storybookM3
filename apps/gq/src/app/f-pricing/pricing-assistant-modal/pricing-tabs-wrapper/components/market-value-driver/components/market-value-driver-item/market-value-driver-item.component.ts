import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatRadioModule } from '@angular/material/radio';
import { MatTooltipModule } from '@angular/material/tooltip';

import { MarketValueDriverSelection } from '@gq/f-pricing/pricing-assistant-modal/models/market-value-driver.selection';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import {
  MarketValueDriverDisplayItem,
  MarketValueDriverOptionItem,
} from '../../../../../models/market-value-driver-display-item.interface';

@Component({
  selector: 'gq-market-value-driver-item',
  templateUrl: './market-value-driver-item.component.html',
  imports: [
    MatRadioModule,
    MatIconModule,
    MatTooltipModule,
    CommonModule,
    SharedTranslocoModule,
  ],
})
export class MarketValueDriverItemComponent implements OnInit {
  @Input() item: MarketValueDriverDisplayItem;
  @Input() isDisabled: boolean;
  @Output() optionChange = new EventEmitter<MarketValueDriverSelection>();

  selectedOptionId: number;

  ngOnInit() {
    this.selectedOptionId = this.item.options.find(
      (item) => item.selected
    )?.optionId;
  }

  onOptionChange(option: MarketValueDriverOptionItem): void {
    const selectedOption: MarketValueDriverSelection = {
      questionId: this.item.questionId,
      selectedOptionId: option.optionId,
      surcharge: option.surcharge,
    };
    this.selectedOptionId = option.optionId;

    this.optionChange.emit(selectedOption);
  }
}
