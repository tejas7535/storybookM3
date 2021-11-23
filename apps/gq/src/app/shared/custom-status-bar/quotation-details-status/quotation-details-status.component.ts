import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { Observable } from 'rxjs';

import { IStatusPanelParams, RowNode } from '@ag-grid-community/all-modules';
import { Store } from '@ngrx/store';

import {
  getCustomerCurrency,
  userHasGPCRole,
  userHasSQVRole,
} from '../../../core/store';
import { StatusBarModalComponent } from '../../components/status-bar-modal/status-bar-modal.component';
import { StatusBar } from '../../models';
import { QuotationDetail } from '../../models/quotation-detail';
import { PriceService } from '../../services/price-service/price.service';

@Component({
  selector: 'gq-quotation-details-status',
  templateUrl: './quotation-details-status.component.html',
})
export class QuotationDetailsStatusComponent implements OnInit {
  showGPI$: Observable<boolean>;
  showGPM$: Observable<boolean>;
  customerCurrency$: Observable<string>;
  statusBar: StatusBar = {
    rows: {
      total: 0,
      selected: 0,
    },
    netValue: {
      total: 0,
      selected: 0,
    },
    gpi: {
      total: 0,
      selected: 0,
    },
    gpm: {
      total: 0,
      selected: 0,
    },
  };
  selections: QuotationDetail[] = [];
  private params: IStatusPanelParams;

  constructor(
    private readonly store: Store,
    private readonly dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.showGPI$ = this.store.select(userHasGPCRole);
    this.showGPM$ = this.store.select(userHasSQVRole);

    this.customerCurrency$ = this.store.select(getCustomerCurrency);
  }

  agInit(params: IStatusPanelParams): void {
    this.params = params;
    this.params.api.addEventListener(
      'selectionChanged',
      this.onSelectionChange.bind(this)
    );
    this.params.api.addEventListener(
      'rowDataChanged',
      this.rowValueChanges.bind(this)
    );
  }

  rowValueChanges(): void {
    this.onSelectionChange();

    const details: QuotationDetail[] = [];
    this.params.api.forEachNode((row: RowNode) => details.push(row.data));
    const allRows = PriceService.calculateStatusBarValues(details);
    this.statusBar.rows.total = details.length;
    this.statusBar.netValue.total = allRows.totalNetValue;
    this.statusBar.gpi.total = allRows.totalWeightedGPI;
    this.statusBar.gpm.total = allRows.totalWeightedGPM;
  }

  onSelectionChange(): void {
    this.selections = this.params.api.getSelectedRows();
    const selectedDetails = PriceService.calculateStatusBarValues(
      this.selections
    );
    this.statusBar.rows.selected = this.selections.length;
    this.statusBar.netValue.selected = selectedDetails.totalNetValue;
    this.statusBar.gpi.selected = selectedDetails.totalWeightedGPI;
    this.statusBar.gpm.selected = selectedDetails.totalWeightedGPM;
  }

  showAll(): void {
    this.dialog.open(StatusBarModalComponent, {
      width: '600px',
      data: this.statusBar,
    });
  }
}
