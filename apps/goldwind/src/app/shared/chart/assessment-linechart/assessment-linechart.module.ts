import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatTreeModule } from '@angular/material/tree';

import { ReactiveComponentModule } from '@ngrx/component';
import { NgxEchartsModule } from 'ngx-echarts';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { DateRangeModule } from '../../date-range/date-range.module';
import { EmptyGraphModule } from '../../empty-graph/empty-graph.module';
import { AssessmentLinechartComponent } from './assessment-linechart.component';

@NgModule({
  declarations: [AssessmentLinechartComponent],
  imports: [
    CommonModule,
    MatTreeModule,
    MatButtonModule,
    MatCheckboxModule,
    MatCardModule,
    MatIconModule,
    ReactiveFormsModule,
    NgxEchartsModule.forRoot({
      echarts: async () => import('../echarts'),
    }),
    ReactiveComponentModule,
    SharedTranslocoModule,
    DateRangeModule,
    EmptyGraphModule,
  ],
  exports: [AssessmentLinechartComponent],
})
export class AssessmentLinechartModule {}
