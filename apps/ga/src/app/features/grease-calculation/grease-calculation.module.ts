import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { PushModule } from '@ngrx/component';

import { BreadcrumbsModule } from '@schaeffler/breadcrumbs';

import {
  CalculationParametersGuard,
  CalculationResultGuard,
} from '../../core/guards';
import { GreaseStepperComponent } from '../../core/components/grease-stepper';
import { GreaseCalculationComponent } from './grease-calculation.component';
import { GreaseCalculationRoutingModule } from './grease-calculation-routing.module';

@NgModule({
  declarations: [GreaseCalculationComponent],
  imports: [
    CommonModule,
    BreadcrumbsModule,
    GreaseCalculationRoutingModule,
    GreaseStepperComponent,
    PushModule,
  ],
  providers: [CalculationParametersGuard, CalculationResultGuard],
  bootstrap: [GreaseCalculationComponent],
})
export class GreaseCalculationModule {}
