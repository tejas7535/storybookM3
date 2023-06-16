import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyCardModule as MatCardModule } from '@angular/material/legacy-card';

import { PushPipe } from '@ngrx/component';

import { ApplicationInsightsModule } from '@schaeffler/application-insights';
import { SubheaderModule } from '@schaeffler/subheader';
import { SharedTranslocoModule } from '@schaeffler/transloco';

import { OverviewCardModule } from '@mac/shared/components/overview-card/overview-card.module';

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
    PushPipe,
    SharedTranslocoModule,
  ],
})
export class OverviewModule {}
