import {
  Component,
  effect,
  input,
  InputSignal,
  OnInit,
  Signal,
  signal,
  viewChildren,
  WritableSignal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ReactiveFormsModule } from '@angular/forms';
import {
  MatAutocompleteModule,
  MatOption,
} from '@angular/material/autocomplete';
import { MatIcon } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

import { Observable, of, take, tap } from 'rxjs';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { OptionsLoadingResult } from '../../../../services/selectable-options.service';
import { isEqual } from '../../../../utils/validation/data-validation';
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
   * A temp variable to check, if a result has changes or not.
   *
   * @private
   * @type {OptionsLoadingResult}
   * @memberof SingleAutocompletePreLoadedComponent
   */
  private tempOptionsLoadingResult: OptionsLoadingResult = { options: [] };

  /**
   * The current available MatOptions.
   *
   * @private
   * @type {Signal<readonly}
   * @memberof SingleAutocompletePreLoadedComponent
   */
  private readonly htmlOptions: Signal<readonly MatOption[]> =
    viewChildren(MatOption);

  /**
   * Creates an instance of SingleAutocompletePreLoadedComponent.
   *
   * @memberof SingleAutocompletePreLoadedComponent
   */
  public constructor() {
    super();

    effect(() => {
      const newOptions = this.optionsLoadingResult();
      if (
        (this.tempOptionsLoadingResult.options.length === 0 &&
          newOptions.options.length > 0) ||
        !isEqual(this.tempOptionsLoadingResult.options, newOptions.options)
      ) {
        this.tempOptionsLoadingResult = newOptions;
        this.extractOptions();

        return;
      }

      this.fixSelectedOption();
    });
  }

  /**
   * @override
   * @inheritdoc
   */
  public ngOnInit(): void {
    this.transformInputToSelectableValue();
    super.ngOnInit();
  }

  /** @inheritdoc */
  protected onSearchControlChange$(searchString: string): Observable<boolean> {
    this.filteredOptions.set(
      searchString
        ? this.options().filter((option) =>
            DisplayFunctions.displayFnUnited(option)
              .toLowerCase()
              .includes(searchString.toLowerCase())
          )
        : this.options()
    );

    return of(true);
  }

  /**
   * This method sets the current MatOption as selected.
   *
   * @private
   * @memberof SingleAutocompletePreLoadedComponent
   */
  private fixSelectedOption(): void {
    this.htmlOptions().forEach(
      (option: MatOption) =>
        !!option.value?.id &&
        !!this.getTypedValue()?.id &&
        option.value?.id === this.getTypedValue()?.id &&
        option.select(true)
    );
  }

  /**
   * Extract the passed options and update all signals.
   *
   * @private
   * @memberof SingleAutocompletePreLoadedComponent
   */
  private extractOptions(): void {
    const { options, loading, loadingError }: OptionsLoadingResult =
      this.optionsLoadingResult() || { options: [] };

    this.options.set(options);
    this.loading.set(loading ?? false);
    this.loadingError.set(loadingError ?? null);

    this.resetOptions();
  }

  /** @inheritdoc */
  protected resetOptions(): void {
    this.onSearchControlChange$('')
      .pipe(
        take(1),
        tap(() => this.fixSelectedOption()),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe();
  }

  /** @inheritdoc */
  protected onOptionSelected(): void {
    if (SelectableValueUtils.isSelectableValue(this.getTypedValue())) {
      this.onSelectionChange.emit({ option: this.getTypedValue() });
      this.value = this.getTypedValue();

      this.filteredOptions.set(this.options());
    }
  }

  /**
   * Transforms the input to a selectable value.
   *
   * @private
   * @memberof SingleAutocompletePreLoadedComponent
   */
  private transformInputToSelectableValue(): void {
    if (typeof this.control().getRawValue() === 'string') {
      const value = SelectableValueUtils.matchOptionIfPossible(
        this.control().getRawValue(),
        this.options()
      );

      if (value) {
        this.control().setValue(value);
        this.value = this.getTypedValue();
      }
    }
  }
}
