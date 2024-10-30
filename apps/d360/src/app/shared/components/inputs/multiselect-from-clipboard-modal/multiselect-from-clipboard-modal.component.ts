import {
  Component,
  DestroyRef,
  Inject,
  inject,
  signal,
  WritableSignal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

import { delay, finalize, Observable, take } from 'rxjs';

import { TranslocoDirective } from '@jsverse/transloco';

import { LoadingSpinnerModule } from '@schaeffler/loading-spinner';

import { OptionsLoadingResult } from '../../../services/selectable-options.service';
import { deduplicateArray } from '../../../utils/array';
import { MultiAutocompleteOnTypeComponent } from '../autocomplete/multi-autocomplete-on-type/multi-autocomplete-on-type.component';
import { MultiAutocompletePreLoadedComponent } from '../autocomplete/multi-autocomplete-pre-loaded/multi-autocomplete-pre-loaded.component';
import {
  ResolveSelectableValueResult,
  SelectableValue,
} from '../autocomplete/selectable-values.utils';
import { DisplayFunction } from '../display-functions.utils';

/**
 * Internal Interface for the ClipboardDialogData.
 *
 * @interface ClipboardDialogData
 */
interface ClipboardDialogData {
  control: FormControl;
  searchControl: FormControl;
  form: FormGroup;
  selectableValuesByKeys: (
    value: string[]
  ) => Observable<ResolveSelectableValueResult[]>;
  entityName?: string;
  entityNamePlural?: string;
  autocompleteLabel: string;
  getOptionLabelInTag: DisplayFunction;
  optionsLoadingResults?: OptionsLoadingResult;
  getOptionLabel: DisplayFunction;
  urlBegin: string;
}

/**
 * Internal Interface for the ClipboardErrors.
 *
 * @interface ClipboardErrors
 */
interface ClipboardErrors {
  messages: string[];
  ignoredValues: string[];
}

/**
 * The MultiselectFromClipboardModal Component.
 *
 * @export
 * @class MultiselectFromClipboardModalComponent
 */
@Component({
  selector: 'app-multiselect-from-clipboard-modal',
  standalone: true,
  imports: [
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    TranslocoDirective,
    ReactiveFormsModule,
    MultiAutocompleteOnTypeComponent,
    MultiAutocompletePreLoadedComponent,
    LoadingSpinnerModule,
  ],
  templateUrl: './multiselect-from-clipboard-modal.component.html',
  styleUrls: ['./multiselect-from-clipboard-modal.component.scss'],
})
export class MultiselectFromClipboardModalComponent {
  /**
   * The current loading state.
   *
   * @protected
   * @type {WritableSignal<boolean>}
   * @memberof MultiselectFromClipboardModalComponent
   */
  protected loading: WritableSignal<boolean> = signal(false);

  /**
   * The current existing clipboard validation / loading errors.
   *
   * @protected
   * @type {WritableSignal<ClipboardErrors>}
   * @memberof MultiselectFromClipboardModalComponent
   */
  protected clipboardErrors: WritableSignal<ClipboardErrors> =
    signal<ClipboardErrors>({
      messages: [],
      ignoredValues: [],
    });

  /**
   * The DestroyRef instance used for takeUntilDestroyed().
   *
   * @private
   * @type {DestroyRef}
   * @memberof MultiselectFromClipboardModalComponent
   */
  private readonly destroyRef: DestroyRef = inject(DestroyRef);

  /**
   * This is a pseudo FormControl to hold the unsaved data.
   *
   * @type {FormControl}
   * @memberof MultiselectFromClipboardModalComponent
   */
  public unsavedValues: FormControl;

  /**
   * Creates an instance of MultiselectFromClipboardModalComponent.
   *
   * @param {ClipboardDialogData} data
   * @memberof MultiselectFromClipboardModalComponent
   */
  public constructor(
    @Inject(MAT_DIALOG_DATA) public data: ClipboardDialogData
  ) {
    // init unsaved values with the values of the given form control.
    this.unsavedValues = new FormControl([...this.data.control.value]);
  }

  /**
   * The paste from clipboard logic.
   *
   * @protected
   * @return {Promise<void>}
   * @memberof MultiselectFromClipboardModalComponent
   */
  protected async pasteFromClipboard(): Promise<void> {
    // set loading spinner
    this.loading.set(true);

    try {
      // read the clipboard and remove duplicate entries
      const clipText = await navigator.clipboard.readText();
      const clipValues = deduplicateArray(
        clipText
          .split(/[\t\n\r]+/)
          .map((val) => val.trim())
          .filter(Boolean) || []
      );

      // try to find the values in the db or in the passed options.
      this.data
        .selectableValuesByKeys(clipValues)
        .pipe(
          take(1),
          delay(100),
          finalize(() => this.loading.set(false)),
          takeUntilDestroyed(this.destroyRef)
        )
        .subscribe((results) => {
          // get the valid values
          const validValues: ResolveSelectableValueResult[] = results
            .filter((entry) => entry?.selectableValue != null)
            .map((entry) => entry?.selectableValue);

          // get the validation errors
          const errors: ResolveSelectableValueResult[] = results.filter(
            (entry) => entry?.error
          );

          // set the found errors the the clipboard errors...
          this.clipboardErrors.set({
            // ... and remove duplicate entries
            messages: deduplicateArray(
              errors.flatMap((entry) => entry.error ?? [])
            ),
            // set ignored values (not found values)
            ignoredValues: errors.map((entry) => entry.id),
          });

          // set the found values in our pseudo form control...
          if (validValues.length > 0) {
            this.unsavedValues.setValue(
              // ... and remove duplicate entries
              this.deduplicateSelectableValues([
                ...this.unsavedValues.getRawValue(),
                ...validValues,
              ]) ?? []
            );
          }
        });
    } catch (error) {
      console.error(error);
      // finally hide the loader again
      this.loading.set(false);
    }
  }

  /**
   * Clear the clipboard errors.
   *
   * @private
   * @memberof MultiselectFromClipboardModalComponent
   */
  private clearErrors(): void {
    this.clipboardErrors.set({ messages: [], ignoredValues: [] });
  }

  /**
   * Reset the current selected values in our pseudo form control.
   *
   * @protected
   * @memberof MultiselectFromClipboardModalComponent
   */
  protected resetSelection(): void {
    this.clearErrors();
    this.unsavedValues.reset();
    this.unsavedValues.setValue([]);
  }

  /**
   * Set the selected values (pseudo control) in the real form control.
   *
   * @protected
   * @memberof MultiselectFromClipboardModalComponent
   */
  protected applySelection(): void {
    this.data.control.setValue(this.unsavedValues.value);
    this.clearErrors();
  }

  /**
   * Remove duplicate entries, based on the id.
   *
   * @private
   * @param {SelectableValue[]} values
   * @return {SelectableValue[]}
   * @memberof MultiselectFromClipboardModalComponent
   */
  private deduplicateSelectableValues(
    values: SelectableValue[]
  ): SelectableValue[] {
    const deduped: SelectableValue[] = [];

    values.forEach(
      (val) => !deduped.some((v) => v.id === val.id) && deduped.push(val)
    );

    return deduped;
  }
}
