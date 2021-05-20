import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatStepperModule } from '@angular/material/stepper';

import { StepperModule } from '@schaeffler/stepper';

import { PageBeforePipe } from './page-before.pipe';
import { PagesStepperComponent } from './pages-stepper.component';

@NgModule({
  declarations: [PagesStepperComponent, PageBeforePipe],
  imports: [CommonModule, MatButtonModule, MatStepperModule, StepperModule],
  exports: [PagesStepperComponent],
})
export class PagesStepperModule {}
