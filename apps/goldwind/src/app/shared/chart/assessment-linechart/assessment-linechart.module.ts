import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AssessmentLinechartComponent } from './assessment-linechart.component';
import { MatTreeModule } from '@angular/material/tree';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ReactiveComponentModule } from '@ngrx/component';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedTranslocoModule } from '@schaeffler/transloco';
import { MatIconModule } from '@angular/material/icon';
import { DateRangeModule } from '../../date-range/date-range.module';
import { EmptyGraphModule } from '../../empty-graph/empty-graph.module';
import { NgxEchartsModule } from 'ngx-echarts';
import { MatCardModule } from '@angular/material/card';

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
