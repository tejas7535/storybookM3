import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { TagComponent } from '@schaeffler/tag';
import { SharedTranslocoModule } from '@schaeffler/transloco';

import { CollapsedFiltersComponent } from './collapsed-filters.component';

@NgModule({
  declarations: [CollapsedFiltersComponent],
  imports: [CommonModule, TagComponent, SharedTranslocoModule],
  exports: [CollapsedFiltersComponent],
})
export class CollapsedFiltersModule {}
