import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { AutocompleteInputModule } from './autocomplete-input/autocomplete-input.module';
import { CreateCaseDialogComponent } from './create-case-dialog.component';

@NgModule({
  declarations: [CreateCaseDialogComponent],
  imports: [
    CommonModule,
    SharedTranslocoModule,
    AutocompleteInputModule,
    FlexLayoutModule,
    MatButtonModule,
    MatCardModule,
  ],
  exports: [CreateCaseDialogComponent],
})
export class CreateCaseDialogModule {}
