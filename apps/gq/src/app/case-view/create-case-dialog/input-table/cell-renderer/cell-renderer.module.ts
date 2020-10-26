import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

import { ActionCellComponent } from './action-cell/action-cell.component';
import { InfoCellComponent } from './info-cell/info-cell.component';

@NgModule({
  declarations: [ActionCellComponent, InfoCellComponent],
  imports: [CommonModule, MatIconModule],
  exports: [ActionCellComponent, InfoCellComponent],
})
export class CellRendererModule {}
