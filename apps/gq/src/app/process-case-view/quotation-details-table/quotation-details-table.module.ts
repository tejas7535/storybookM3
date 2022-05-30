import { TextFieldModule } from '@angular/cdk/text-field';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatTooltipModule } from '@angular/material/tooltip';

import { AgGridModule } from '@ag-grid-community/angular';
import { ReactiveComponentModule } from '@ngrx/component';

import { LoadingSpinnerModule } from '@schaeffler/loading-spinner';
import { SharedTranslocoModule } from '@schaeffler/transloco';

import { ColumnHeadersModule } from '../../shared/ag-grid/column-headers/column-headers.module';
import { CustomStatusBarModule } from '../../shared/ag-grid/custom-status-bar/custom-status-bar.module';
import { QuotationDetailsStatusComponent } from '../../shared/ag-grid/custom-status-bar/quotation-details-status/quotation-details-status.component';
import { DialogHeaderModule } from '../../shared/components/header/dialog-header/dialog-header.module';
import { EditingModalComponent } from '../../shared/components/modal/editing-modal/editing-modal.component';
import { StatusBarModalModule } from '../../shared/components/modal/status-bar-modal/status-bar-modal.module';
import { SharedPipesModule } from '../../shared/pipes/shared-pipes.module';
import { EditingCommentModalComponent } from './editing-comment-modal/editing-comment-modal.component';
import { QuotationDetailsTableComponent } from './quotation-details-table.component';

@NgModule({
  declarations: [
    QuotationDetailsTableComponent,
    EditingCommentModalComponent,
    EditingModalComponent,
  ],
  imports: [
    CommonModule,
    AgGridModule.withComponents([QuotationDetailsStatusComponent]),
    ReactiveComponentModule,
    SharedTranslocoModule,
    CustomStatusBarModule,
    DialogHeaderModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    TextFieldModule,
    LoadingSpinnerModule,
    StatusBarModalModule,
    MatIconModule,
    ColumnHeadersModule,
    SharedPipesModule,
    MatRadioModule,
    FormsModule,
    MatTooltipModule,
  ],
  exports: [QuotationDetailsTableComponent],
})
export class QuotationDetailsTableModule {}
