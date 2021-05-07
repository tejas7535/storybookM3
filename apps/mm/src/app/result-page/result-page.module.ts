import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';

import { ReactiveComponentModule } from '@ngrx/component';

import { LoadingSpinnerModule } from '@schaeffler/loading-spinner';
import { ReportModule } from '@schaeffler/report';
import { SharedTranslocoModule } from '@schaeffler/transloco';

import { ResultPageComponent } from './result-page.component';

@NgModule({
  declarations: [ResultPageComponent],
  imports: [
    CommonModule,
    SharedTranslocoModule,

    MatButtonModule,

    ReactiveComponentModule,

    ReportModule,
    LoadingSpinnerModule,
  ],
  exports: [ResultPageComponent],
})
export class ResultPageModule {}
