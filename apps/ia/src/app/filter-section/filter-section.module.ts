import { NgModule } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';

import { ReactiveComponentModule } from '@ngrx/component';

import { SharedModule } from '../shared/shared.module';
import { ExpandedFiltersModule } from './expanded-filters/expanded-filters.module';
import { FilterSectionComponent } from './filter-section.component';

@NgModule({
  declarations: [FilterSectionComponent],
  imports: [
    SharedModule,
    ReactiveComponentModule,
    MatExpansionModule,
    ExpandedFiltersModule,
  ],
  exports: [FilterSectionComponent],
})
export class FilterSectionModule {}
