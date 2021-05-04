import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { ReactiveComponentModule } from '@ngrx/component';
import { SearchAutocompleteComponent } from './search-autocomplete/search-autocomplete.component';

@NgModule({
  imports: [
    CommonModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    MatProgressSpinnerModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveComponentModule,
    MatIconModule,
  ],
  declarations: [SearchAutocompleteComponent],
  exports: [SearchAutocompleteComponent],
})
export class SearchAutocompleteModule {}
