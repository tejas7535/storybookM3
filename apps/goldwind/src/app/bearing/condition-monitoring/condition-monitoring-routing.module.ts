import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ConditionMonitoringComponent } from './condition-monitoring.component';

const routes: Routes = [{ path: '', component: ConditionMonitoringComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ConditionMonitoringRoutingModule {}
