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
import { Keyboard } from '@gq/shared/models/keyboard.enum';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { BaseAutocompleteInputComponent } from '../base-autocomplete-input.component';
import { FilterNames } from '../filter-names.enum';
import { MaterialAutocompleteUtilsService } from '../material-autocomplete-utils.service';
import { NoResultsFoundPipe } from '../pipes/no-results-found.pipe';

@Component({
  selector: 'gq-material-number-autocomplete-input',
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
      useExisting: forwardRef(() => MaterialNumberAutoCompleteInputComponent),
      multi: true,
    },
  ],
})
export class MaterialNumberAutoCompleteInputComponent extends BaseAutocompleteInputComponent {
  materialAutocompleteUtils = inject(MaterialAutocompleteUtilsService);

  constructor() {
    super(FilterNames.MATERIAL_NUMBER);
  }

  override onPaste(event: ClipboardEvent): void {
    event.preventDefault();
    const data = this.formatMaterialNumber(event.clipboardData.getData('text'));

    this.formControl.setValue(this.sliceMaterialString(data));
  }

  protected override shouldEmitAutocomplete(value: string): boolean {
    this.materialAutocompleteUtils.emitIsValidOnFormInput(
      value,
      this.isValid,
      this.formControl
    );

    return super.shouldEmitAutocomplete(value);
  }

  private formatMaterialNumber(inputNumber: string): string {
    return (
      inputNumber
        .split(Keyboard.DASH) // remove dashes
        .join('')
        /**
         * Regex checks for two groups:
         * 1st: until 9th character
         * 2nd: the four characters after
         * when replacing:
         * check the string length to insert '-' separator only if string is long enough
         */
        .replaceAll(
          /^(.{9})(.{0,4})/g,
          `$1-$2${inputNumber.length <= 13 ? '' : Keyboard.DASH}`
        )
    );
  }

  private sliceMaterialString(text: string): string {
    // 17 equals max string length with dashes
    return text.slice(0, 17);
  }
}
