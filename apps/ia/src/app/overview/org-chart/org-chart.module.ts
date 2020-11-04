import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { OrgChartComponent } from './org-chart.component';

@NgModule({
  declarations: [OrgChartComponent],
  imports: [CommonModule],
  exports: [OrgChartComponent],
})
export class OrgChartModule {}
