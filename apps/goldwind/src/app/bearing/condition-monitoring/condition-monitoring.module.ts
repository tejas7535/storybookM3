import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatCardModule } from '@angular/material/card';

import { AgGridModule } from '@ag-grid-community/angular';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { SharedModule } from '../../shared/shared.module';
import { CmEquipmentComponent } from './cm-equipment/cm-equipment.component';
import { ConditionMonitoringRoutingModule } from './condition-monitoring-routing.module';
import { ConditionMonitoringComponent } from './condition-monitoring.component';
import { EdmMonitorComponent } from './edm-monitor/edm-monitor.component';

@NgModule({
  declarations: [
    ConditionMonitoringComponent,
    EdmMonitorComponent,
    CmEquipmentComponent,
  ],
  imports: [
    CommonModule,
    ConditionMonitoringRoutingModule,
    SharedModule,

    // UI Modules
    MatCardModule,

    // ag-Grid
    AgGridModule.withComponents([]),

    // Translation
    SharedTranslocoModule,
  ],
})
export class ConditionMonitoringModule {}
