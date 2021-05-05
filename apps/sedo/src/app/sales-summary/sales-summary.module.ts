import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatTooltipModule } from '@angular/material/tooltip';

import { AgGridModule } from '@ag-grid-community/angular';

import { SnackBarModule, SnackBarService } from '@schaeffler/snackbar';

import { DataService } from '../shared/data.service';
import { SalesRowDetailsComponent } from './sales-row-details/sales-row-details.component';
import { SalesSummaryRoutingModule } from './sales-summary-routing.module';
import { SalesTableComponent } from './sales-table/sales-table.component';
import { TimeoutWarningRendererComponent } from './timeout-warning/timeout-warning-cellrenderer-component';

@NgModule({
  declarations: [
    SalesTableComponent,
    SalesRowDetailsComponent,
    TimeoutWarningRendererComponent,
  ],
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
    MatIconModule,
    MatTooltipModule,
  ],
  providers: [DataService, SnackBarService],
})
export class SalesSummaryModule {}
