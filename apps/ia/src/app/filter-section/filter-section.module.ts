import { NgModule } from '@angular/core';

import { ReactiveComponentModule } from '@ngrx/component';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { AutocompleteInputModule } from '../shared/autocomplete-input/autocomplete-input.module';
import { SharedModule } from '../shared/shared.module';
import { FilterSectionComponent } from './filter-section.component';

@NgModule({
  declarations: [FilterSectionComponent],
  imports: [
    SharedModule,
    AutocompleteInputModule,
    SharedTranslocoModule,
    ReactiveComponentModule,
  ],
  exports: [FilterSectionComponent],
})
export class FilterSectionModule {}
