import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { AgGridModule } from '@ag-grid-community/angular';
import { PushModule } from '@ngrx/component';

import { SapPriceDetailsTableComponent } from './sap-price-details-table.component';

@NgModule({
  declarations: [SapPriceDetailsTableComponent],
  imports: [CommonModule, AgGridModule.withComponents({}), PushModule],
  exports: [SapPriceDetailsTableComponent],
})
export class SapPriceDetailsTableModule {}
