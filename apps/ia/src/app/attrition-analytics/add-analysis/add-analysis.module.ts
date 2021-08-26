import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { AddAnalysisComponent } from './add-analysis.component';
import { FeaturesDialogModule } from './features-dialog/features-dialog.module';

@NgModule({
  declarations: [AddAnalysisComponent],
  imports: [
    CommonModule,
    MatIconModule,
    SharedTranslocoModule,
    FeaturesDialogModule,
  ],
  exports: [AddAnalysisComponent],
})
export class AddAnalysisModule {}
