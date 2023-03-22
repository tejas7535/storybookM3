import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

import { DialogHeaderModule } from '@gq/shared/components/header/dialog-header/dialog-header.module';
import { HorizontalDividerModule } from '@gq/shared/components/horizontal-divider/horizontal-divider.module';
import { KpiStatusCardComponent } from '@gq/shared/components/kpi-status-card/kpi-status-card.component';
import { LabelTextModule } from '@gq/shared/components/label-text/label-text.module';
import { SharedPipesModule } from '@gq/shared/pipes/shared-pipes.module';
import { PushModule } from '@ngrx/component';
import * as echarts from 'echarts';
import { NgxEchartsModule } from 'ngx-echarts';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import {
  ApprovalCockpitComponent,
  GeneralInformationComponent,
  QuotationByProductLineOrGpsdBarChartComponent,
  QuotationByProductLineOrGpsdComponent,
  QuotationRatingComponent,
} from './components';
import { ApprovalDecisionModalComponent } from './components/approval-decision-modal/approval-decision-modal.component';
import { OverviewTabComponent } from './overview-tab.component';
import { OverviewTabRoutingModule } from './overview-tab.routing.module';
@NgModule({
  imports: [
    CommonModule,
    NgxEchartsModule.forRoot({
      echarts,
    }),
    OverviewTabRoutingModule,
    SharedTranslocoModule,
    KpiStatusCardComponent,
    LabelTextModule,
    HorizontalDividerModule,
    MatIconModule,
    SharedPipesModule,
    PushModule,
    MatCardModule,
    MatSelectModule,
    DialogHeaderModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatInputModule,
  ],
  declarations: [
    OverviewTabComponent,
    GeneralInformationComponent,
    QuotationRatingComponent,
    QuotationByProductLineOrGpsdComponent,
    QuotationByProductLineOrGpsdBarChartComponent,
    ApprovalCockpitComponent,
    ApprovalDecisionModalComponent,
  ],
  exports: [
    OverviewTabComponent,
    GeneralInformationComponent,
    QuotationRatingComponent,
    QuotationByProductLineOrGpsdComponent,
    QuotationByProductLineOrGpsdBarChartComponent,
  ],
})
export class OverviewTabModule {}
