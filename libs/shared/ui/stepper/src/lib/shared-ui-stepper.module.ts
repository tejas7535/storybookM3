import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatStepperModule } from '@angular/material/stepper';

import { SeparatedStepsDirective } from './separatedSteps/separated-steps.directive';

@NgModule({
  imports: [CommonModule, MatStepperModule],
  declarations: [SeparatedStepsDirective],
  exports: [SeparatedStepsDirective],
})
export class StepperModule {}
