import { NgModule } from '@angular/core';

import { AgGridModule } from '@ag-grid-community/angular';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { SharedModule } from '../../shared.module';
import { CustomLoadingOverlayComponent } from '../table/custom-overlay/custom-loading-overlay/custom-loading-overlay.component';
import { CustomNoRowsOverlayComponent } from '../table/custom-overlay/custom-no-rows-overlay/custom-no-rows-overlay.component';
import { CustomOverlayModule } from '../table/custom-overlay/custom-overlay.module';
import { BomViewButtonComponent } from '../table/custom-status-bar/bom-view-button/bom-view-button.component';
import { CompareViewButtonComponent } from '../table/custom-status-bar/compare-view-button/compare-view-button.component';
import { CustomStatusBarModule } from '../table/custom-status-bar/custom-status-bar.module';
import { CalculationsTableComponent } from './calculations-table.component';

@NgModule({
  declarations: [CalculationsTableComponent],
  imports: [
    SharedModule,
    CustomStatusBarModule,
    SharedTranslocoModule,
    AgGridModule.withComponents([
      BomViewButtonComponent,
      CompareViewButtonComponent,
      CustomLoadingOverlayComponent,
      CustomNoRowsOverlayComponent,
    ]),
    CustomOverlayModule,
  ],
  exports: [CalculationsTableComponent],
})
export class CalculationsTableModule {}
