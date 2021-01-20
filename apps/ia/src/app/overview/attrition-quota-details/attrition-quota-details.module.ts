import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ReactiveComponentModule } from '@ngrx/component';

import { AttritionQuotaDetailsComponent } from './attrition-quota-details.component';
import { OverviewChartModule } from './overview-chart/overview-chart.module';

@NgModule({
  declarations: [AttritionQuotaDetailsComponent],
  imports: [CommonModule, ReactiveComponentModule, OverviewChartModule],
  exports: [AttritionQuotaDetailsComponent],
})
export class AttritionQuotaDetailsModule {}
