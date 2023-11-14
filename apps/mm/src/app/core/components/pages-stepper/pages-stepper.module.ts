import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { QualtricsInfoBannerComponent } from '@mm/shared/components/qualtrics-info-banner/qualtrics-info-banner.component';

import { StepperModule } from '@schaeffler/stepper';
import { SharedTranslocoModule } from '@schaeffler/transloco';

import { MaterialModule } from './../../../shared/material.module';
import { PageBeforePipe } from './page-before.pipe';
import { PagesStepperComponent } from './pages-stepper.component';

@NgModule({
  declarations: [PagesStepperComponent, PageBeforePipe],
  imports: [
    CommonModule,
    MaterialModule,
    StepperModule,
    SharedTranslocoModule,
    QualtricsInfoBannerComponent,
  ],
  exports: [PagesStepperComponent],
})
export class PagesStepperModule {}
