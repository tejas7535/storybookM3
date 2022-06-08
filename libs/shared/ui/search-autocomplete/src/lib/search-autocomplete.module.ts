import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { PushModule } from '@ngrx/component';

import { SearchAutocompleteComponent } from './search-autocomplete/search-autocomplete.component';

@NgModule({
  imports: [
    CommonModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    MatProgressSpinnerModule,
    MatFormFieldModule,
    MatInputModule,
    PushModule,
    MatIconModule,
  ],
  declarations: [SearchAutocompleteComponent],
  exports: [SearchAutocompleteComponent],
})
export class SearchAutocompleteModule {}
