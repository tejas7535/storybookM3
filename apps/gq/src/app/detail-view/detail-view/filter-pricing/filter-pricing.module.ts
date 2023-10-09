import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';

import { ContextMenuModule } from '@gq/shared/components/contextMenu/context-menu.module';
import { DialogHeaderModule } from '@gq/shared/components/header/dialog-header/dialog-header.module';
import { KpiStatusCardComponent } from '@gq/shared/components/kpi-status-card/kpi-status-card.component';
import { SharedDirectivesModule } from '@gq/shared/directives/shared-directives.module';
import { SharedPipesModule } from '@gq/shared/pipes/shared-pipes.module';
import { TRANSLOCO_SCOPE } from '@ngneat/transloco';
import { PushPipe } from '@ngrx/component';

import { LoadingSpinnerModule } from '@schaeffler/loading-spinner';
import { SharedTranslocoModule } from '@schaeffler/transloco';

import { DetailButtonComponent } from './detail-button/detail-button.component';
import { FilterPricingComponent } from './filter-pricing.component';
import { FilterPricingCardComponent } from './filter-pricing-card/filter-pricing-card.component';
import { GqPriceComponent } from './gq-price/gq-price.component';
import { ManualPriceComponent } from './manual-price/manual-price.component';
import { QuantityDisplayComponent } from './quantity/quantity-display/quantity-display.component';
import { SapPriceComponent } from './sap-price/sap-price.component';
import { TargetPriceComponent } from './target-price/target-price.component';

@NgModule({
  declarations: [
    FilterPricingComponent,
    FilterPricingCardComponent,
    ManualPriceComponent,
    GqPriceComponent,
    SapPriceComponent,
    QuantityDisplayComponent,
    DetailButtonComponent,
    TargetPriceComponent,
  ],
  imports: [
    MatButtonModule,
    MatIconModule,
    PushPipe,
    SharedPipesModule,
    DialogHeaderModule,
    LoadingSpinnerModule,
    SharedTranslocoModule,
    CommonModule,
    SharedDirectivesModule,
    MatMenuModule,
    ContextMenuModule,
    KpiStatusCardComponent,
  ],
  providers: [{ provide: TRANSLOCO_SCOPE, useValue: 'detail-view' }],
  exports: [FilterPricingComponent],
})
export class FilterPricingModule {}
