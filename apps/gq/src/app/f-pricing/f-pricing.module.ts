import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';

import { DialogHeaderModule } from '@gq/shared/components/header/dialog-header/dialog-header.module';
import { HorizontalDividerModule } from '@gq/shared/components/horizontal-divider/horizontal-divider.module';
import { LabelTextModule } from '@gq/shared/components/label-text/label-text.module';
import { StarRatingModule } from '@gq/shared/components/star-rating/star-rating.module';
import { SharedPipesModule } from '@gq/shared/pipes/shared-pipes.module';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { TabsLabelComponent } from './pricing-assistant-modal/market-value-drivers/components/tabs-label/tabs-label.component';
import { MarketValueDriversComponent } from './pricing-assistant-modal/market-value-drivers/market-value-drivers.component';
import { PriceButtonComponent } from './pricing-assistant-modal/price-button/price-button.component';
import { PricingAssistantHeaderComponent } from './pricing-assistant-modal/pricing-assistant-header/pricing-assistant-header.component';
import { PricingAssistantModalComponent } from './pricing-assistant-modal/pricing-assistant-modal.component';
import { PricingResultsComponent } from './pricing-assistant-modal/pricing-results/pricing-results.component';
@NgModule({
  imports: [
    CommonModule,
    DialogHeaderModule,
    SharedTranslocoModule,
    HorizontalDividerModule,
    MatIconModule,
    SharedPipesModule,
    LabelTextModule,
    MatButtonModule,
    MatCardModule,
    StarRatingModule,
    MatTooltipModule,
    MatTabsModule,
  ],
  declarations: [
    PricingAssistantModalComponent,
    PricingAssistantHeaderComponent,
    PriceButtonComponent,
    PricingResultsComponent,
    MarketValueDriversComponent,
    TabsLabelComponent,
  ],
  exports: [PricingAssistantModalComponent],
})
export class FPricingModule {}
