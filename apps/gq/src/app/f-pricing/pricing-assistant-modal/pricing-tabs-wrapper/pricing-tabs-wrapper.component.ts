import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { ComparableMaterialsRowData } from '@gq/core/store/reducers/transactions/models/f-pricing-comparable-materials.interface';

import { ReferenceDataToShow } from '../models/reference-data-to-show.enum';

@Component({
  selector: 'gq-pricing-tabs-wrapper',
  templateUrl: './pricing-tabs-wrapper.component.html',
})
export class PricingTabsWrapperComponent implements OnInit {
  @Input() referencePrice: number;
  @Input() marketValueDriversValue: number;
  @Input() technicalValueDriversValue: number;
  @Input() sanityCheckValue: number;
  @Input() finalPrice: number;
  @Input() currency: string;

  @Input() referencePriceRowData: ComparableMaterialsRowData[];

  @Output() comparedMaterialClicked = new EventEmitter<string>();

  referenceDataVisible: ReferenceDataToShow;
  readonly referenceDataToShowType = ReferenceDataToShow;

  ngOnInit(): void {
    if (
      !this.referencePriceRowData ||
      this.referencePriceRowData.length === 0
    ) {
      this.referenceDataVisible = ReferenceDataToShow.noReferenceData;

      return;
    }

    this.referenceDataVisible = ReferenceDataToShow.referencePricingTable;
  }

  onComparedMaterialClicked(material: string): void {
    this.comparedMaterialClicked.emit(material);
  }
}
