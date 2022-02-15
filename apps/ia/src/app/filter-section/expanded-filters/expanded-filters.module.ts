import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { AutocompleteInputModule } from '../../shared/autocomplete-input/autocomplete-input.module';
import { DateInputModule } from '../../shared/date-input/date-input.module';
import { SelectInputModule } from '../../shared/select-input/select-input.module';
import { ExpandedFiltersComponent } from './expanded-filters.component';

@NgModule({
  declarations: [ExpandedFiltersComponent],
  imports: [
    CommonModule,
    SharedTranslocoModule,
    MatIconModule,
    AutocompleteInputModule,
    DateInputModule,
    SelectInputModule,
    MatTooltipModule,
  ],
  exports: [ExpandedFiltersComponent],
})
export class ExpandedFiltersModule {}
