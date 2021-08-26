import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { UndefinedAttributeFallbackModule } from '../../pipes';
import { SharedModule } from '../../shared.module';
import { BomChartModule } from '../bom-chart/bom-chart.module';
import { BomLegendModule } from '../bom-legend/bom-legend.module';
import { BomOverlayModule } from '../bom-overlay/bom-overlay.module';
import { BomTableModule } from '../bom-table/bom-table.module';
import { CalculationsTableModule } from '../calculations-table/calculations-table.module';
import { LoadingSpinnerModule } from '../loading-spinner/loading-spinner.module';
import { BomContainerComponent } from './bom-container.component';

@NgModule({
  declarations: [BomContainerComponent],
  imports: [
    SharedModule,
    SharedTranslocoModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    MatSidenavModule,
    BomTableModule,
    CalculationsTableModule,
    BomChartModule,
    BomLegendModule,
    LoadingSpinnerModule,
    BomOverlayModule,
    UndefinedAttributeFallbackModule,
  ],
  exports: [BomContainerComponent],
})
export class BomContainerModule {}
