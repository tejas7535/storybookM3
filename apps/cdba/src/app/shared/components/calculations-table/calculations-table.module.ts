import { NgModule } from '@angular/core';

import { AgGridModule } from '@ag-grid-community/angular';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { CustomLoadingOverlayComponent } from '../table/custom-overlay/custom-loading-overlay/custom-loading-overlay.component';
import { CustomNoRowsOverlayComponent } from '../table/custom-overlay/custom-no-rows-overlay/custom-no-rows-overlay.component';
import { CompareViewButtonComponent } from '../table/custom-status-bar/compare-view-button/compare-view-button.component';
import { CustomStatusBarModule } from '../table/custom-status-bar/custom-status-bar.module';
import { LoadBomButtonComponent } from '../table/custom-status-bar/load-bom-button/load-bom-button.component';
import { CalculationsTableComponent } from './calculations-table.component';

@NgModule({
  declarations: [CalculationsTableComponent],
  imports: [
    CustomStatusBarModule,
    SharedTranslocoModule,
    AgGridModule.withComponents([
      LoadBomButtonComponent,
      CompareViewButtonComponent,
      CustomLoadingOverlayComponent,
      CustomNoRowsOverlayComponent,
    ]),
  ],
  exports: [CalculationsTableComponent],
})
export class CalculationsTableModule {}
