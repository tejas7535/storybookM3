import { NgModule } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';

import { PushPipe } from '@ngrx/component';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { FilterModule } from '../shared/filter/filter.module';
import { SharedModule } from '../shared/shared.module';
import { CollapsedFiltersModule } from './collapsed-filters/collapsed-filters.module';
import { FilterSectionComponent } from './filter-section.component';

@NgModule({
  declarations: [FilterSectionComponent],
  imports: [
    SharedModule,
    PushPipe,
    MatExpansionModule,
    CollapsedFiltersModule,
    SharedTranslocoModule,
    FilterModule,
  ],
  exports: [FilterSectionComponent],
})
export class FilterSectionModule {}
