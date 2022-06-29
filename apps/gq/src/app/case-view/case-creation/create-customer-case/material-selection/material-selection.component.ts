import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatSelectChange } from '@angular/material/select';

import { Store } from '@ngrx/store';

import { getPLsAndSeries } from '../../../../core/store';
import { SalesIndication } from '../../../../core/store/reducers/transactions/models/sales-indication.enum';
import { PLsSeriesRequest } from '../../../../shared/services/rest-services/search-service/models/pls-series-request.model';
import { Selection } from './models/selection.model';

@Component({
  selector: 'gq-material-selection',
  templateUrl: './material-selection.component.html',
})
export class MaterialSelectionComponent implements OnInit, OnChanges {
  @Input() customerId: string;
  @Input() salesOrg: string;

  defaultSelection: Selection[] = [
    {
      id: 1,
      checked: true,
      translation: 'salesHistory',
      value: SalesIndication.INVOICE,
    },
    {
      id: 2,
      checked: false,
      translation: 'ordersOnHand',
      value: SalesIndication.ORDER,
    },
    {
      id: 3,
      checked: false,
      translation: 'lostQuotes',
      value: SalesIndication.LOST_QUOTE,
    },
    {
      id: 4,
      checked: false,
      translation: 'openQuotes',
      value: true,
    },
  ];
  allComplete = false;
  someComplete = true;
  selectionItems: Selection[] = [];
  numberOfYears = 2;
  availableYears: number[] = [];

  constructor(private readonly store: Store) {}
  ngOnInit(): void {
    this.selectionItems = this.createDefaultSelectionCopy();

    // The first year where data for gq is available is 2018, so we only count all years
    // from 2018 to the current year, including the current (not yet finished) year (GQUOTE-721)
    this.availableYears = Array.from(
      {
        length:
          new Date().getFullYear() + 1 - new Date('01-01-2018').getFullYear(),
      },
      (_, i) => i
    );
  }
  ngOnChanges(): void {
    // if input changes
    this.triggerPLsAndSeriesRequest();
  }
  createDefaultSelectionCopy(): Selection[] {
    return JSON.parse(JSON.stringify(this.defaultSelection));
  }
  updateSelection(event: MatCheckboxChange, id: number): void {
    this.selectionItems.find((item) => item.id === id).checked = event.checked;
    const checkedItems = this.selectionItems.filter((item) => item.checked);

    this.allComplete = checkedItems.length === this.selectionItems.length;

    this.someComplete =
      checkedItems.length > 0 &&
      checkedItems.length < this.selectionItems.length;
    this.triggerPLsAndSeriesRequest();
  }

  selectAll(event: MatCheckboxChange): void {
    this.selectionItems.forEach((item) => (item.checked = event.checked));
    this.triggerPLsAndSeriesRequest();
  }

  onHistoricalDataLimitChanged(event: MatSelectChange): void {
    this.numberOfYears = event.value;
    this.triggerPLsAndSeriesRequest();
  }

  resetAll(): void {
    this.selectionItems = this.createDefaultSelectionCopy();
    this.allComplete = false;
    this.someComplete = true;
  }
  triggerPLsAndSeriesRequest(): void {
    if (this.customerId && this.salesOrg && this.selectionItems.length > 0) {
      const includeQuotationHistory = this.selectionItems.find(
        (item) => typeof item.value === 'boolean'
      ).checked;

      const salesIndications = this.selectionItems
        .filter((item) => typeof item.value != 'boolean')
        .filter((item) => item.checked)
        .map((item) => item.value) as SalesIndication[];

      const customerFilters: PLsSeriesRequest = {
        includeQuotationHistory,
        salesIndications,
        customer: {
          customerId: this.customerId,
          salesOrg: this.salesOrg,
        },
        historicalDataLimitInYear: this.numberOfYears,
      };
      this.store.dispatch(getPLsAndSeries({ customerFilters }));
    }
  }
}
