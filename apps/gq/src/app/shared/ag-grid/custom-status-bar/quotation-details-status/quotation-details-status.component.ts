import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { Observable } from 'rxjs';

import {
  getQuotationCurrency,
  getSimulatedQuotation,
  getSimulationModeEnabled,
  userHasGPCRole,
  userHasSQVRole,
} from '@gq/core/store/selectors';
import { Store } from '@ngrx/store';
import { IStatusPanelParams, RowNode } from 'ag-grid-community';

import { StatusBarModalComponent } from '../../../../shared/components/modal/status-bar-modal/status-bar-modal.component';
import { SimulatedQuotation, StatusBar } from '../../../models';
import { QuotationDetail } from '../../../models/quotation-detail';
import { PriceService } from '../../../services/price/price.service';

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
    this.simulatedQuotation$ = this.store.select(getSimulatedQuotation);
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
  }

  rowValueChanges(): void {
    this.onSelectionChange();

    const details: QuotationDetail[] = [];
    this.params.api.forEachNode((row: RowNode) => details.push(row.data));

    this.statusBar.total = PriceService.calculateStatusBarValues(details);
  }

  onSelectionChange(): void {
    this.selections = this.params.api.getSelectedRows();
    this.statusBar.selected = PriceService.calculateStatusBarValues(
      this.selections
    );
  }

  showAll(): void {
    this.dialog.open(StatusBarModalComponent, {
      width: '600px',
      data: this.statusBar,
    });
  }
}
