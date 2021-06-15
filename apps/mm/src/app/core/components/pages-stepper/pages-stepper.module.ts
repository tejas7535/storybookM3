import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { StepperModule } from '@schaeffler/stepper';

import { MaterialModule } from './../../../shared/material.module';
import { PageBeforePipe } from './page-before.pipe';
import { PagesStepperComponent } from './pages-stepper.component';

@NgModule({
  declarations: [PagesStepperComponent, PageBeforePipe],
  imports: [CommonModule, MaterialModule, StepperModule],
  exports: [PagesStepperComponent],
})
export class PagesStepperModule {}
