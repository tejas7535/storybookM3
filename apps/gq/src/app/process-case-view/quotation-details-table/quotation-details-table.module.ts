import { TextFieldModule } from '@angular/cdk/text-field';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';

import { ColumnHeadersModule } from '@gq/shared/ag-grid/column-headers/column-headers.module';
import { CustomStatusBarModule } from '@gq/shared/ag-grid/custom-status-bar/custom-status-bar.module';
import { AutocompleteInputModule } from '@gq/shared/components/autocomplete-input/autocomplete-input.module';
import { DialogHeaderModule } from '@gq/shared/components/header/dialog-header/dialog-header.module';
import { EditCaseModalComponent } from '@gq/shared/components/modal/edit-case-modal/edit-case-modal.component';
import { EditingMaterialModalComponent } from '@gq/shared/components/modal/editing-material-modal/editing-material-modal.component';
import { EditingModalModule } from '@gq/shared/components/modal/editing-modal/editing-modal.module';
import { StatusBarModalModule } from '@gq/shared/components/modal/status-bar-modal/status-bar-modal.module';
import { PurchaseOrderTypeSelectComponent } from '@gq/shared/components/purchase-order-type-select/purchase-order-type-select.component';
import { SharedDirectivesModule } from '@gq/shared/directives/shared-directives.module';
import { SharedPipesModule } from '@gq/shared/pipes/shared-pipes.module';
import { LetDirective, PushPipe } from '@ngrx/component';
import { AgGridModule } from 'ag-grid-angular';

import { LoadingSpinnerModule } from '@schaeffler/loading-spinner';
import { SharedTranslocoModule } from '@schaeffler/transloco';

import { EditingCommentModalComponent } from './editing-comment-modal/editing-comment-modal.component';
import { QuotationDetailsTableComponent } from './quotation-details-table.component';

@NgModule({
  declarations: [
    QuotationDetailsTableComponent,
    EditingCommentModalComponent,
    EditingMaterialModalComponent,
    EditCaseModalComponent,
  ],
  imports: [
    AutocompleteInputModule,
    CommonModule,
    AgGridModule,
    LetDirective,
    PushPipe,
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
    SharedDirectivesModule,
    SharedPipesModule,
    FormsModule,
    MatSelectModule,
    MatTooltipModule,
    MatDatepickerModule,
    MatAutocompleteModule,
    MatProgressSpinnerModule,
    EditingModalModule,
    PurchaseOrderTypeSelectComponent,
  ],
  exports: [QuotationDetailsTableComponent],
})
export class QuotationDetailsTableModule {}
