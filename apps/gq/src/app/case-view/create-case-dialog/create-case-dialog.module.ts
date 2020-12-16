import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { SharedModule } from '../../shared';
import { AutocompleteInputModule } from '../../shared/autocomplete-input/autocomplete-input.module';
import { AddEntryModule } from '../../shared/case-material/add-entry/add-entry.module';
import { InputTableModule } from '../../shared/case-material/input-table/input-table.module';
import { CreateCaseDialogComponent } from './create-case-dialog.component';

@NgModule({
  declarations: [CreateCaseDialogComponent],
  imports: [
    AddEntryModule,
    AutocompleteInputModule,
    InputTableModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatInputModule,
    SharedModule,
    SharedTranslocoModule,
  ],
  exports: [CreateCaseDialogComponent],
})
export class CreateCaseDialogModule {}
