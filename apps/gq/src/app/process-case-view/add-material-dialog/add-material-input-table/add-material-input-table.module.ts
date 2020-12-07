import { AgGridModule } from '@ag-grid-community/angular';
import { NgModule } from '@angular/core';
import { SharedModule } from '../../../shared';

import { CellRendererModule } from '../../../shared/cell-renderer/cell-renderer.module';
import { CustomStatusBarModule } from '../../../shared/custom-status-bar/custom-status-bar.module';
import { AddMaterialInputTableComponent } from './add-material-input-table.component';

@NgModule({
  declarations: [AddMaterialInputTableComponent],
  imports: [
    AgGridModule.withComponents([]),
    SharedModule,
    CellRendererModule,
    CustomStatusBarModule,
  ],
  exports: [AddMaterialInputTableComponent],
})
export class AddMaterialInputTableModule {}
