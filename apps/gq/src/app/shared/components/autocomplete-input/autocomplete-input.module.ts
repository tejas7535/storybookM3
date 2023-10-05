import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyAutocompleteModule as MatAutocompleteModule } from '@angular/material/legacy-autocomplete';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { MatLegacyProgressSpinnerModule as MatProgressSpinnerModule } from '@angular/material/legacy-progress-spinner';
import { MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select';

import { SharedDirectivesModule } from '@gq/shared/directives/shared-directives.module';
import { TRANSLOCO_SCOPE } from '@ngneat/transloco';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { AutocompleteInputComponent } from './autocomplete-input.component';
import { NoResultsFoundPipe } from './pipes/no-results-found.pipe';

@NgModule({
  declarations: [AutocompleteInputComponent, NoResultsFoundPipe],
  imports: [
    CommonModule,
    MatAutocompleteModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
    ReactiveFormsModule,
    MatProgressSpinnerModule,
    SharedTranslocoModule,
    SharedDirectivesModule,
  ],
  providers: [
    {
      provide: TRANSLOCO_SCOPE,
      useValue: 'case-view',
    },
  ],
  exports: [AutocompleteInputComponent],
})
export class AutocompleteInputModule {}
