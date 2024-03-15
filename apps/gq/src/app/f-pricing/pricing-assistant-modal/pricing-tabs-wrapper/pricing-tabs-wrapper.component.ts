import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { MatTabChangeEvent } from '@angular/material/tabs';

import { FPricingFacade } from '@gq/core/store/f-pricing/f-pricing.facade';
import { MarketValueDriverWarningLevel } from '@gq/core/store/f-pricing/models/market-value-driver-warning-level.enum';
import { ComparableMaterialsRowData } from '@gq/core/store/reducers/transactions/models/f-pricing-comparable-materials.interface';
import { MarketValueDriverSelection } from '@gq/f-pricing/pricing-assistant-modal/models/market-value-driver.selection';

import { MarketValueDriverDisplayItem } from '../models/market-value-driver-display-item.interface';
import { TableItem } from '../models/table-item';

@Component({
  selector: 'gq-pricing-tabs-wrapper',
  templateUrl: './pricing-tabs-wrapper.component.html',
})
export class PricingTabsWrapperComponent {
  @Input() referencePrice: number;

  @Input() marketValueDriversValue: number;
  @Input() marketValueDriverWarning: MarketValueDriverWarningLevel;
  @Input() technicalValueDriversValue: number;
  @Input() sanityCheckValue: number;
  @Input() finalPrice: number;
  @Input() currency: string;

  @Input() referencePriceRowData: ComparableMaterialsRowData[];
  @Input() marketValueDriverData: MarketValueDriverDisplayItem[];
  @Input() technicalValueDriversTableItems: TableItem[];
  @Input() sanityChecksTableItems: TableItem[];

  @Input() comparableTransactionsLoading = true;
  @Input() comparableTransactionsAvailable: boolean;

  @Output() comparedMaterialClicked = new EventEmitter<string>();
  @Output() marketValueDriverTabActivated = new EventEmitter<void>();

  readonly marketValueDriverWarningLevel = MarketValueDriverWarningLevel;
  readonly fPricingFacade = inject(FPricingFacade);

  onComparedMaterialClicked(material: string): void {
    this.comparedMaterialClicked.emit(material);
  }

  onTechnicalValueDriversChange(changedTechnicalValueDriver: TableItem): void {
    this.fPricingFacade.updateTechnicalValueDriver(changedTechnicalValueDriver);
  }

  marketValueDriverSelectionChanged(
    selection: MarketValueDriverSelection
  ): void {
    this.fPricingFacade.setMarketValueDriverSelection(selection);
  }

  selectedTabChanged(tabChangedEvent: MatTabChangeEvent): void {
    if (tabChangedEvent.index === 2) {
      this.marketValueDriverTabActivated.emit();
    }
  }
}
