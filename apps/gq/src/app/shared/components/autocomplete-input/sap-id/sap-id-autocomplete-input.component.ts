import { CommonModule } from '@angular/common';
import { Component, forwardRef, inject } from '@angular/core';
import {
  FormsModule,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';

import { SharedDirectivesModule } from '@gq/shared/directives/shared-directives.module';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { BaseAutocompleteInputComponent } from '../base-autocomplete-input.component';
import { FilterNames } from '../filter-names.enum';
import { MaterialAutocompleteUtilsService } from '../material-autocomplete-utils.service';
import { NoResultsFoundPipe } from '../pipes/no-results-found.pipe';

@Component({
  selector: 'gq-sap-id-autocomplete-input',
  templateUrl: '../base-autocomplete-input.component.html',
  standalone: true,
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
    NoResultsFoundPipe,
    FormsModule,
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SapIdAutoCompleteInputComponent),
      multi: true,
    },
  ],
})
export class SapIdAutoCompleteInputComponent extends BaseAutocompleteInputComponent {
  materialAutocompleteUtils = inject(MaterialAutocompleteUtilsService);

  constructor() {
    super(FilterNames.SAP_QUOTATION);
  }
}
