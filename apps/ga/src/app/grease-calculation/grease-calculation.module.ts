import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ReactiveComponentModule } from '@ngrx/component';

import { BreadcrumbsModule } from '@schaeffler/breadcrumbs';

import { GreaseStepperModule } from './../core/components/grease-stepper/grease-stepper.module';
import { GreaseCalculationRoutingModule } from './grease-calculation-routing.module';
import { GreaseCalculationComponent } from './grease-calculation.component';

@NgModule({
  declarations: [GreaseCalculationComponent],
  imports: [
    CommonModule,
    BreadcrumbsModule,
    GreaseCalculationRoutingModule,
    GreaseStepperModule,
    ReactiveComponentModule,
  ],
  bootstrap: [GreaseCalculationComponent],
})
export class GreaseCalculationModule {}
