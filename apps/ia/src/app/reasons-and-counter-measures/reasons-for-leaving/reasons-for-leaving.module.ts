import { NgModule } from '@angular/core';
import { MatCardModule } from '@angular/material/card';

import { TRANSLOCO_SCOPE } from '@ngneat/transloco';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { FilterModule } from '../../shared/filter/filter.module';
import { SharedModule } from '../../shared/shared.module';
import { ReasonsForLeavingChartModule } from './reasons-for-leaving-chart/reasons-for-leaving-chart.module';
import { ReasonsForLeavingTableModule } from './reasons-for-leaving-table/reasons-for-leaving-table.module';
import { ReasonsForLeavingComponent } from './reasons-for-leaving.component';

@NgModule({
  declarations: [ReasonsForLeavingComponent],
  imports: [
    SharedModule,
    MatCardModule,
    SharedTranslocoModule,
    FilterModule,
    ReasonsForLeavingTableModule,
    ReasonsForLeavingChartModule,
  ],
  providers: [
    { provide: TRANSLOCO_SCOPE, useValue: 'reasons-and-counter-measures' },
  ],
  exports: [ReasonsForLeavingComponent],
})
export class ReasonsForLeavingModule {}
