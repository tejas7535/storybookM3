import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

import { ReactiveComponentModule } from '@ngrx/component';

import { AutocompleteSearchComponent } from './autocomplete-search.component';

@NgModule({
  declarations: [AutocompleteSearchComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    MatIconModule,
    ReactiveComponentModule,
  ],
  exports: [AutocompleteSearchComponent],
})
export class AutocompleteSearchModule {}
