import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';

import { PushModule } from '@ngrx/component';

import { LoadingSpinnerModule } from '@schaeffler/loading-spinner';
import { SharedTranslocoModule } from '@schaeffler/transloco';

import { AutocompleteInputModule } from '../../../shared/components/autocomplete-input/autocomplete-input.module';
import { DialogHeaderModule } from '../../../shared/components/header/dialog-header/dialog-header.module';
import { ImportCaseComponent } from './import-case.component';

@NgModule({
  declarations: [ImportCaseComponent],
  imports: [
    CommonModule,
    SharedTranslocoModule,
    AutocompleteInputModule,
    PushModule,
    MatButtonModule,
    LoadingSpinnerModule,
    DialogHeaderModule,
    MatCheckboxModule,
  ],
  exports: [ImportCaseComponent],
})
export class ImportCaseModule {}
