import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatLegacyCardModule as MatCardModule } from '@angular/material/legacy-card';
import { MatLegacyMenuModule as MatMenuModule } from '@angular/material/legacy-menu';
import { MatSidenavModule } from '@angular/material/sidenav';

import { LetDirective, PushPipe } from '@ngrx/component';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { ResizeModule } from '@cdba/shared/directives/resize';
import {
  MaterialNumberModule,
  UndefinedAttributeFallbackModule,
} from '@cdba/shared/pipes';

import { BomChartModule } from '../bom-chart/bom-chart.module';
import { BomLegendModule } from '../bom-legend/bom-legend.module';
import { BomOverlayModule } from '../bom-overlay/bom-overlay.module';
import { BomTableModule } from '../bom-table/bom-table.module';
import { CalculationsTableModule } from '../calculations-table/calculations-table.module';
import { CostElementsTableModule } from '../cost-elements-table/cost-elements-table.module';
import { LoadingSpinnerModule } from '../loading-spinner/loading-spinner.module';
import { RawMaterialAnalysisTableModule } from '../raw-material-analysis-table/raw-material-analysis-table.module';
import { BomContainerComponent } from './bom-container.component';

@NgModule({
  declarations: [BomContainerComponent],
  imports: [
    CommonModule,
    PushPipe,
    LetDirective,
    SharedTranslocoModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    MatSidenavModule,
    BomTableModule,
    CalculationsTableModule,
    CostElementsTableModule,
    RawMaterialAnalysisTableModule,
    BomChartModule,
    BomLegendModule,
    LoadingSpinnerModule,
    BomOverlayModule,
    UndefinedAttributeFallbackModule,
    MaterialNumberModule,
    ResizeModule,
  ],
  exports: [BomContainerComponent],
})
export class BomContainerModule {}
