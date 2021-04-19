import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';

import { ReactiveComponentModule } from '@ngrx/component';

import { BearingSearchComponent } from './bearing-search.component';

@NgModule({
  declarations: [BearingSearchComponent],
  imports: [
    CommonModule,

    // NGRX
    ReactiveComponentModule,

    // Forms
    ReactiveFormsModule,

    // Angular Material
    MatAutocompleteModule,
    MatInputModule,
  ],
  exports: [BearingSearchComponent],
})
export class BearingSearchModule {}
