import { NgModule } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { AttritionDialogModule } from '../../shared/attrition-dialog/attrition-dialog.module';
import { SharedModule } from '../../shared/shared.module';
import { OrgChartComponent } from './org-chart.component';

@NgModule({
  declarations: [OrgChartComponent],
  imports: [SharedModule, MatProgressSpinnerModule, AttritionDialogModule],
  exports: [OrgChartComponent],
})
export class OrgChartModule {}
