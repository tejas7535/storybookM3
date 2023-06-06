import { NgModule } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { AutocompleteInputModule } from '../autocomplete-input/autocomplete-input.module';
import { SelectInputModule } from '../select-input/select-input.module';
import { SharedModule } from '../shared.module';
import { DimensionFilterComponent } from './dimension-filter.component';

@NgModule({
  declarations: [DimensionFilterComponent],
  imports: [
    SharedModule,
    SharedTranslocoModule,
    SelectInputModule,
    AutocompleteInputModule,
    SharedTranslocoModule,
    MatIconModule,
    MatTooltipModule,
  ],
  exports: [DimensionFilterComponent],
})
export class DimensionFilterModule {}
