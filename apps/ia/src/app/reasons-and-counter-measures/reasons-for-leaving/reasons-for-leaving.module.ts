import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatTooltipModule } from '@angular/material/tooltip';

import { TRANSLOCO_SCOPE } from '@jsverse/transloco';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { FilterModule } from '../../shared/filter/filter.module';
import { NavButtonsComponent } from '../../shared/nav-buttons/nav-buttons.component';
import { SharedModule } from '../../shared/shared.module';
import { ReasonsForLeavingComponent } from './reasons-for-leaving.component';
import { ReasonsForLeavingChartModule } from './reasons-for-leaving-chart/reasons-for-leaving-chart.module';
import { ReasonsForLeavingTableModule } from './reasons-for-leaving-table/reasons-for-leaving-table.module';

@NgModule({
  declarations: [ReasonsForLeavingComponent],
  imports: [
    SharedModule,
    NavButtonsComponent,
    MatButtonModule,
    MatCardModule,
    MatTooltipModule,
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
