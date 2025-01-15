import { Component, inject } from '@angular/core';

import { Observable } from 'rxjs';

import { ActiveCaseFacade } from '@gq/core/store/active-case/active-case.facade';
import { IStatusPanelParams } from 'ag-grid-enterprise';

import { ApplicationInsightsService } from '@schaeffler/application-insights';

import { EVENT_NAMES, MassSimulationParams } from '../../../models';

@Component({
  selector: 'gq-confirm-simulation-button',
  styles: [
    `
      :host {
        @apply h-full;
      }
    `,
  ],
  templateUrl: './confirm-simulation-button.component.html',
})
export class ConfirmSimulationButtonComponent {
  selectedRowCount = 0;
  params: IStatusPanelParams;

  private readonly activeCaseFacade: ActiveCaseFacade =
    inject(ActiveCaseFacade);
  private readonly insightsService: ApplicationInsightsService = inject(
    ApplicationInsightsService
  );

  simulationModeEnabled$: Observable<boolean> =
    this.activeCaseFacade.simulationModeEnabled$;

  canEditQuotation$: Observable<boolean> =
    this.activeCaseFacade.canEditQuotation$;

  agInit(params: IStatusPanelParams) {
    this.params = params;
    this.params.api.addEventListener(
      'selectionChanged',
      this.onSelectionChange.bind(this)
    );
  }

  onSelectionChange(): void {
    this.selectedRowCount = this.params.api.getSelectedRows().length;
  }

  confirmSimulation(): void {
    this.activeCaseFacade.confirmSimulatedQuotation();

    this.insightsService.logEvent(EVENT_NAMES.MASS_SIMULATION_FINISHED, {
      type: this.params.context.simulatedField,
      simulatedValue: this.params.context.simulatedValue,
      numberOfSimulatedRows: this.params.api.getSelectedRows().length,
    } as MassSimulationParams);
  }
}
