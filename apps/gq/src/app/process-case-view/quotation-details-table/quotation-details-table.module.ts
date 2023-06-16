import { TextFieldModule } from '@angular/cdk/text-field';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyAutocompleteModule as MatAutocompleteModule } from '@angular/material/legacy-autocomplete';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { MatLegacyProgressSpinnerModule as MatProgressSpinnerModule } from '@angular/material/legacy-progress-spinner';
import { MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select';
import { MatLegacyTooltipModule as MatTooltipModule } from '@angular/material/legacy-tooltip';

import { ColumnHeadersModule } from '@gq/shared/ag-grid/column-headers/column-headers.module';
import { CustomStatusBarModule } from '@gq/shared/ag-grid/custom-status-bar/custom-status-bar.module';
import { AutocompleteInputModule } from '@gq/shared/components/autocomplete-input/autocomplete-input.module';
import { DialogHeaderModule } from '@gq/shared/components/header/dialog-header/dialog-header.module';
import { EditCaseModalComponent } from '@gq/shared/components/modal/edit-case-modal/edit-case-modal.component';
import { EditingMaterialModalComponent } from '@gq/shared/components/modal/editing-material-modal/editing-material-modal.component';
import { EditingModalModule } from '@gq/shared/components/modal/editing-modal/editing-modal.module';
import { StatusBarModalModule } from '@gq/shared/components/modal/status-bar-modal/status-bar-modal.module';
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
  ],
  exports: [QuotationDetailsTableComponent],
})
export class QuotationDetailsTableModule {}
