import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';

import { SharedDirectivesModule } from '@gq/shared/directives/shared-directives.module';
import { TRANSLOCO_SCOPE } from '@jsverse/transloco';

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
