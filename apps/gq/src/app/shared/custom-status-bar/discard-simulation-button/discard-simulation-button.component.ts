import { Component } from '@angular/core';

import { Observable } from 'rxjs';

import { Store } from '@ngrx/store';

import {
  getSimulationModeEnabled,
  resetSimulatedQuotation,
} from '../../../core/store';

@Component({
  selector: 'gq-discard-simulation-button',
  templateUrl: './discard-simulation-button.component.html',
})
export class DiscardSimulationButtonComponent {
  simulationModeEnabled$: Observable<boolean>;

  constructor(private readonly store: Store) {}

  agInit() {
    this.simulationModeEnabled$ = this.store.select(getSimulationModeEnabled);
  }

  discardSimulation(): void {
    this.store.dispatch(resetSimulatedQuotation());
  }
}
