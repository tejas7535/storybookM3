import { NgModule } from '@angular/core';

import { ReactiveComponentModule } from '@ngrx/component';

import { SharedModule } from '../shared/shared.module';
import { OrgChartModule } from './org-chart/org-chart.module';
import { OverviewRoutingModule } from './overview-routing.module';
import { OverviewComponent } from './overview.component';

@NgModule({
  declarations: [OverviewComponent],
  imports: [
    SharedModule,
    OverviewRoutingModule,
    OrgChartModule,
    ReactiveComponentModule,
  ],
})
export class OverviewModule {}
