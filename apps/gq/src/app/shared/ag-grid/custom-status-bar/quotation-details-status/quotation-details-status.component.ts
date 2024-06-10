import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { Observable } from 'rxjs';

import { activeCaseFeature } from '@gq/core/store/active-case/active-case.reducer';
import {
  getQuotationCurrency,
  getSimulationModeEnabled,
} from '@gq/core/store/active-case/active-case.selectors';
import { userHasGPCRole, userHasSQVRole } from '@gq/core/store/selectors';
import { StatusBarModalComponent } from '@gq/shared/components/modal/status-bar-modal/status-bar-modal.component';
import { calculateStatusBarValues } from '@gq/shared/utils/pricing.utils';
import { Store } from '@ngrx/store';
import { IRowNode, IStatusPanelParams } from 'ag-grid-community';

import { SimulatedQuotation, StatusBar } from '../../../models';
import { QuotationDetail } from '../../../models/quotation-detail';
import { calculateFilteredRows } from '../statusbar.utils';

@Component({
  selector: 'gq-quotation-details-status',
  templateUrl: './quotation-details-status.component.html',
  styles: [
    `
      :host {
        width: 100%;
      }
    `,
  ],
})
export class QuotationDetailsStatusComponent implements OnInit {
  showGPI$: Observable<boolean>;
  showGPM$: Observable<boolean>;
  quotationCurrency$: Observable<string>;
  simulationModeEnabled$: Observable<boolean>;
  simulatedQuotation$: Observable<SimulatedQuotation>;
  statusBar = new StatusBar();

  selections: QuotationDetail[] = [];
  private params: IStatusPanelParams;

  constructor(
    private readonly store: Store,
    private readonly dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.showGPI$ = this.store.pipe(userHasGPCRole);
    this.showGPM$ = this.store.pipe(userHasSQVRole);
    this.quotationCurrency$ = this.store.select(getQuotationCurrency);
    this.simulationModeEnabled$ = this.store.select(getSimulationModeEnabled);
    this.simulatedQuotation$ = this.store.select(
      activeCaseFeature.selectSimulatedItem
    );
  }

  agInit(params: IStatusPanelParams): void {
    this.params = params;
    this.params.api.addEventListener(
      'selectionChanged',
      this.onSelectionChange.bind(this)
    );
    this.params.api.addEventListener(
      'rowDataUpdated',
      this.rowValueChanges.bind(this)
    );
    this.params.api.addEventListener(
      'filterChanged',
      this.onFilterChanged.bind(this)
    );
  }

  rowValueChanges(): void {
    this.onSelectionChange();

    const details: QuotationDetail[] = [];
    this.params.api.forEachNode((row: IRowNode) => details.push(row.data));

    this.statusBar.total = calculateStatusBarValues(details);
  }

  onSelectionChange(): void {
    this.selections = this.params.api.getSelectedRows();
    this.statusBar.selected = calculateStatusBarValues(this.selections);
  }

  onFilterChanged(): void {
    const displayedRowCount = this.params.api.getDisplayedRowCount();
    this.statusBar.filtered = calculateFilteredRows(
      displayedRowCount,
      this.statusBar.total.rows
    );
  }

  showAll(): void {
    this.dialog.open(StatusBarModalComponent, {
      width: '600px',
      data: this.statusBar,
    });
  }
}
