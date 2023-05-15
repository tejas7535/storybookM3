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

import { SharedDirectivesModule } from '@gq/shared/directives/shared-directives.module';
import { LetModule, PushModule } from '@ngrx/component';
import { AgGridModule } from 'ag-grid-angular';

import { LoadingSpinnerModule } from '@schaeffler/loading-spinner';
import { SharedTranslocoModule } from '@schaeffler/transloco';

import { ColumnHeadersModule } from '../../shared/ag-grid/column-headers/column-headers.module';
import { CustomStatusBarModule } from '../../shared/ag-grid/custom-status-bar/custom-status-bar.module';
import { AutocompleteInputModule } from '../../shared/components/autocomplete-input/autocomplete-input.module';
import { DialogHeaderModule } from '../../shared/components/header/dialog-header/dialog-header.module';
import { EditCaseModalComponent } from '../../shared/components/modal/edit-case-modal/edit-case-modal.component';
import { EditingMaterialModalComponent } from '../../shared/components/modal/editing-material-modal/editing-material-modal.component';
import { EditingModalModule } from '../../shared/components/modal/editing-modal/editing-modal.module';
import { StatusBarModalModule } from '../../shared/components/modal/status-bar-modal/status-bar-modal.module';
import { SharedPipesModule } from '../../shared/pipes/shared-pipes.module';
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
    LetModule,
    PushModule,
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
  ],
  exports: [QuotationDetailsTableComponent],
})
export class QuotationDetailsTableModule {}
