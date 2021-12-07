import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

import { ApplicationInsightsModule } from '@schaeffler/application-insights';

import { OverviewComponent } from './overview.component';
import { OverviewRoutingModule } from './overview-routing.module';

@NgModule({
  declarations: [OverviewComponent],
  imports: [
    CommonModule,
    OverviewRoutingModule,
    MatCardModule,
    MatIconModule,
    ApplicationInsightsModule,
  ],
})
export class OverviewModule {}
