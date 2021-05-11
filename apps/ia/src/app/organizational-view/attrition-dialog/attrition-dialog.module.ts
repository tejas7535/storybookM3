import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';

import { NgxEchartsModule } from 'ngx-echarts';

import { IconsModule } from '@schaeffler/icons';
import { SharedTranslocoModule } from '@schaeffler/transloco';

import { SharedModule } from '../../shared/shared.module';
import { AttritionDialogLineChartComponent } from './attrition-dialog-line-chart/attrition-dialog-line-chart.component';
import { AttritionDialogMetaComponent } from './attrition-dialog-meta/attrition-dialog-meta.component';
import { AttritionDialogComponent } from './attrition-dialog.component';

@NgModule({
  declarations: [
    AttritionDialogComponent,
    AttritionDialogMetaComponent,
    AttritionDialogLineChartComponent,
  ],
  entryComponents: [AttritionDialogComponent],
  imports: [
    SharedModule,
    MatDialogModule,
    MatButtonModule,
    SharedTranslocoModule,
    IconsModule,
    MatIconModule,
    MatDividerModule,
    NgxEchartsModule.forRoot({
      echarts: () => import('echarts'),
    }),
  ],
  exports: [AttritionDialogComponent],
})
export class AttritionDialogModule {}
