import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatLegacySnackBarModule as MatSnackBarModule } from '@angular/material/legacy-snack-bar';

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
  ],
  exports: [ResultPageComponent],
})
export class ResultPageModule {}
