import { Component, OnInit } from '@angular/core';
import { MatCheckboxChange } from '@angular/material/checkbox';

import { SalesIndication } from '../../../../core/store/reducers/transactions/models/sales-indication.enum';
import { Selection } from './models/selection.model';

@Component({
  selector: 'gq-material-selection',
  templateUrl: './material-selection.component.html',
})
export class MaterialSelectionComponent implements OnInit {
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

  ngOnInit(): void {
    this.selectionItems = this.createDefaultSelectionCopy();
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
  }

  selectAll(event: MatCheckboxChange): void {
    this.selectionItems.forEach((item) => (item.checked = event.checked));
  }

  resetAll(): void {
    this.selectionItems = this.createDefaultSelectionCopy();
    this.allComplete = false;
    this.someComplete = true;
  }
}
