import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { ReactiveComponentModule } from '@ngrx/component';

import { LoadingSpinnerModule } from '@schaeffler/loading-spinner';
import { SharedTranslocoModule } from '@schaeffler/transloco';

import { AutocompleteInputModule } from '../../../shared/components/autocomplete-input/autocomplete-input.module';
import { AddEntryModule } from '../../../shared/components/case-material/add-entry/add-entry.module';
import { InputTableModule } from '../../../shared/components/case-material/input-table/input-table.module';
import { DialogHeaderModule } from '../../../shared/components/header/dialog-header/dialog-header.module';
import { SelectSalesOrgModule } from '../../../shared/components/select-sales-org/select-sales-org.module';
import { CreateManualCaseComponent } from './create-manual-case.component';

@NgModule({
  declarations: [CreateManualCaseComponent],
  imports: [
    AddEntryModule,
    CommonModule,
    SharedTranslocoModule,
    LoadingSpinnerModule,
    MatIconModule,
    MatButtonModule,
    ReactiveComponentModule,
    AutocompleteInputModule,
    InputTableModule,
    SelectSalesOrgModule,
    DialogHeaderModule,
  ],
  exports: [CreateManualCaseComponent],
})
export class CreateManualCaseModule {}
