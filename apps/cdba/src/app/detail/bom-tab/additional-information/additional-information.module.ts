import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatRippleModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';

import { UnderConstructionModule } from '@schaeffler/empty-states';
import { SharedTranslocoModule } from '@schaeffler/transloco';

import { LoadingSpinnerModule } from '../../../shared/loading-spinner/loading-spinner.module';
import { SharedModule } from '../../../shared/shared.module';
import { AdditionalInformationComponent } from './additional-information.component';
import { BomChartModule } from './bom-chart/bom-chart.module';
import { BomLegendModule } from './bom-legend/bom-legend.module';

@NgModule({
  declarations: [AdditionalInformationComponent],
  imports: [
    CommonModule,
    SharedModule,
    SharedTranslocoModule,
    MatTabsModule,
    MatIconModule,
    MatRippleModule,
    UnderConstructionModule,
    BomChartModule,
    BomLegendModule,
    LoadingSpinnerModule,
  ],
  exports: [AdditionalInformationComponent],
})
export class AdditionalInformationModule {}
