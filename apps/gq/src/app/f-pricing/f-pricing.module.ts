import { OverlayModule } from '@angular/cdk/overlay';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';

import { fPricingStoreModule } from '@gq/core/store/f-pricing/f-pricing-store.module';
import { DialogHeaderModule } from '@gq/shared/components/header/dialog-header/dialog-header.module';
import { HorizontalDividerModule } from '@gq/shared/components/horizontal-divider/horizontal-divider.module';
import { LabelTextModule } from '@gq/shared/components/label-text/label-text.module';
import { StarRatingModule } from '@gq/shared/components/star-rating/star-rating.module';
import { SharedPipesModule } from '@gq/shared/pipes/shared-pipes.module';
import { LetDirective, PushPipe } from '@ngrx/component';
import { AgGridModule } from 'ag-grid-angular';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { OverlayComponent } from './pricing-assistant-modal/overlay/overlay.component';
import { PriceButtonComponent } from './pricing-assistant-modal/price-button/price-button.component';
import { PricingAssistantHeaderComponent } from './pricing-assistant-modal/pricing-assistant-header/pricing-assistant-header.component';
import { PricingAssistantModalComponent } from './pricing-assistant-modal/pricing-assistant-modal.component';
import { PricingResultsComponent } from './pricing-assistant-modal/pricing-results/pricing-results.component';
import { NoTabsDataComponent } from './pricing-assistant-modal/pricing-tabs-wrapper/components/no-tabs-data/no-tabs-data.component';
import { ReferencePricingTableComponent } from './pricing-assistant-modal/pricing-tabs-wrapper/components/reference-pricing-table/reference-pricing-table.component';
import { TabsLabelComponent } from './pricing-assistant-modal/pricing-tabs-wrapper/components/tabs-label/tabs-label.component';
import { PricingTabsWrapperComponent } from './pricing-assistant-modal/pricing-tabs-wrapper/pricing-tabs-wrapper.component';
import { ComparisonDeltaComponent } from './pricing-assistant-modal/product-comparison/comparison-delta/comparison-delta.component';
import { DeltaValueComponent } from './pricing-assistant-modal/product-comparison/comparison-delta/delta-value/delta-value.component';
import { ComparisonPanelComponent } from './pricing-assistant-modal/product-comparison/comparison-panel/comparison-panel.component';
import { DeltaAmountComponent } from './pricing-assistant-modal/product-comparison/comparison-panel/delta-amount/delta-amount.component';
import { ProductComparisonModalComponent } from './pricing-assistant-modal/product-comparison/product-comparison.component';
@NgModule({
  imports: [
    AgGridModule,
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
    LetDirective,
    PushPipe,
    OverlayModule,
    MatExpansionModule,
    MatTableModule,
    DeltaValueComponent,
    // ToDo: Move feature store in modal, requires modal to be standalone
    fPricingStoreModule,
  ],
  declarations: [
    PricingAssistantModalComponent,
    PricingAssistantHeaderComponent,
    PriceButtonComponent,
    PricingResultsComponent,
    PricingTabsWrapperComponent,
    TabsLabelComponent,
    ReferencePricingTableComponent,
    NoTabsDataComponent,
    OverlayComponent,
    ProductComparisonModalComponent,
    ComparisonPanelComponent,
    ComparisonDeltaComponent,
    DeltaAmountComponent,
  ],
  exports: [PricingAssistantModalComponent],
})
export class FPricingModule {}
