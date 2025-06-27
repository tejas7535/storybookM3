import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, forwardRef, inject } from '@angular/core';
import {
  AbstractControl,
  FormsModule,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
  ValidationErrors,
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
import { MaterialAutocompleteUtilsService } from '../material-autocomplete-utils.service';
import { NoResultsFoundPipe } from '../pipes/no-results-found.pipe';

@Component({
  selector: 'gq-customer-material-autocomplete-input',
  templateUrl: '../base-autocomplete-input.component.html',
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
  standalone: true,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CustomerMaterialAutoCompleteInputComponent),
      multi: true,
    },
  ],
})
export class CustomerMaterialAutoCompleteInputComponent
  extends BaseAutocompleteInputComponent
  implements AfterViewInit
{
  materialAutocompleteUtils = inject(MaterialAutocompleteUtilsService);

  constructor() {
    super(FilterNames.CUSTOMER_MATERIAL);
  }

  protected override shouldEmitAutocomplete(value: string): boolean {
    this.materialAutocompleteUtils.emitIsValidOnFormInput(
      value,
      this.isValid,
      this.formControl
    );

    if (!this.isAutocompleteSearchDisabled()) {
      // do not show autocomplete options if no character is entered or one character is entered
      if (!value) {
        this.autocompleteOptions = [];
      } else if (value.length === 1) {
        // one character as custom input is allowed for customer materials
        this.inputContent.emit(true);
        this.autocompleteOptions = [];
      }
    }

    return super.shouldEmitAutocomplete(value);
  }

  protected override isInputValid(control: AbstractControl): ValidationErrors {
    const formValue = this.extractFormValue(control.value);
    const isValid = this.validateFormValue(formValue);

    if (!isValid && !this.isAutocompleteSearchDisabled()) {
      this.unselect();
    }

    return undefined;
  }

  protected override onOptionsChange(
    previousOptions: IdValue[],
    options: IdValue[]
  ): void {
    const selected = options.find((it: IdValue) => it.selected);
    this.autocompleteOptions = options.filter((it: IdValue) => it.id !== null);

    // if provided options do not fit to the form value, a few scenarions need to be checked
    if (this.isFormValueMismatched(selected)) {
      if (this.isMatchingCurrentSelection(selected)) {
        // if no previous options but still a custom form control value is set, we want to show the user the original options (e.g. for editing)
        if (previousOptions.length === 0) {
          this.autocompleteOptions = options.filter((opt) => opt.id !== null);
        } else if (this.onlyUnselectedAndUnmatchedOptionsAvailable(options)) {
          // if no option is selected and and the entered value does not match, then we need to clear the invalid options
          this.autocompleteOptions = [];
        }

        // if selected id value matches the currently active selectedIdValue we do not update the form control value and return
        return;
      } else {
        // if we either do not have a selected option or the selectedIdValue does not match, we clear the options in case they do not fit to the entered value
        const shouldReset = this.autocompleteOptions.some(
          (option) =>
            !option.id
              .toLowerCase()
              .startsWith(this.formControl.value.toLowerCase()) &&
            !option.selected
        );
        this.autocompleteOptions = shouldReset ? [] : this.autocompleteOptions;
      }
    }

    this.selectedIdValue = selected;

    if (this.selectedIdValue) {
      this.debounceIsActive = true;
      this.setFormControlValue();
    }
  }

  private isFormValueMismatched(selected: IdValue | undefined): boolean {
    return (
      this.formControl.value &&
      typeof this.formControl.value === 'string' &&
      !selected?.id
        ?.toLowerCase()
        .startsWith(this.formControl.value.toLowerCase())
    );
  }

  private isMatchingCurrentSelection(selected: IdValue | undefined): boolean {
    return (
      !selected ||
      (selected.value === this.selectedIdValue?.value &&
        selected.value2 === this.selectedIdValue?.value2 &&
        selected.id === this.selectedIdValue?.id)
    );
  }

  private onlyUnselectedAndUnmatchedOptionsAvailable(
    options: IdValue[]
  ): boolean {
    return (
      options.every((opt) => !opt.selected) &&
      this.autocompleteOptions.some(
        (opt) =>
          !opt.id.toLowerCase().startsWith(this.formControl.value.toLowerCase())
      )
    );
  }
}
