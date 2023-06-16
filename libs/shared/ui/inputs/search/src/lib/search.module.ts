import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyAutocompleteModule as MatAutocompleteModule } from '@angular/material/legacy-autocomplete';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';

import { TranslocoModule } from '@ngneat/transloco';

import { SearchComponent } from './search.component';

@NgModule({
  declarations: [SearchComponent],
  imports: [
    CommonModule,
    TranslocoModule,
    MatAutocompleteModule,
    ReactiveFormsModule.withConfig({
      callSetDisabledState: 'whenDisabledForLegacyCode',
    }),
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
  ],
  exports: [SearchComponent],
})
export class SearchModule {}
