import { NgModule } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

import { ReactiveComponentModule } from '@ngrx/component';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { AutocompleteInputModule } from '../shared/autocomplete-input/autocomplete-input.module';
import { DateInputModule } from '../shared/date-input/date-input.module';
import { SelectInputModule } from '../shared/select-input/select-input.module';
import { SharedModule } from '../shared/shared.module';
import { FilterSectionComponent } from './filter-section.component';

@NgModule({
  declarations: [FilterSectionComponent],
  imports: [
    SharedModule,
    AutocompleteInputModule,
    DateInputModule,
    SelectInputModule,
    SharedTranslocoModule,
    ReactiveComponentModule,
    MatIconModule,
    MatTooltipModule,
  ],
  exports: [FilterSectionComponent],
})
export class FilterSectionModule {}
