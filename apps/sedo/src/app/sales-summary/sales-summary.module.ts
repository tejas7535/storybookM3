import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';

import { AgGridModule } from '@ag-grid-community/angular';

import { SnackBarModule, SnackBarService } from '@schaeffler/snackbar';

import { DataService } from '../shared/data.service';
import { SalesRowDetailsComponent } from './sales-row-details/sales-row-details.component';
import { SalesSummaryRoutingModule } from './sales-summary-routing.module';
import { SalesTableComponent } from './sales-table/sales-table.component';

@NgModule({
  declarations: [SalesTableComponent, SalesRowDetailsComponent],
  imports: [
    CommonModule,
    AgGridModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatListModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    SalesSummaryRoutingModule,
    SnackBarModule,
  ],
  providers: [DataService, SnackBarService],
})
export class SalesSummaryModule {}
