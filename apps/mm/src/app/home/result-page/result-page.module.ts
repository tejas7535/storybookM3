import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule } from '@angular/material/snack-bar';

import { LoadingSpinnerModule } from '@schaeffler/loading-spinner';
import { ReportModule } from '@schaeffler/report';

import { SharedModule } from './../../shared/shared.module';
import { ResultPageComponent } from './result-page.component';

@NgModule({
  declarations: [ResultPageComponent],
  imports: [
    CommonModule,
    SharedModule,
    ReportModule,
    LoadingSpinnerModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
  ],
  exports: [ResultPageComponent],
})
export class ResultPageModule {}
