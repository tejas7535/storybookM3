import { NgModule } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyTooltipModule as MatTooltipModule } from '@angular/material/legacy-tooltip';

import { TranslocoModule } from '@ngneat/transloco';

import { SelectModule } from '@schaeffler/inputs/select';

import { DimensionFilterModule } from '../../shared/dimension-filter/dimension-filter.module';
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
    DimensionFilterModule,
  ],
  exports: [FilterComponent],
})
export class FilterModule {}
