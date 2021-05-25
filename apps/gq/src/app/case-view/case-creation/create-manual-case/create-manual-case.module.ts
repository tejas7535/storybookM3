import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

import { ReactiveComponentModule } from '@ngrx/component';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { AutocompleteInputModule } from '../../../shared/autocomplete-input/autocomplete-input.module';
import { AddEntryModule } from '../../../shared/case-material/add-entry/add-entry.module';
import { InputTableModule } from '../../../shared/case-material/input-table/input-table.module';
import { LoadingSpinnerModule } from '../../../shared/loading-spinner/loading-spinner.module';
import { SelectSalesOrgModule } from '../../../shared/select-sales-org/select-sales-org.module';
import { CreateManualCaseComponent } from './create-manual-case.component';

@NgModule({
  declarations: [CreateManualCaseComponent],
  imports: [
    AddEntryModule,
    CommonModule,
    MatIconModule,
    SharedTranslocoModule,
    LoadingSpinnerModule,
    ReactiveComponentModule,
    AutocompleteInputModule,
    InputTableModule,
    SelectSalesOrgModule,
  ],
  exports: [CreateManualCaseComponent],
})
export class CreateManualCaseModule {}
