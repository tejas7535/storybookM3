import { NgModule } from '@angular/core';

import { TRANSLOCO_SCOPE } from '@ngneat/transloco';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

import { ChartLegendModule } from '../shared/charts/chart-legend/chart-legend.module';
import { SharedModule } from '../shared/shared.module';
import { OrgChartModule } from './org-chart/org-chart.module';
import { OrganizationalViewComponent } from './organizational-view.component';
import { OrganizationalViewRoutingModule } from './organizational-view-routing.module';
import * as fromOrganizationalView from './store';
import { OrganizationalViewEffects } from './store/effects/organizational-view.effects';
import { ToggleChartsModule } from './toggle-charts/toggle-charts.module';
import { WorldMapModule } from './world-map/world-map.module';

@NgModule({
  declarations: [OrganizationalViewComponent],
  imports: [
    OrganizationalViewRoutingModule,
    SharedModule,
    OrgChartModule,
    ToggleChartsModule,
    WorldMapModule,
    ChartLegendModule,
    StoreModule.forFeature(
      fromOrganizationalView.organizationalViewFeatureKey,
      fromOrganizationalView.reducer
    ),
    EffectsModule.forFeature([OrganizationalViewEffects]),
  ],
  providers: [{ provide: TRANSLOCO_SCOPE, useValue: 'organizational-view' }],
})
export class OrganizationalViewModule {}
