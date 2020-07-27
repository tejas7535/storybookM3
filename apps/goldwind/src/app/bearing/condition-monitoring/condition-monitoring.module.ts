import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatCardModule } from '@angular/material/card';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { SharedModule } from '../../shared/shared.module';
import { ConditionMonitoringRoutingModule } from './condition-monitoring-routing.module';
import { ConditionMonitoringComponent } from './condition-monitoring.component';

@NgModule({
  declarations: [ConditionMonitoringComponent],
  imports: [
    CommonModule,
    ConditionMonitoringRoutingModule,
    SharedModule,

    // UI Modules
    MatCardModule,

    // Translation
    SharedTranslocoModule,
  ],
})
export class ConditionMonitoringModule {}
