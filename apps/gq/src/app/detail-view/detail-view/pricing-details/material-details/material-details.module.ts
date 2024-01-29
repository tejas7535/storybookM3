import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { HorizontalDividerModule } from '@gq/shared/components/horizontal-divider/horizontal-divider.module';
import { KpiStatusCardComponent } from '@gq/shared/components/kpi-status-card/kpi-status-card.component';
import { LabelTextModule } from '@gq/shared/components/label-text/label-text.module';
import { DimensionDetailsComponent } from '@gq/shared/components/material-details/dimension-details/dimension-details.component';
import { MaterialAdditionalComponent } from '@gq/shared/components/material-details/material-additional/material-additional.component';
import { MaterialBasicComponent } from '@gq/shared/components/material-details/material-basic/material-basic.component';
import { ProductDetailsComponent } from '@gq/shared/components/material-details/product-details/product-details.component';
import { SharedPipesModule } from '@gq/shared/pipes/shared-pipes.module';
import { LetDirective, PushPipe } from '@ngrx/component';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { MaterialDetailsComponent } from './material-details.component';
import { MaterialSalesOrgDetailsComponent } from './material-sales-org-details/material-sales-org-details.component';

@NgModule({
  declarations: [MaterialDetailsComponent, MaterialSalesOrgDetailsComponent],
  imports: [
    SharedTranslocoModule,
    SharedPipesModule,
    LabelTextModule,
    HorizontalDividerModule,
    PushPipe,
    LetDirective,
    CommonModule,
    KpiStatusCardComponent,
    ProductDetailsComponent,
    DimensionDetailsComponent,
    MaterialBasicComponent,
    MaterialAdditionalComponent,
  ],

  exports: [MaterialDetailsComponent],
})
export class MaterialDetailsModule {}
