import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

import { InfoCellComponent } from './info-cell/info-cell.component';

@NgModule({
  declarations: [InfoCellComponent],
  imports: [CommonModule, MatIconModule],
  exports: [InfoCellComponent],
})
export class CellRendererModule {}
