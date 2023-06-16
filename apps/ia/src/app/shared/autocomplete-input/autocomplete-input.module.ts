import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatLegacyAutocompleteModule as MatAutocompleteModule } from '@angular/material/legacy-autocomplete';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { MatLegacyProgressSpinnerModule as MatProgressSpinnerModule } from '@angular/material/legacy-progress-spinner';
import { MatLegacyTooltipModule as MatTooltipModule } from '@angular/material/legacy-tooltip';

import { AutocompleteInputComponent } from './autocomplete-input.component';

@NgModule({
  declarations: [AutocompleteInputComponent],
  imports: [
    CommonModule,
    FormsModule,
    MatAutocompleteModule,
    MatInputModule,
    ReactiveFormsModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
  ],
  exports: [AutocompleteInputComponent],
})
export class AutocompleteInputModule {}
