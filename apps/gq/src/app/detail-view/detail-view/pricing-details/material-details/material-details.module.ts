import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { HorizontalDividerModule } from '@gq/shared/components/horizontal-divider/horizontal-divider.module';
import { KpiStatusCardComponent } from '@gq/shared/components/kpi-status-card/kpi-status-card.component';
import { LabelTextModule } from '@gq/shared/components/label-text/label-text.module';
import { SharedPipesModule } from '@gq/shared/pipes/shared-pipes.module';
import { PushPipe } from '@ngrx/component';

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
    CommonModule,
    KpiStatusCardComponent,
  ],
  exports: [MaterialDetailsComponent],
})
export class MaterialDetailsModule {}
