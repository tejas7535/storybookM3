import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatChipsModule } from '@angular/material/chips';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { CollapsedFiltersComponent } from './collapsed-filters.component';

@NgModule({
  declarations: [CollapsedFiltersComponent],
  imports: [CommonModule, MatChipsModule, SharedTranslocoModule],
  exports: [CollapsedFiltersComponent],
})
export class CollapsedFiltersModule {}
