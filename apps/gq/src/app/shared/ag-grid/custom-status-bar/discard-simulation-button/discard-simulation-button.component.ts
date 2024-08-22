import { Component, inject } from '@angular/core';

import { Observable } from 'rxjs';

import { ActiveCaseFacade } from '@gq/core/store/active-case/active-case.facade';
import { IStatusPanelParams } from 'ag-grid-community';

import { ApplicationInsightsService } from '@schaeffler/application-insights';

import { EVENT_NAMES, MassSimulationParams } from '../../../models';

@Component({
  selector: 'gq-discard-simulation-button',
  templateUrl: './discard-simulation-button.component.html',
})
export class DiscardSimulationButtonComponent {
  private readonly activeCaseFacade: ActiveCaseFacade =
    inject(ActiveCaseFacade);
  private readonly insightsService: ApplicationInsightsService = inject(
    ApplicationInsightsService
  );
  simulationModeEnabled$: Observable<boolean> =
    this.activeCaseFacade.simulationModeEnabled$;
  params: IStatusPanelParams;

  agInit(params: IStatusPanelParams) {
    this.params = params;
  }

  discardSimulation(): void {
    this.activeCaseFacade.resetSimulatedQuotation();

    this.insightsService.logEvent(EVENT_NAMES.MASS_SIMULATION_CANCELLED, {
      type: this.params.context.simulatedField,
      simulatedValue: this.params.context.simulatedValue,
      numberOfSimulatedRows: this.params.api.getSelectedRows().length,
    } as MassSimulationParams);
  }
}
