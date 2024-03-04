import { Component, EventEmitter, inject, Input, Output } from '@angular/core';

import { FPricingFacade } from '@gq/core/store/f-pricing/f-pricing.facade';
import { ComparableMaterialsRowData } from '@gq/core/store/reducers/transactions/models/f-pricing-comparable-materials.interface';
import { MarketValueDriverSelection } from '@gq/f-pricing/pricing-assistant-modal/models/market-value-driver.selection';

import { MarketValueDriverDisplayItem } from '../models/market-value-driver-display-item.interface';
import { ReferenceDataToShow } from '../models/reference-data-to-show.enum';
import { TableItem } from '../models/table-item';

@Component({
  selector: 'gq-pricing-tabs-wrapper',
  templateUrl: './pricing-tabs-wrapper.component.html',
})
export class PricingTabsWrapperComponent {
  @Input() referencePrice: number;

  @Input() marketValueDriversValue: number;
  @Input() marketValueDriverWarning: boolean;
  @Input() technicalValueDriversValue: number;
  @Input() sanityCheckValue: number;
  @Input() finalPrice: number;
  @Input() currency: string;

  @Input() referencePriceRowData: ComparableMaterialsRowData[];
  @Input() marketValueDriverData: MarketValueDriverDisplayItem[];
  @Input() technicalValueDriversTableItems: TableItem[];

  @Input() comparableTransactionsLoading = true;
  @Input() comparableTransactionsAvailable: boolean;

  @Output() comparedMaterialClicked = new EventEmitter<string>();

  readonly fPricingFacade = inject(FPricingFacade);

  referenceDataVisible: ReferenceDataToShow;
  sanityChecksDataSource: TableItem[] = [
    {
      id: 1,
      description: 'Price recommendation before sanity check',
      value: '174.15 EUR',
    },
    {
      id: 2,
      description: 'Cost (SQV)',
      value: '59.17 EUR',
    },
    {
      id: 3,
      description: 'Min. - Margin Price',
      value: '91.03 EUR (min. Margin 35%)',
    },
    {
      id: 4,
      description: 'Last price customer and material 2022 / Invoice',
      value: '141.72 EUR',
    },
    {
      id: 5,
      description: 'Max. price',
      value: '163.52 EUR',
    },
    {
      id: 6,
      description: 'Price recommendation after sanity check',
      value: '163.52 EUR',
    },
  ];

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
}
