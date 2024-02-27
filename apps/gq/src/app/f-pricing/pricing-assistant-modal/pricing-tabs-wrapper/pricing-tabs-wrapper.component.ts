import { Component, EventEmitter, Input, Output } from '@angular/core';

import { ComparableMaterialsRowData } from '@gq/core/store/reducers/transactions/models/f-pricing-comparable-materials.interface';

import { MarketValueDriverDisplayItem } from '../models/market-value-driver-display-item.interface';
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

  @Input() comparableTransactionsLoading = true;
  @Input() comparableTransactionsAvailable: boolean;

  @Output() comparedMaterialClicked = new EventEmitter<string>();

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

  techValueDriverDataSource: TableItem[] = [
    {
      id: 1,
      description: 'Heat Treatment',
      editableValue: 15,
      editableValueUnit: '%',
      value: '15 %',
      additionalDescription: 'At least one component is heat treated (e.g. S1)',
    },
    {
      id: 2,
      description: 'Tolerance Class',
      value: '3 %',
      editableValue: 3,
      editableValueUnit: '%',
      additionalDescription:
        'Identification of special tolerance class (e.g. P5)',
    },
    {
      id: 3,
      description: 'Radial Clearance',
      value: '0 %',
      editableValue: 0,
      editableValueUnit: '%',
      additionalDescription: 'Bearing has special radial clearance',
    },
    {
      id: 4,
      description: 'Axial Clearance',
      value: '0 %',
      editableValue: 5,
      editableValueUnit: '%',
      additionalDescription: 'Bearing has special axial clearance',
    },
    {
      id: 5,
      description: 'Engineering effort',
      value: '0 %',
      editableValue: 0,
      editableValueUnit: '%',
      additionalDescription: 'Evaluation of engineering effort',
    },
  ];

  onComparedMaterialClicked(material: string): void {
    this.comparedMaterialClicked.emit(material);
  }

  onTechnicalValueDriversChange(changedSource: TableItem[]): void {
    console.log('changedSource', changedSource);
    this.techValueDriverDataSource = changedSource;
  }

  marketValueDriverSelectionChanged(data: MarketValueDriverDisplayItem): void {
    // when a selection of a question has changed it is fired here
    console.log(data);
  }
}
