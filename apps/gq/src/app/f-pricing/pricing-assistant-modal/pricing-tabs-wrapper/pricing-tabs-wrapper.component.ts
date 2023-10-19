import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { ComparableLinkedTransaction } from '@gq/core/store/reducers/models';

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

  @Input() referencePriceRowData: ComparableLinkedTransaction[];

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
