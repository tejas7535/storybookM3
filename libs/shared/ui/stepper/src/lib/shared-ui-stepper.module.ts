import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatStepperModule } from '@angular/material/stepper';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { StepperComponent } from './stepper/stepper.component';

@NgModule({
  imports: [
    BrowserAnimationsModule,
    CommonModule,
    ReactiveFormsModule,
    MatIconModule,
    MatStepperModule,
    MatButtonModule,
  ],
  declarations: [StepperComponent],
  exports: [StepperComponent],
})
export class StepperModule {}
