import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { PushModule } from '@ngrx/component';
import { AgGridModule } from 'ag-grid-angular';

import { SapPriceDetailsTableComponent } from './sap-price-details-table.component';

@NgModule({
  declarations: [SapPriceDetailsTableComponent],
  imports: [CommonModule, AgGridModule, PushModule],
  exports: [SapPriceDetailsTableComponent],
})
export class SapPriceDetailsTableModule {}
