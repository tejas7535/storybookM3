import { NgModule } from '@angular/core';

import { TranslocoModule } from '@ngneat/transloco';

import { AutocompleteInputModule } from '../autocomplete-input/autocomplete-input.module';
import { DateInputModule } from '../date-input/date-input.module';
import { SelectInputModule } from '../select-input/select-input.module';
import { SharedModule } from '../shared.module';
import { FilterComponent } from './filter.component';

@NgModule({
  declarations: [FilterComponent],
  imports: [
    SharedModule,
    AutocompleteInputModule,
    SelectInputModule,
    DateInputModule,
    TranslocoModule,
  ],
  exports: [FilterComponent],
})
export class FilterModule {}
