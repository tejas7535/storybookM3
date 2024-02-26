import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { DrillDownToolPanelComponent } from './drill-down-tool-panel.component';

@NgModule({
  declarations: [DrillDownToolPanelComponent],
  imports: [
    CommonModule,
    MatButtonToggleModule,
    MatIconModule,
    MatTooltipModule,
    SharedTranslocoModule,
    MatMenuModule,
  ],
  exports: [DrillDownToolPanelComponent],
})
export class DrillDownToolPanelModule {}
