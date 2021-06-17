import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';

import { ReactiveComponentModule } from '@ngrx/component';

import { LoadingSpinnerModule } from '@schaeffler/loading-spinner';
import { SharedTranslocoModule } from '@schaeffler/transloco';

import { AutocompleteInputModule } from '../../../shared/autocomplete-input/autocomplete-input.module';
import { DialogHeaderModule } from '../../../shared/header/dialog-header/dialog-header.module';
import { ImportCaseComponent } from './import-case.component';

@NgModule({
  declarations: [ImportCaseComponent],
  imports: [
    CommonModule,
    SharedTranslocoModule,
    AutocompleteInputModule,
    ReactiveComponentModule,
    MatButtonModule,
    LoadingSpinnerModule,
    DialogHeaderModule,
    MatCheckboxModule,
  ],
  exports: [ImportCaseComponent],
})
export class ImportCaseModule {}
