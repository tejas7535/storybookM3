import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

import { AgGridModule } from '@ag-grid-community/angular';
import { ReactiveComponentModule } from '@ngrx/component';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { NgxEchartsModule } from 'ngx-echarts';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import {
  ConditionMonitoringEffects,
  GreaseStatusEffects,
} from '../../core/store/effects';
import { conditionMonitoringReducer } from '../../core/store/reducers/condition-monitoring/condition-monitoring.reducer';
import { SharedModule } from '../../shared/shared.module';
import { CenterLoadComponent } from './center-load/center-load.component';
import { CmEquipmentComponent } from './cm-equipment/cm-equipment.component';
import { ConditionMonitoringRoutingModule } from './condition-monitoring-routing.module';
import { ConditionMonitoringComponent } from './condition-monitoring.component';
import { EdmMonitorComponent } from './edm-monitor/edm-monitor.component';
import { GreaseMonitorComponent } from './grease-monitor/grease-monitor.component';

@NgModule({
  declarations: [
    ConditionMonitoringComponent,
    CenterLoadComponent,
    CmEquipmentComponent,
    EdmMonitorComponent,
    GreaseMonitorComponent,
  ],
  imports: [
    CommonModule,
    ConditionMonitoringRoutingModule,
    SharedModule,
    NgxEchartsModule.forRoot({
      echarts: () => import('echarts'),
    }),

    // UI Modules
    MatCardModule,
    MatSlideToggleModule,

    // ag-Grid
    AgGridModule.withComponents([]),

    // Translation
    SharedTranslocoModule,

    // Store
    EffectsModule.forFeature([ConditionMonitoringEffects, GreaseStatusEffects]),
    StoreModule.forFeature('conditionMonitoring', conditionMonitoringReducer),
    ReactiveComponentModule,
  ],
})
export class ConditionMonitoringModule {}
