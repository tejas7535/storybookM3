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
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';

import { LetModule, PushModule } from '@ngrx/component';
import { AgGridModule } from 'ag-grid-angular';

import { LoadingSpinnerModule } from '@schaeffler/loading-spinner';
import { SharedTranslocoModule } from '@schaeffler/transloco';

import { ColumnHeadersModule } from '../../shared/ag-grid/column-headers/column-headers.module';
import { CustomStatusBarModule } from '../../shared/ag-grid/custom-status-bar/custom-status-bar.module';
import { AutocompleteInputModule } from '../../shared/components/autocomplete-input/autocomplete-input.module';
import { DialogHeaderModule } from '../../shared/components/header/dialog-header/dialog-header.module';
import { InfoBannerComponent } from '../../shared/components/info-banner/info-banner.component';
import { EditCaseModalComponent } from '../../shared/components/modal/edit-case-modal/edit-case-modal.component';
import { EditingMaterialModalComponent } from '../../shared/components/modal/editing-material-modal/editing-material-modal.component';
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
    EditingMaterialModalComponent,
    EditCaseModalComponent,
  ],
  imports: [
    AutocompleteInputModule,
    CommonModule,
    AgGridModule,
    InfoBannerComponent,
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
    SharedPipesModule,
    MatRadioModule,
    FormsModule,
    MatSelectModule,
    MatTooltipModule,
    MatDatepickerModule,
    MatAutocompleteModule,
    MatProgressSpinnerModule,
  ],
  exports: [QuotationDetailsTableComponent],
})
export class QuotationDetailsTableModule {}
