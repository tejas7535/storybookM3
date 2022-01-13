import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatRippleModule } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';

import { ReactiveComponentModule } from '@ngrx/component';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import {
  BearingLoadEffects,
  EdmMonitorEffects,
  GreaseStatusEffects,
  LoadDistributionEffects,
  ShaftEffects,
  StaticSafetyEffects,
} from '../../core/store/effects';
import { edmHistogramReducer } from '../../core/store/reducers/edm-monitor/edm-histogram.reducer';
import { edmMonitorReducer } from '../../core/store/reducers/edm-monitor/edm-monitor.reducer';
import { greaseStatusReducer } from '../../core/store/reducers/grease-status/grease-status.reducer';
import { loadDistributionReducer } from '../../core/store/reducers/load-distribution/load-distribution.reducer';
import { loadSenseReducer } from '../../core/store/reducers/load-sense/load-sense.reducer';
import { shaftReducer } from '../../core/store/reducers/shaft/shaft.reducer';
import { staticSafetyReducer } from '../../core/store/reducers/static-safety/static-safety.reducer';
import { DashboardMoreInfoDialogComponent } from '../../shared/dashboard-more-info-dialog/dashboard-more-info-dialog.component';
import { SharedModule } from '../../shared/shared.module';
import { CmEquipmentComponent } from './cm-equipment/cm-equipment.component';
import { ConditionMonitoringComponent } from './condition-monitoring.component';
import { ConditionMonitoringRoutingModule } from './condition-monitoring-routing.module';
import { EdmMonitorModule } from './edm-monitor/edm-monitor.module';
import { GreaseMonitorModule } from './grease-monitor/grease-monitor.module';
import { LoadDistributionCardModule } from './load-distribution-card/load-distribution-card.module';
import { ShaftModule } from './shaft/shaft.module';
import { StaticSafteyFactorMonitorModule } from './static-saftey-factor-monitor/static-saftey-factor-monitor.module';

@NgModule({
  declarations: [ConditionMonitoringComponent, CmEquipmentComponent],
  imports: [
    CommonModule,
    ConditionMonitoringRoutingModule,
    EdmMonitorModule,
    GreaseMonitorModule,
    LoadDistributionCardModule,
    ShaftModule,
    StaticSafteyFactorMonitorModule,
    SharedModule,

    // UI Modules
    MatCardModule,
    MatButtonModule,
    MatRippleModule,
    MatDialogModule,
    MatIconModule,
    MatTabsModule,

    // Translation
    SharedTranslocoModule,

    // Store
    EffectsModule.forFeature([
      BearingLoadEffects,
      GreaseStatusEffects,
      EdmMonitorEffects,
      ShaftEffects,
      StaticSafetyEffects,
      LoadDistributionEffects,
    ]),
    StoreModule.forFeature('loadSense', loadSenseReducer),
    StoreModule.forFeature('loadDistribution', loadDistributionReducer),
    StoreModule.forFeature('greaseStatus', greaseStatusReducer),
    StoreModule.forFeature('edmMonitor', edmMonitorReducer),
    StoreModule.forFeature('edmHistogram', edmHistogramReducer),
    StoreModule.forFeature('shaft', shaftReducer),
    StoreModule.forFeature('staticSafety', staticSafetyReducer),
    ReactiveComponentModule,
  ],
})
export class ConditionMonitoringModule {}
