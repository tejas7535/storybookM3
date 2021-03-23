import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatExpansionModule } from '@angular/material/expansion';

import { TRANSLOCO_SCOPE } from '@ngneat/transloco';
import { ReactiveComponentModule } from '@ngrx/component';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { PlantDisplayPipe } from '../../shared/pipes/plant-display.pipe';
import { MaterialDetailsModule } from './material-details/material-details.module';
import { PricingDetailsComponent } from './pricing-details.component';
import { ProductionCostDetailsComponent } from './production-cost-details/production-cost-details.component';
import { SupplyChainDetailsComponent } from './supply-chain-details/supply-chain-details.component';

@NgModule({
  declarations: [
    PricingDetailsComponent,
    SupplyChainDetailsComponent,
    ProductionCostDetailsComponent,
    PlantDisplayPipe,
  ],
  imports: [
    CommonModule,
    MatCardModule,
    MaterialDetailsModule,
    MatExpansionModule,
    SharedTranslocoModule,
    ReactiveComponentModule,
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
