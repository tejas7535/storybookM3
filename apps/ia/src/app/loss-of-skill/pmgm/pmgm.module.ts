import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

import { AgGridModule } from 'ag-grid-angular';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { PmgmComponent } from './pmgm.component';

@NgModule({
  declarations: [PmgmComponent],
  imports: [
    CommonModule,
    AgGridModule,
    SharedTranslocoModule,
    FormsModule,
    MatCheckboxModule,
    MatIconModule,
    MatTooltipModule,
  ],
  exports: [PmgmComponent],
})
export class PmgmModule {}
