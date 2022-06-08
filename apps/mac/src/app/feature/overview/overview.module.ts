import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

import { PushModule } from '@ngrx/component';

import { ApplicationInsightsModule } from '@schaeffler/application-insights';
import { SubheaderModule } from '@schaeffler/subheader';

import { OverviewCardModule } from './../../shared/components/overview-card/overview-card.module';
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
    OverviewCardModule,
    SubheaderModule,
    PushModule,
  ],
})
export class OverviewModule {}
