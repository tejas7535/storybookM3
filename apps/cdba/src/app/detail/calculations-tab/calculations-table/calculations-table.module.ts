import { NgModule } from '@angular/core';
import { MatCardModule } from '@angular/material/card';

import { AgGridModule } from '@ag-grid-community/angular';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { SharedModule } from '../../../shared/shared.module';
import { CustomLoadingOverlayComponent } from '../../../shared/table/custom-overlay/custom-loading-overlay/custom-loading-overlay.component';
import { CustomOverlayModule } from '../../../shared/table/custom-overlay/custom-overlay.module';
import { BomViewButtonComponent } from '../../../shared/table/custom-status-bar/bom-view-button/bom-view-button.component';
import { CustomStatusBarModule } from '../../../shared/table/custom-status-bar/custom-status-bar.module';
import { CalculationsTableComponent } from './calculations-table.component';

@NgModule({
  declarations: [CalculationsTableComponent],
  imports: [
    SharedModule,
    CustomStatusBarModule,
    SharedTranslocoModule,
    AgGridModule.withComponents([
      BomViewButtonComponent,
      CustomLoadingOverlayComponent,
    ]),
    MatCardModule,
    CustomOverlayModule,
  ],
  exports: [CalculationsTableComponent],
})
export class CalculationsTableModule {}
