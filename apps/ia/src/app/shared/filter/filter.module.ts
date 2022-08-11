import { NgModule } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

import { TranslocoModule } from '@ngneat/transloco';

import { SelectModule } from '@schaeffler/inputs/select';

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
    SelectModule,
    SelectInputModule,
    DateInputModule,
    TranslocoModule,
    MatIconModule,
    MatTooltipModule,
  ],
  exports: [FilterComponent],
})
export class FilterModule {}
