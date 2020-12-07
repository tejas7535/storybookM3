import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

import { SharedTranslocoModule } from '@schaeffler/transloco';
import { AutocompleteInputModule } from '../../../case-view/create-case-dialog/autocomplete-input/autocomplete-input.module';

import { SharedModule } from '../../../shared';
import { AddEntryComponent } from './add-entry.component';

@NgModule({
  declarations: [AddEntryComponent],
  imports: [
    AutocompleteInputModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    SharedTranslocoModule,
    SharedModule,
    ReactiveFormsModule,
  ],
  exports: [AddEntryComponent],
})
export class AddEntryModule {}
