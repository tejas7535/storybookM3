import { NgModule } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

import { AgGridModule } from 'ag-grid-angular';

import { CustomOverlayModule } from '@cdba/shared/components/table/custom-overlay/custom-overlay.module';

import { ActionsCellRendererComponent } from './actions-cell-renderer/actions-cell-renderer.component';
import { DrawingsTableComponent } from './drawings-table.component';

@NgModule({
  declarations: [DrawingsTableComponent, ActionsCellRendererComponent],
  imports: [MatIconModule, AgGridModule, CustomOverlayModule],
  exports: [DrawingsTableComponent],
})
export class DrawingsTableModule {}
