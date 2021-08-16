import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { BreadcrumbsModule } from '@schaeffler/breadcrumbs';

import { GreaseCalculationRoutingModule } from './grease-calculation-routing.module';
import { GreaseCalculationComponent } from './grease-calculation.component';

@NgModule({
  declarations: [GreaseCalculationComponent],
  imports: [CommonModule, BreadcrumbsModule, GreaseCalculationRoutingModule],
  bootstrap: [GreaseCalculationComponent],
})
export class GreaseCalculationModule {}
