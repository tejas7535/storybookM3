import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatStepperModule } from '@angular/material/stepper';

import { ReactiveComponentModule } from '@ngrx/component';

import { StepperModule } from '@schaeffler/stepper';
import { SharedTranslocoModule } from '@schaeffler/transloco';

import { GreaseStepperComponent } from './grease-stepper.component';

@NgModule({
  declarations: [GreaseStepperComponent],
  imports: [
    CommonModule,
    MatStepperModule,
    StepperModule,
    ReactiveComponentModule,
    SharedTranslocoModule,
    MatIconModule,
  ],
  exports: [GreaseStepperComponent],
})
export class GreaseStepperModule {}
