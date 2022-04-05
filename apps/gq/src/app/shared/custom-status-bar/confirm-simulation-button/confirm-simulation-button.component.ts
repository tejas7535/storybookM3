import { Component } from '@angular/core';

import { Observable } from 'rxjs';

import { IStatusPanelParams } from '@ag-grid-community/all-modules';
import { Store } from '@ngrx/store';

import {
  confirmSimulatedQuotation,
  getSimulationModeEnabled,
} from '../../../core/store';

@Component({
  selector: 'gq-confirm-simulation-button',
  templateUrl: './confirm-simulation-button.component.html',
})
export class ConfirmSimulationButtonComponent {
  selectedRowCount = 0;
  params: IStatusPanelParams;
  simulationModeEnabled$: Observable<boolean>;

  constructor(private readonly store: Store) {}

  agInit(params: IStatusPanelParams) {
    this.params = params;
    this.simulationModeEnabled$ = this.store.select(getSimulationModeEnabled);
    this.params.api.addEventListener(
      'selectionChanged',
      this.onSelectionChange.bind(this)
    );
  }

  onSelectionChange(): void {
    this.selectedRowCount = this.params.api.getSelectedRows().length;
  }

  confirmSimulation(): void {
    this.store.dispatch(confirmSimulatedQuotation());
  }
}
