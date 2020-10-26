import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { AgGridModule } from '@ag-grid-community/angular';
import { EffectsModule } from '@ngrx/effects';

import { SalesSummaryEffects } from '../core/store/effects';
import { DataService } from '../shared/data.service';
import { SalesSummaryRoutingModule } from './sales-summary-routing.module';
import { SalesTableComponent } from './sales-table/sales-table.component';

@NgModule({
  declarations: [SalesTableComponent],
  imports: [
    CommonModule,
    AgGridModule,
    SalesSummaryRoutingModule,
    EffectsModule.forFeature([SalesSummaryEffects]),
  ],
  providers: [DataService],
})
export class SalesSummaryModule {}
