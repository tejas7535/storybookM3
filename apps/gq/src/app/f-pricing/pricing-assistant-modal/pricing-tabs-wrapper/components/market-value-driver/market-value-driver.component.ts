import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

import { MarketValueDriverSelection } from '@gq/f-pricing/pricing-assistant-modal/models/market-value-driver.selection';
import { HorizontalDividerComponent } from '@gq/shared/components/horizontal-divider/horizontal-divider.component';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { MarketValueDriverDisplayItem } from './../../../models/market-value-driver-display-item.interface';
import { MarketValueDriverItemComponent } from './components/market-value-driver-item/market-value-driver-item.component';

@Component({
  selector: 'gq-market-value-driver',
  templateUrl: './market-value-driver.component.html',
  imports: [
    CommonModule,
    HorizontalDividerComponent,
    MarketValueDriverItemComponent,
    MatCardModule,
    SharedTranslocoModule,
    MatIconModule,
  ],
})
export class MarketValueDriverComponent {
  @Input() marketValueDriverItems: MarketValueDriverDisplayItem[];
  @Input() isDisabled: boolean;
  @Output() questionsSelectionChanged =
    new EventEmitter<MarketValueDriverSelection>();

  onOptionChange(selection: MarketValueDriverSelection) {
    this.questionsSelectionChanged.emit(selection);
  }
}
