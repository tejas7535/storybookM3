import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';

import { InputSectionModule } from './input-section/input-section.module';
import { PricingViewRoutingModule } from './pricing-view-routing.module';
import { PricingViewComponent } from './pricing-view.component';
import { QuerySectionModule } from './query-section/query-section.module';
import { ResultSectionModule } from './result-section/result-section.module';

@NgModule({
  declarations: [PricingViewComponent],
  imports: [
    CommonModule,
    PricingViewRoutingModule,
    QuerySectionModule,
    ResultSectionModule,
    InputSectionModule,
    FlexLayoutModule,
  ],
})
export class PricingViewModule {}
