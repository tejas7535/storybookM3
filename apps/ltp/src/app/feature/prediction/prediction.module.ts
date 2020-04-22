import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import {
  MAT_RADIO_DEFAULT_OPTIONS,
  MatRadioModule
} from '@angular/material/radio';
import { MatTabsModule } from '@angular/material/tabs';

import { SharedTranslocoModule } from '@schaeffler/shared/transloco';

import { TooltipModule } from '../../shared/components/tooltip/tooltip.module';
import { ChartModule } from './chart/chart.module';
import { KpiComponent } from './kpi/kpi.component';
import { PredictionComponent } from './prediction.component';
import { UploadModalComponent } from './upload-modal/upload-modal.component';

@NgModule({
  declarations: [PredictionComponent, KpiComponent, UploadModalComponent],
  imports: [
    CommonModule,
    FlexLayoutModule,
    MatButtonModule,
    MatMenuModule,
    MatTabsModule,
    SharedTranslocoModule,
    ChartModule,
    MatExpansionModule,
    MatDividerModule,
    MatDialogModule,
    MatIconModule,
    TooltipModule,
    MatFormFieldModule,
    MatInputModule,
    MatRadioModule,
    ReactiveFormsModule
  ],
  providers: [
    {
      provide: MAT_RADIO_DEFAULT_OPTIONS,
      useValue: { color: 'primary' }
    }
  ],
  entryComponents: [UploadModalComponent],
  exports: [PredictionComponent]
})
export class PredictionModule {}
