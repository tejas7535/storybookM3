import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

import { ReactiveComponentModule } from '@ngrx/component';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

import { UnderConstructionModule } from '@schaeffler/empty-states';
import { SharedTranslocoModule } from '@schaeffler/transloco';

import {
  ConditionMonitoringEffects,
  EdmMonitorEffects,
  GreaseStatusEffects,
} from '../../core/store/effects';
import { edmMonitorReducer } from '../../core/store/reducers/edm-monitor/edm-monitor.reducer';
import { greaseStatusReducer } from '../../core/store/reducers/grease-status/grease-status.reducer';
import { loadSenseReducer } from '../../core/store/reducers/load-sense/load-sense.reducer';
import { LoadingSpinnerModule } from '../../shared/loading-spinner/loading-spinner.module';
import { SharedModule } from '../../shared/shared.module';
import { CenterLoadModule } from './center-load/center-load.module';
import { CmEquipmentComponent } from './cm-equipment/cm-equipment.component';
import { ConditionMonitoringRoutingModule } from './condition-monitoring-routing.module';
import { ConditionMonitoringComponent } from './condition-monitoring.component';
import { EdmMonitorModule } from './edm-monitor/edm-monitor.module';
import { GreaseMonitorModule } from './grease-monitor/grease-monitor.module';

@NgModule({
  declarations: [ConditionMonitoringComponent, CmEquipmentComponent],
  imports: [
    CommonModule,
    ConditionMonitoringRoutingModule,
    UnderConstructionModule,
    LoadingSpinnerModule,
    EdmMonitorModule,
    GreaseMonitorModule,
    CenterLoadModule,
    SharedModule,

    // UI Modules
    MatCardModule,
    MatButtonModule,

    // Translation
    SharedTranslocoModule,

    // Store
    EffectsModule.forFeature([
      ConditionMonitoringEffects,
      GreaseStatusEffects,
      EdmMonitorEffects,
    ]),
    StoreModule.forFeature('loadSense', loadSenseReducer),
    StoreModule.forFeature('greaseStatus', greaseStatusReducer),
    StoreModule.forFeature('edmMonitor', edmMonitorReducer),
    ReactiveComponentModule,
  ],
})
export class ConditionMonitoringModule {}
