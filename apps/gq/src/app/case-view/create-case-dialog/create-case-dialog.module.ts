import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { SharedModule } from '../../shared';
import { AddEntryModule } from './add-entry/add-entry.module';
import { AutocompleteInputModule } from './autocomplete-input/autocomplete-input.module';
import { CreateCaseDialogComponent } from './create-case-dialog.component';
import { InputTableModule } from './input-table/input-table.module';

@NgModule({
  declarations: [CreateCaseDialogComponent],
  imports: [
    AddEntryModule,
    AutocompleteInputModule,
    InputTableModule,
    MatButtonModule,
    MatCardModule,
    MatInputModule,
    SharedModule,
    SharedTranslocoModule,
  ],
  exports: [CreateCaseDialogComponent],
})
export class CreateCaseDialogModule {}
