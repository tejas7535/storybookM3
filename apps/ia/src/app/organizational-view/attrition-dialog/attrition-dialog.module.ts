import { NgModule } from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatLegacyDialogModule as MatDialogModule } from '@angular/material/legacy-dialog';

import { LoadingSpinnerModule } from '@schaeffler/loading-spinner';
import { SharedTranslocoModule } from '@schaeffler/transloco';

import { LineChartModule } from '../../shared/charts/line-chart/line-chart.module';
import { SharedModule } from '../../shared/shared.module';
import { AttritionDialogComponent } from './attrition-dialog.component';
import { AttritionDialogMetaComponent } from './attrition-dialog-meta/attrition-dialog-meta.component';
import { SharedPipesModule } from '../../shared/pipes/shared-pipes.module';

@NgModule({
  declarations: [AttritionDialogComponent, AttritionDialogMetaComponent],
  imports: [
    SharedModule,
    MatDialogModule,
    MatButtonModule,
    SharedTranslocoModule,
    SharedPipesModule,
    MatIconModule,
    MatDividerModule,
    LineChartModule,
    LoadingSpinnerModule,
  ],
  exports: [AttritionDialogComponent],
})
export class AttritionDialogModule {}
