import { NgModule } from '@angular/core';

import { ReactiveComponentModule } from '@ngrx/component';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { SharedModule } from '../shared/shared.module';
import { AttritionQuotaDetailsModule } from './attrition-quota-details/attrition-quota-details.module';
import { OrgChartModule } from './org-chart/org-chart.module';
import { OverviewRoutingModule } from './overview-routing.module';
import { OverviewComponent } from './overview.component';
import * as fromOverview from './store';
import { OverviewEffects } from './store/effects/overview.effects';
import { ToggleChartsModule } from './toggle-charts/toggle-charts.module';
import { WorldMapModule } from './world-map/world-map.module';

@NgModule({
  declarations: [OverviewComponent],
  imports: [
    SharedModule,
    OverviewRoutingModule,
    OrgChartModule,
    ReactiveComponentModule,
    ToggleChartsModule,
    StoreModule.forFeature(
      fromOverview.overviewFeatureKey,
      fromOverview.reducer
    ),
    EffectsModule.forFeature([OverviewEffects]),
    WorldMapModule,
    AttritionQuotaDetailsModule,
    SharedTranslocoModule,
  ],
})
export class OverviewModule {}
