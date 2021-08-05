import { NgModule } from '@angular/core';

import { AgGridModule } from '@ag-grid-community/angular';
import { TRANSLOCO_SCOPE } from '@ngneat/transloco';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { AutocompleteInputModule } from '../../../shared/autocomplete-input/autocomplete-input.module';
import { DateInputModule } from '../../../shared/date-input/date-input.module';
import { SelectInputModule } from '../../../shared/select-input/select-input.module';
import { SharedModule } from '../../../shared/shared.module';
import { ReasonsForLeavingTableComponent } from './reasons-for-leaving-table.component';

@NgModule({
  declarations: [ReasonsForLeavingTableComponent],
  imports: [
    SharedModule,
    SharedTranslocoModule,
    AgGridModule.withComponents([]),
    AutocompleteInputModule,
    SelectInputModule,
    DateInputModule,
  ],
  providers: [
    { provide: TRANSLOCO_SCOPE, useValue: 'reasons-and-counter-measures' },
  ],
  exports: [ReasonsForLeavingTableComponent],
})
export class ReasonsForLeavingTableModule {}
