import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';

import { SnackBarModule, SnackBarService } from '@schaeffler/snackbar';

import { ReactiveComponentModule } from '@ngrx/component';

import { ReportComponent } from './report.component';
import { SafeHtmlPipe } from './safe-html.pipe';

@NgModule({
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatExpansionModule,
    ReactiveComponentModule,
    SnackBarModule,
  ],
  declarations: [ReportComponent, SafeHtmlPipe],
  providers: [SnackBarService],
  exports: [ReportComponent],
})
export class ReportModule {}
