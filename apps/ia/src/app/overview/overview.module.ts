import { NgModule } from '@angular/core';

import { TRANSLOCO_SCOPE } from '@ngneat/transloco';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { LineChartModule } from '../shared/line-chart/line-chart.module';
import { SharedModule } from '../shared/shared.module';
import { EntriesExitsModule } from './entries-exits/entries-exits.module';
import { OverviewChartModule } from './overview-chart/overview-chart.module';
import { OverviewRoutingModule } from './overview-routing.module';
import { OverviewComponent } from './overview.component';
import * as fromOverview from './store';
import { OverviewEffects } from './store/effects/overview.effects';

@NgModule({
  declarations: [OverviewComponent],
  imports: [
    SharedModule,
    OverviewRoutingModule,
    StoreModule.forFeature(
      fromOverview.overviewFeatureKey,
      fromOverview.reducer
    ),
    EffectsModule.forFeature([OverviewEffects]),
    SharedTranslocoModule,
    OverviewChartModule,
    EntriesExitsModule,
    LineChartModule,
  ],
  providers: [{ provide: TRANSLOCO_SCOPE, useValue: 'overview' }],
})
export class OverviewModule {}
