import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

import { LoadingSpinnerModule } from '@schaeffler/loading-spinner';
import { SharedTranslocoModule } from '@schaeffler/transloco';

import { LineChartModule } from '../../shared/charts/line-chart/line-chart.module';
import { SharedPipesModule } from '../../shared/pipes/shared-pipes.module';
import { SharedModule } from '../../shared/shared.module';
import { AttritionDialogComponent } from './attrition-dialog.component';
import { AttritionDialogMetaComponent } from './attrition-dialog-meta/attrition-dialog-meta.component';

@NgModule({
  declarations: [AttritionDialogComponent, AttritionDialogMetaComponent],
  imports: [
    SharedModule,
    MatDialogModule,
    MatButtonModule,
    SharedTranslocoModule,
    SharedPipesModule,
    MatIconModule,
    MatTooltipModule,
    MatDividerModule,
    LineChartModule,
    LoadingSpinnerModule,
  ],
  exports: [AttritionDialogComponent],
})
export class AttritionDialogModule {}
