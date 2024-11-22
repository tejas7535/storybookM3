import {
  Component,
  effect,
  input,
  InputSignal,
  OnInit,
  signal,
  WritableSignal,
} from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatIcon } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { OptionsLoadingResult } from '../../../../services/selectable-options.service';
import { DisplayFunctions } from '../../display-functions.utils';
import { AbstractSingleAutocompleteComponent } from '../abstracts/abstract-single-autocomplete/abstract-single-autocomplete.component';
import {
  SelectableValue,
  SelectableValueUtils,
} from '../selectable-values.utils';

/**
 * The SingleAutocompletePreLoaded Component.
 *
 * "pre-loaded" means you need to pass the options.
 *
 * @export
 * @class SingleAutocompletePreLoadedComponent
 * @extends {AbstractSingleAutocompleteComponent}
 * @implements {OnInit}
 */
@Component({
  selector: 'd360-single-autocomplete-pre-loaded',
  standalone: true,
  imports: [
    MatAutocompleteModule,
    MatInputModule,
    ReactiveFormsModule,
    SharedTranslocoModule,
    MatIcon,
  ],
  templateUrl:
    './../abstracts/abstract-single-autocomplete/abstract-single-autocomplete.component.html',
  styleUrls: [
    './../abstracts/abstract-single-autocomplete/abstract-single-autocomplete.component.scss',
  ],
})
export class SingleAutocompletePreLoadedComponent
  extends AbstractSingleAutocompleteComponent
  implements OnInit
{
  /**
   * @override
   * @inheritdoc
   */
  protected isPreloaded = true;

  /**
   * @override
   * @inheritdoc
   */
  protected filteredOptions: WritableSignal<SelectableValue[]> = signal([]);

  /**
   * @override
   * @inheritdoc
   */
  public displayFn: InputSignal<(option?: SelectableValue) => string> = input(
    (option) => option?.text ?? ''
  );

  /**
   * All possible options wrapped in a OptionsLoadingResult object.
   *
   * @type {InputSignal<OptionsLoadingResult>}
   * @memberof SingleAutocompletePreLoadedComponent
   */
  public optionsLoadingResult: InputSignal<OptionsLoadingResult> =
    input.required<OptionsLoadingResult>();

  /**
   * All possible options.
   *
   * @private
   * @type {WritableSignal<SelectableValue[]>}
   * @memberof SingleAutocompletePreLoadedComponent
   */
  private readonly options: WritableSignal<SelectableValue[]> = signal<
    SelectableValue[]
  >([]);

  /**
   * Creates an instance of SingleAutocompletePreLoadedComponent.
   *
   * @memberof SingleAutocompletePreLoadedComponent
   */
  public constructor() {
    super();

    effect(
      () => {
        this.filteredOptions.set(
          this.inputValue()
            ? this.options().filter((option) =>
                DisplayFunctions.displayFnUnited(option)
                  .toLowerCase()
                  .includes(this.inputValue().toLowerCase())
              )
            : this.options()
        );
      },
      { allowSignalWrites: true }
    );

    effect(
      () => {
        if (this.optionsLoadingResult()) {
          this.extractOptions();
        }
      },
      { allowSignalWrites: true }
    );
  }

  /**
   * @override
   * @inheritdoc
   */
  public ngOnInit(): void {
    this.transformInputToSelectableValue();
    super.ngOnInit();
  }

  /**
   * Extract the passed options and update all signals.
   *
   * @private
   * @memberof SingleAutocompletePreLoadedComponent
   */
  private extractOptions(): void {
    const { options, loading, loadingError }: OptionsLoadingResult =
      this.optionsLoadingResult();

    this.options.set(options);
    this.loading.set(loading ?? false);
    this.loadingError.set(loadingError ?? null);
  }

  /**
   * Transforms the input to a selectable value.
   *
   * @private
   * @memberof SingleAutocompletePreLoadedComponent
   */
  private transformInputToSelectableValue(): void {
    if (typeof this.control().value === 'string') {
      const value = SelectableValueUtils.matchOptionIfPossible(
        this.control().getRawValue(),
        this.options()
      );

      if (value) {
        this.control().setValue(value);
      }
    }
  }
}
