import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';

import { ProcessCaseEffects } from '@gq/core/store/effects';
import { processCaseReducer } from '@gq/core/store/reducers/process-case/process-case.reducer';
import { PushModule } from '@ngrx/component';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

import { LoadingSpinnerModule } from '@schaeffler/loading-spinner';
import { SharedTranslocoModule } from '@schaeffler/transloco';
import { ViewToggleModule } from '@schaeffler/view-toggle';

import { DialogHeaderModule } from '../../../shared/components/header/dialog-header/dialog-header.module';
import { SharedDirectivesModule } from '../../../shared/directives/shared-directives.module';
import { QuotationDetailsTableModule } from '../../quotation-details-table/quotation-details-table.module';
import { AddCustomViewModalComponent } from './add-custom-view-modal/add-custom-view-modal.component';
import { DeleteCustomViewModalComponent } from './delete-custom-view-modal/delete-custom-view-modal.component';
import { SingleQuotesTabComponent } from './single-quotes-tab.component';
import { SingleQuotesTabRoutingModule } from './single-quotes-tab.routing.module';

@NgModule({
  declarations: [
    SingleQuotesTabComponent,
    AddCustomViewModalComponent,
    DeleteCustomViewModalComponent,
  ],
  imports: [
    CommonModule,
    EffectsModule.forFeature([ProcessCaseEffects]),
    StoreModule.forFeature('processCase', processCaseReducer),
    MatCardModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatRadioModule,
    QuotationDetailsTableModule,
    PushModule,
    SharedTranslocoModule,
    LoadingSpinnerModule,
    SingleQuotesTabRoutingModule,
    ViewToggleModule,
    SharedDirectivesModule,
    DialogHeaderModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  exports: [SingleQuotesTabComponent],
})
export class SingleQuotesTabModule {}
