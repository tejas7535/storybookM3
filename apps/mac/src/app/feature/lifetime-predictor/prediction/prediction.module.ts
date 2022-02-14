import { CommonModule, DecimalPipe } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import {
  MAT_RADIO_DEFAULT_OPTIONS,
  MatRadioModule,
} from '@angular/material/radio';
import { MatTabsModule } from '@angular/material/tabs';

import { ReactiveComponentModule } from '@ngrx/component';

import { BannerModule } from '@schaeffler/banner';
import { SharedTranslocoModule } from '@schaeffler/transloco';

import { SharedModule } from '../../../shared/shared.module';
import { TooltipModule } from './../../../shared/components/tooltip/tooltip.module';
import { ChartModule } from './chart/chart.module';
import { KpiComponent } from './kpi/kpi.component';
import { PredictionComponent } from './prediction.component';
import { UploadModalComponent } from './upload-modal/upload-modal.component';

@NgModule({
  declarations: [PredictionComponent, KpiComponent, UploadModalComponent],
  imports: [
    CommonModule,
    ReactiveComponentModule,
    ChartModule,
    MatTabsModule,
    MatIconModule,
    MatMenuModule,
    MatExpansionModule,
    TooltipModule,
    MatDividerModule,
    MatDialogModule,
    SharedTranslocoModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatRadioModule,
    MatButtonModule,
    MatInputModule,
    MatCardModule,
    SharedModule,
    BannerModule,
  ],
  providers: [
    {
      provide: MAT_RADIO_DEFAULT_OPTIONS,
      useValue: { color: 'primary' },
    },
    DecimalPipe,
  ],
  exports: [PredictionComponent],
})
export class PredictionModule {}
