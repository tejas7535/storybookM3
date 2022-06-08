import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

import { PushModule } from '@ngrx/component';

import { AutocompleteSearchComponent } from './autocomplete-search.component';

@NgModule({
  declarations: [AutocompleteSearchComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    PushModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    MatIconModule,
  ],
  exports: [AutocompleteSearchComponent],
})
export class AutocompleteSearchModule {}
