import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { BearingSelectionFiltersSummaryComponent } from './bearing-selection-filters-summary.component';

@NgModule({
  declarations: [BearingSelectionFiltersSummaryComponent],
  imports: [
    CommonModule,

    // Transloco
    SharedTranslocoModule,
  ],
  exports: [BearingSelectionFiltersSummaryComponent],
})
export class BearingSelectionFiltersSummaryModule {}
