import { NgModule } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';

import { ReactiveComponentModule } from '@ngrx/component';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { SharedModule } from '../shared/shared.module';
import { CollapsedFiltersModule } from './collapsed-filters/collapsed-filters.module';
import { ExpandedFiltersModule } from './expanded-filters/expanded-filters.module';
import { FilterSectionComponent } from './filter-section.component';

@NgModule({
  declarations: [FilterSectionComponent],
  imports: [
    SharedModule,
    ReactiveComponentModule,
    MatExpansionModule,
    ExpandedFiltersModule,
    CollapsedFiltersModule,
    SharedTranslocoModule,
  ],
  exports: [FilterSectionComponent],
})
export class FilterSectionModule {}
