import { NgModule } from '@angular/core';

import { AgGridModule } from '@ag-grid-community/angular';
import { TRANSLOCO_SCOPE } from '@ngneat/transloco';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { SharedModule } from '../../../shared/shared.module';
import { ReasonsForLeavingTableComponent } from './reasons-for-leaving-table.component';

@NgModule({
  declarations: [ReasonsForLeavingTableComponent],
  imports: [
    SharedModule,
    SharedTranslocoModule,
    AgGridModule.withComponents([]),
  ],
  providers: [
    { provide: TRANSLOCO_SCOPE, useValue: 'reasons-and-counter-measures' },
  ],
  exports: [ReasonsForLeavingTableComponent],
})
export class ReasonsForLeavingTableModule {}
