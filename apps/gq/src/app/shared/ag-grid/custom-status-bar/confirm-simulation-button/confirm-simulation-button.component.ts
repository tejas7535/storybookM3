import { Component } from '@angular/core';

import { Observable } from 'rxjs';

import { IStatusPanelParams } from '@ag-grid-community/all-modules';
import { Store } from '@ngrx/store';

import { ApplicationInsightsService } from '@schaeffler/application-insights';

import {
  confirmSimulatedQuotation,
  getSimulationModeEnabled,
} from '../../../../core/store';
import { EVENT_NAMES, MassSimulationParams } from '../../../models';

@Component({
  selector: 'gq-confirm-simulation-button',
  templateUrl: './confirm-simulation-button.component.html',
})
export class ConfirmSimulationButtonComponent {
  selectedRowCount = 0;
  params: IStatusPanelParams;
  simulationModeEnabled$: Observable<boolean>;

  constructor(
    private readonly store: Store,
    private readonly insightsService: ApplicationInsightsService
  ) {}

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

    this.insightsService.logEvent(EVENT_NAMES.MASS_SIMULATION_FINISHED, {
      type: this.params.context.simulatedField,
      simulatedValue: this.params.context.simulatedValue,
      numberOfSimulatedRows: this.params.api.getSelectedRows().length,
    } as MassSimulationParams);
  }
}
