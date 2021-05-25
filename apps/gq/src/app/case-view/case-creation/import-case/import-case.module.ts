import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { ReactiveComponentModule } from '@ngrx/component';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { AutocompleteInputModule } from '../../../shared/autocomplete-input/autocomplete-input.module';
import { LoadingSpinnerModule } from '../../../shared/loading-spinner/loading-spinner.module';
import { ImportCaseComponent } from './import-case.component';

@NgModule({
  declarations: [ImportCaseComponent],
  imports: [
    CommonModule,
    SharedTranslocoModule,
    MatIconModule,
    AutocompleteInputModule,
    ReactiveComponentModule,
    MatButtonModule,
    LoadingSpinnerModule,
  ],
  exports: [ImportCaseComponent],
})
export class ImportCaseModule {}
