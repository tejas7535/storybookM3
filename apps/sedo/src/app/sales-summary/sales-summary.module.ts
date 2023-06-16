import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { MatLegacyListModule as MatListModule } from '@angular/material/legacy-list';
import { MatLegacyMenuModule as MatMenuModule } from '@angular/material/legacy-menu';
import {
  MAT_LEGACY_SNACK_BAR_DEFAULT_OPTIONS as MAT_SNACK_BAR_DEFAULT_OPTIONS,
  MatLegacySnackBarModule as MatSnackBarModule,
} from '@angular/material/legacy-snack-bar';
import { MatLegacyTooltipModule as MatTooltipModule } from '@angular/material/legacy-tooltip';

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
