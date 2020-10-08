import { AgGridModule } from '@ag-grid-community/angular';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SalesSummaryRoutingModule } from './sales-summary-routing.module';
import { SalesTableComponent } from './sales-table/sales-table.component';

@NgModule({
  declarations: [SalesTableComponent],
  imports: [AgGridModule, CommonModule, SalesSummaryRoutingModule],
})
export class SalesSummaryModule {}
