import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';

import { AutocompleteInputModule } from '@gq/shared/components/autocomplete-input/autocomplete-input.module';
import { DialogHeaderModule } from '@gq/shared/components/header/dialog-header/dialog-header.module';
import { PushPipe } from '@ngrx/component';

import { LoadingSpinnerModule } from '@schaeffler/loading-spinner';
import { SharedTranslocoModule } from '@schaeffler/transloco';

import { ImportCaseComponent } from './import-case.component';

@NgModule({
  declarations: [ImportCaseComponent],
  imports: [
    CommonModule,
    SharedTranslocoModule,
    AutocompleteInputModule,
    PushPipe,
    MatButtonModule,
    LoadingSpinnerModule,
    DialogHeaderModule,
  ],
  exports: [ImportCaseComponent],
})
export class ImportCaseModule {}
