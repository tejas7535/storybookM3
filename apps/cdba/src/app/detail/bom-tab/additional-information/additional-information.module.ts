import { NgModule } from '@angular/core';
import { MatRippleModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { SharedModule } from '@cdba/shared';
import {
  CalculationsTableModule,
  LoadingSpinnerModule,
} from '@cdba/shared/components';

import { AdditionalInformationComponent } from './additional-information.component';
import { BomChartModule } from './bom-chart/bom-chart.module';
import { BomLegendModule } from './bom-legend/bom-legend.module';

@NgModule({
  declarations: [AdditionalInformationComponent],
  imports: [
    SharedModule,
    SharedTranslocoModule,
    MatTabsModule,
    MatIconModule,
    MatRippleModule,
    CalculationsTableModule,
    BomChartModule,
    BomLegendModule,
    LoadingSpinnerModule,
  ],
  exports: [AdditionalInformationComponent],
})
export class AdditionalInformationModule {}
