import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { PushModule } from '@ngrx/component';

import { SearchAutocompleteModule } from '@schaeffler/search-autocomplete';
import { SharedTranslocoModule } from '@schaeffler/transloco';

import { QuickBearingSelectionComponent } from './quick-bearing-selection.component';

@NgModule({
  declarations: [QuickBearingSelectionComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    PushModule,

    // Transloco
    SharedTranslocoModule,

    // Schaeffler Libs
    SearchAutocompleteModule,
  ],
  exports: [QuickBearingSelectionComponent],
})
export class QuickBearingSelectionModule {}
