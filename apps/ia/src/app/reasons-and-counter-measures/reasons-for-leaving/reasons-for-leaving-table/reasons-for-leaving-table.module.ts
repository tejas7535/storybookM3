import { NgModule } from '@angular/core';

import { TRANSLOCO_SCOPE } from '@ngneat/transloco';
import { AgGridModule } from 'ag-grid-angular';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { SharedModule } from '../../../shared/shared.module';
import { ReasonsForLeavingTableComponent } from './reasons-for-leaving-table.component';

@NgModule({
  declarations: [ReasonsForLeavingTableComponent],
  imports: [SharedModule, SharedTranslocoModule, AgGridModule],
  providers: [
    { provide: TRANSLOCO_SCOPE, useValue: 'reasons-and-counter-measures' },
  ],
  exports: [ReasonsForLeavingTableComponent],
})
export class ReasonsForLeavingTableModule {}
