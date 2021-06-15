import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { LoadingSpinnerModule } from '@schaeffler/loading-spinner';
import { ReportModule } from '@schaeffler/report';

import { SharedModule } from './../../shared/shared.module';
import { ResultPageComponent } from './result-page.component';

@NgModule({
  declarations: [ResultPageComponent],
  imports: [CommonModule, SharedModule, ReportModule, LoadingSpinnerModule],
  exports: [ResultPageComponent],
})
export class ResultPageModule {}
