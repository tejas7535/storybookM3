import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { PushPipe } from '@ngrx/component';

import { BreadcrumbsModule } from '@schaeffler/breadcrumbs';

import { GreaseStepperComponent } from '../../core/components/grease-stepper';
import {
  CalculationParametersGuard,
  CalculationResultGuard,
} from '../../core/guards';
import { GreaseCalculationComponent } from './grease-calculation.component';
import { GreaseCalculationRoutingModule } from './grease-calculation-routing.module';

@NgModule({
  declarations: [GreaseCalculationComponent],
  imports: [
    CommonModule,
    BreadcrumbsModule,
    GreaseCalculationRoutingModule,
    GreaseStepperComponent,
    PushPipe,
  ],
  providers: [CalculationParametersGuard, CalculationResultGuard],
  bootstrap: [GreaseCalculationComponent],
})
export class GreaseCalculationModule {}
