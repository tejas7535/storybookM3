import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { LetModule, PushModule } from '@ngrx/component';

import { SearchAutocompleteModule } from '@schaeffler/search-autocomplete';
import { SharedTranslocoModule } from '@schaeffler/transloco';

import { QuickBearingSelectionComponent } from './quick-bearing-selection.component';

@NgModule({
  declarations: [QuickBearingSelectionComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    PushModule,
    LetModule,

    // Transloco
    SharedTranslocoModule,

    // Material
    MatButtonModule,
    MatProgressSpinnerModule,

    // Schaeffler Libs
    SearchAutocompleteModule,
  ],
  exports: [QuickBearingSelectionComponent],
})
export class QuickBearingSelectionModule {}
