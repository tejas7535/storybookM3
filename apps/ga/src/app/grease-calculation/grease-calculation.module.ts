import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { PushModule } from '@ngrx/component';

import { BreadcrumbsModule } from '@schaeffler/breadcrumbs';

import { ParameterGuard, ResultGuard } from '../core/guards';
import { GreaseStepperModule } from './../core/components/grease-stepper/grease-stepper.module';
import { GreaseCalculationComponent } from './grease-calculation.component';
import { GreaseCalculationRoutingModule } from './grease-calculation-routing.module';

@NgModule({
  declarations: [GreaseCalculationComponent],
  imports: [
    CommonModule,
    BreadcrumbsModule,
    GreaseCalculationRoutingModule,
    GreaseStepperModule,
    PushModule,
  ],
  providers: [ParameterGuard, ResultGuard],
  bootstrap: [GreaseCalculationComponent],
})
export class GreaseCalculationModule {}
