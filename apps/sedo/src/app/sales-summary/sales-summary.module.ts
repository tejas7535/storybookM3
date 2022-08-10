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
import { MatMenuModule } from '@angular/material/menu';
import {
  MAT_SNACK_BAR_DEFAULT_OPTIONS,
  MatSnackBarModule,
} from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';

import { AgGridModule } from 'ag-grid-angular';

import { IgnoreFlagDialogModule } from './sales-row-details/ignore-flag-dialog/ignore-flag-dialog.module';
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
    ReactiveFormsModule,
    MatButtonModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatNativeDateModule,
    MatTooltipModule,
    SalesSummaryRoutingModule,
    IgnoreFlagDialogModule,
    MatSnackBarModule,
  ],
  providers: [
    {
      provide: MAT_SNACK_BAR_DEFAULT_OPTIONS,
      useValue: { duration: 5000 },
    },
  ],
})
export class SalesSummaryModule {}
