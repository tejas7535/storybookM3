import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';

import { FreeStockTrafficLightComponent } from '@gq/shared/components/free-stock-traffic-light/free-stock-traffic-light.component';
import { KpiStatusCardComponent } from '@gq/shared/components/kpi-status-card/kpi-status-card.component';
import { LabelTextModule } from '@gq/shared/components/label-text/label-text.module';
import { SharedPipesModule } from '@gq/shared/pipes/shared-pipes.module';
import { TRANSLOCO_SCOPE } from '@ngneat/transloco';
import { PushPipe } from '@ngrx/component';

import { LoadingSpinnerModule } from '@schaeffler/loading-spinner';
import { SharedTranslocoModule } from '@schaeffler/transloco';

import { MaterialComparableCostDetailsComponent } from './material-comparable-cost-details/material-comparable-cost-details.component';
import { MaterialDetailsModule } from './material-details/material-details.module';
import { PricingDetailsComponent } from './pricing-details.component';
import { ProductionCostDetailsComponent } from './production-cost-details/production-cost-details.component';
import { RelocationCostDetailsComponent } from './relocation-cost-details/relocation-cost-details.component';
import { StockAvailabilityDetailsComponent } from './stock-availability-details/stock-availability-details.component';
import { SupplyChainDetailsComponent } from './supply-chain-details/supply-chain-details.component';

@NgModule({
  declarations: [
    PricingDetailsComponent,
    SupplyChainDetailsComponent,
    ProductionCostDetailsComponent,
    MaterialComparableCostDetailsComponent,
    RelocationCostDetailsComponent,
    StockAvailabilityDetailsComponent,
  ],
  imports: [
    CommonModule,
    MaterialDetailsModule,
    MatExpansionModule,
    SharedTranslocoModule,
    PushPipe,
    SharedPipesModule,
    LoadingSpinnerModule,
    LabelTextModule,
    FreeStockTrafficLightComponent,
    KpiStatusCardComponent,
  ],
  providers: [
    {
      provide: TRANSLOCO_SCOPE,
      useValue: 'detail-view',
    },
  ],
  exports: [PricingDetailsComponent],
})
export class PricingDetailsModule {}
