import { NgModule } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { SharedModule } from '../../shared/shared.module';
import { OrgChartComponent } from './org-chart.component';

@NgModule({
  declarations: [OrgChartComponent],
  imports: [SharedModule, MatProgressSpinnerModule],
  exports: [OrgChartComponent],
})
export class OrgChartModule {}
