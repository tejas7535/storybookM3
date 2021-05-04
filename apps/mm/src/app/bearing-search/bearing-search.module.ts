import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { ReactiveComponentModule } from '@ngrx/component';

import { SearchAutocompleteModule } from '@schaeffler/search-autocomplete';

import { BearingSearchComponent } from './bearing-search.component';

@NgModule({
  declarations: [BearingSearchComponent],
  imports: [
    CommonModule,

    // NGRX
    ReactiveComponentModule,

    // Forms
    ReactiveFormsModule,

    SearchAutocompleteModule,
  ],
  exports: [BearingSearchComponent],
})
export class BearingSearchModule {}
