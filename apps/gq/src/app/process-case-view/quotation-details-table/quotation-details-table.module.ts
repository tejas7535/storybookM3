import { TextFieldModule } from '@angular/cdk/text-field';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { AgGridModule } from '@ag-grid-community/angular';
import { ReactiveComponentModule } from '@ngrx/component';

import { LoadingSpinnerModule } from '@schaeffler/loading-spinner';
import { SharedTranslocoModule } from '@schaeffler/transloco';

import { SharedModule } from '../../shared';
import { EditingModalComponent } from '../../shared/components/editing-modal/editing-modal.component';
import { CustomStatusBarModule } from '../../shared/custom-status-bar/custom-status-bar.module';
import { QuotationDetailsStatusComponent } from '../../shared/custom-status-bar/quotation-details-status/quotation-details-status.component';
import { DialogHeaderModule } from '../../shared/header/dialog-header/dialog-header.module';
import { EditingCommentModalComponent } from './editing-comment-modal/editing-comment-modal.component';
import { QuotationDetailsTableComponent } from './quotation-details-table.component';

@NgModule({
  declarations: [
    QuotationDetailsTableComponent,
    EditingCommentModalComponent,
    EditingModalComponent,
  ],
  imports: [
    SharedModule,
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
  ],
  exports: [QuotationDetailsTableComponent],
})
export class QuotationDetailsTableModule {}
