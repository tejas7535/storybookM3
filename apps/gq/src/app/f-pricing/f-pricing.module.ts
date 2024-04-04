import { OverlayModule } from '@angular/cdk/overlay';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';

import { fPricingStoreModule } from '@gq/core/store/f-pricing/f-pricing-store.module';
import { DialogHeaderModule } from '@gq/shared/components/header/dialog-header/dialog-header.module';
import { HorizontalDividerModule } from '@gq/shared/components/horizontal-divider/horizontal-divider.module';
import { InfoBannerComponent } from '@gq/shared/components/info-banner/info-banner.component';
import { LabelTextModule } from '@gq/shared/components/label-text/label-text.module';
import { DimensionDetailsComponent } from '@gq/shared/components/material-details/dimension-details/dimension-details.component';
import { MaterialAdditionalComponent } from '@gq/shared/components/material-details/material-additional/material-additional.component';
import { MaterialBasicComponent } from '@gq/shared/components/material-details/material-basic/material-basic.component';
import { MaterialSalesOrgDetailsComponent } from '@gq/shared/components/material-details/material-sales-org-details/material-sales-org-details.component';
import { ProductDetailsComponent } from '@gq/shared/components/material-details/product-details/product-details.component';
import { EditingModalModule } from '@gq/shared/components/modal/editing-modal/editing-modal.module';
import { NoDataModule } from '@gq/shared/components/no-data/no-data.module';
import { StarRatingModule } from '@gq/shared/components/star-rating/star-rating.module';
import { SharedDirectivesModule } from '@gq/shared/directives/shared-directives.module';
import { OperatorTextPipe } from '@gq/shared/pipes/operator-text/operator-text.pipe';
import { PositiveValuePipe } from '@gq/shared/pipes/positive-value/positive-value.pipe';
import { SharedPipesModule } from '@gq/shared/pipes/shared-pipes.module';
import { LetDirective, PushPipe } from '@ngrx/component';
import { AgGridModule } from 'ag-grid-angular';

import { LoadingSpinnerModule } from '@schaeffler/loading-spinner';
import { SharedTranslocoModule } from '@schaeffler/transloco';

import { MaterialDetailsComponent } from './pricing-assistant-modal/material-details/material-details.component';
import { OverlayComponent } from './pricing-assistant-modal/overlay/overlay.component';
import { PriceButtonComponent } from './pricing-assistant-modal/price-button/price-button.component';
import { PricingAssistantHeaderComponent } from './pricing-assistant-modal/pricing-assistant-header/pricing-assistant-header.component';
import { PricingAssistantModalComponent } from './pricing-assistant-modal/pricing-assistant-modal.component';
import { PricingResultsComponent } from './pricing-assistant-modal/pricing-results/pricing-results.component';
import { MarketValueDriverItemComponent } from './pricing-assistant-modal/pricing-tabs-wrapper/components/market-value-driver/components/market-value-driver-item/market-value-driver-item.component';
import { MarketValueDriverComponent } from './pricing-assistant-modal/pricing-tabs-wrapper/components/market-value-driver/market-value-driver.component';
import { ReferencePricingTableComponent } from './pricing-assistant-modal/pricing-tabs-wrapper/components/reference-pricing-table/reference-pricing-table.component';
import { SanityChecksTableComponent } from './pricing-assistant-modal/pricing-tabs-wrapper/components/sanity-checks-table/sanity-checks-table.component';
import { SimpleTableComponent } from './pricing-assistant-modal/pricing-tabs-wrapper/components/simple-table/simple-table.component';
import { TabsLabelComponent } from './pricing-assistant-modal/pricing-tabs-wrapper/components/tabs-label/tabs-label.component';
import { EditValueComponent } from './pricing-assistant-modal/pricing-tabs-wrapper/components/technical-value-drivers-table/edit-value/edit-value.component';
import { TechnicalValueDriversTableComponent } from './pricing-assistant-modal/pricing-tabs-wrapper/components/technical-value-drivers-table/technical-value-drivers-table.component';
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
    ProductDetailsComponent,
    DimensionDetailsComponent,
    MaterialBasicComponent,
    MaterialAdditionalComponent,
    MaterialSalesOrgDetailsComponent,
    MatRadioModule,
    LoadingSpinnerModule,
    EditingModalModule,
    InfoBannerComponent,
    MatFormFieldModule,
    MatInputModule,
    // ToDo: Move feature store in modal, requires modal to be standalone
    fPricingStoreModule,
    SharedDirectivesModule,
    NoDataModule,
    OperatorTextPipe,
    PositiveValuePipe,
  ],
  declarations: [
    PricingAssistantModalComponent,
    PricingAssistantHeaderComponent,
    PriceButtonComponent,
    PricingResultsComponent,
    PricingTabsWrapperComponent,
    TabsLabelComponent,
    ReferencePricingTableComponent,

    OverlayComponent,
    ProductComparisonModalComponent,
    ComparisonPanelComponent,
    ComparisonDeltaComponent,
    DeltaAmountComponent,
    MaterialDetailsComponent,
    SimpleTableComponent,
    SanityChecksTableComponent,
    TechnicalValueDriversTableComponent,
    EditValueComponent,
    MarketValueDriverComponent,
    MarketValueDriverItemComponent,
  ],
  exports: [PricingAssistantModalComponent],
})
export class FPricingModule {}
