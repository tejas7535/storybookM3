import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SearchAutocompleteModule } from '@schaeffler/search-autocomplete';

import { SharedModule } from './../../shared/shared.module';
import { BearingSearchComponent } from './bearing-search.component';

@NgModule({
  declarations: [BearingSearchComponent],
  imports: [CommonModule, SharedModule, SearchAutocompleteModule],
  exports: [BearingSearchComponent],
})
export class BearingSearchModule {}
