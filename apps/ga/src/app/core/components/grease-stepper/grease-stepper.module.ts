import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatStepperModule } from '@angular/material/stepper';

import { LetModule, PushModule } from '@ngrx/component';

import { StepperModule } from '@schaeffler/stepper';
import { SharedTranslocoModule } from '@schaeffler/transloco';

import { GreaseStepperComponent } from './grease-stepper.component';

@NgModule({
  declarations: [GreaseStepperComponent],
  imports: [
    CommonModule,
    MatStepperModule,
    StepperModule,
    LetModule,
    PushModule,
    SharedTranslocoModule,
    MatIconModule,
  ],
  exports: [GreaseStepperComponent],
})
export class GreaseStepperModule {}
