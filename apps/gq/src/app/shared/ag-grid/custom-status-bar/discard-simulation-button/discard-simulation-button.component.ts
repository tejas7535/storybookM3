import { Component } from '@angular/core';

import { Observable } from 'rxjs';

import { Store } from '@ngrx/store';
import { IStatusPanelParams } from 'ag-grid-community';

import { ApplicationInsightsService } from '@schaeffler/application-insights';

import {
  getSimulationModeEnabled,
  resetSimulatedQuotation,
} from '../../../../core/store';
import { EVENT_NAMES, MassSimulationParams } from '../../../models';

@Component({
  selector: 'gq-discard-simulation-button',
  templateUrl: './discard-simulation-button.component.html',
})
export class DiscardSimulationButtonComponent {
  params: IStatusPanelParams;
  simulationModeEnabled$: Observable<boolean>;

  constructor(
    private readonly store: Store,
    private readonly insightsService: ApplicationInsightsService
  ) {}

  agInit(params: IStatusPanelParams) {
    this.params = params;
    this.simulationModeEnabled$ = this.store.select(getSimulationModeEnabled);
  }

  discardSimulation(): void {
    this.store.dispatch(resetSimulatedQuotation());

    this.insightsService.logEvent(EVENT_NAMES.MASS_SIMULATION_CANCELLED, {
      type: this.params.context.simulatedField,
      simulatedValue: this.params.context.simulatedValue,
      numberOfSimulatedRows: this.params.api.getSelectedRows().length,
    } as MassSimulationParams);
  }
}
