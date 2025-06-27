import { CommonModule } from '@angular/common';
import { Component, forwardRef } from '@angular/core';
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
import { IdValue } from '@gq/shared/models/search/id-value.model';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { BaseAutocompleteInputComponent } from '../base-autocomplete-input.component';
import { FilterNames } from '../filter-names.enum';
import { NoResultsFoundPipe } from '../pipes/no-results-found.pipe';

@Component({
  selector: 'gq-customer-autocomplete-input',
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
      useExisting: forwardRef(() => CustomerAutoCompleteInputComponent),
      multi: true,
    },
  ],
})
export class CustomerAutoCompleteInputComponent extends BaseAutocompleteInputComponent {
  constructor() {
    super(FilterNames.CUSTOMER);
  }

  protected override transformFormValue(idValue: IdValue): string {
    if (!idValue.id) {
      return idValue.id;
    }

    let string = `${idValue.id}`;

    if (idValue.value) {
      string += ` | ${idValue.value}`;
    }

    if (idValue.value2) {
      string += ` | ${idValue.value2}`;
    }

    return string;
  }

  protected override shouldEmitAutocomplete(value: string): boolean {
    // when customer search contains the pipe no autocomplete is to be triggered
    const customerSearchContainsPipe = value?.includes?.('|');

    return !customerSearchContainsPipe && value && typeof value === 'string';
  }

  protected override onOptionsChange(
    _previousOptions: IdValue[],
    options: IdValue[]
  ): void {
    this.selectedIdValue = options.find((it: IdValue) => it.selected);
    this.autocompleteOptions = options.filter(
      (it: IdValue) => !it.selected && it.id !== null
    );

    if (this.shouldAutoSelectSingleUnselectedOption(options.length === 1)) {
      this.selectedIdValue = this.autocompleteOptions[0];
      this.autocompleteOptions = [];
      this.added.emit(this.selectedIdValue);
    }

    if (this.selectedIdValue) {
      this.debounceIsActive = true;
      super.setFormControlValue();
    }
  }

  private shouldAutoSelectSingleUnselectedOption(
    isOnlyOneOptionAvl: boolean
  ): boolean {
    return this.autocompleteOptions.length === 1 && isOnlyOneOptionAvl;
  }
}
