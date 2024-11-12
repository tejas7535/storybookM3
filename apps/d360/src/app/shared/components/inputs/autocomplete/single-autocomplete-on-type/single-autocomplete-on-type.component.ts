import {
  Component,
  effect,
  inject,
  input,
  InputSignal,
  OnInit,
  signal,
  WritableSignal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatIcon } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

import { catchError, finalize, tap } from 'rxjs/operators';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { SelectableOptionsService } from '../../../../services/selectable-options.service';
import { AbstractSingleAutocompleteComponent } from '../abstracts/abstract-single-autocomplete/abstract-single-autocomplete.component';
import {
  SelectableValue,
  SelectableValueUtils,
} from '../selectable-values.utils';

/**
 * The SingleAutocompleteOnType Component.
 *
 * "on-type" means you need to pass the URL to load the data.
 *
 * @export
 * @class SingleAutocompleteOnTypeComponent
 * @extends {AbstractSingleAutocompleteComponent}
 * @implements {OnInit}
 */
@Component({
  selector: 'd360-single-autocomplete-on-type',
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
export class SingleAutocompleteOnTypeComponent
  extends AbstractSingleAutocompleteComponent
  implements OnInit
{
  /**
   * @override
   * @inheritdoc
   */
  protected isPreloaded = false;

  /**
   * @override
   * @inheritdoc
   */
  protected filteredOptions: WritableSignal<SelectableValue[]> = signal<
    SelectableValue[]
  >([]);

  /**
   * @override
   * @inheritdoc
   */
  public displayFn: InputSignal<(option: SelectableValue | string) => string> =
    input((option) =>
      SelectableValueUtils.isSelectableValue(option)
        ? option?.text ?? ''
        : option
    );

  /**
   * This is the url to be used for loading all possible options.
   *
   * @type {InputSignal<string>}
   * @memberof SingleAutocompleteOnTypeComponent
   */
  public urlBegin: InputSignal<string> = input.required<string>();

  /**
   * The instance of SelectableOptionsService.
   *
   * @private
   * @type {SelectableOptionsService}
   * @memberof SingleAutocompleteOnTypeComponent
   */
  private readonly selectableOptionsService: SelectableOptionsService = inject(
    SelectableOptionsService
  );

  /**
   * Creates an instance of SingleAutocompleteOnTypeComponent.
   *
   * @memberof SingleAutocompleteOnTypeComponent
   */
  public constructor() {
    super();
    effect(() => this.fetchOptions(this.inputValue()));
  }

  /**
   * @override
   * @inheritdoc
   */
  public ngOnInit(): void {
    if (!SelectableValueUtils.isSelectableValue(this.control().value)) {
      this.fetchOptions(this.control().value as string, true);
    }

    super.ngOnInit();
  }

  /**
   * Fetch the options by a passed search string and set the first found value.
   *
   * @private
   * @param {string} searchString
   * @param {boolean} [setFormControlValue=false]
   * @memberof SingleAutocompleteOnTypeComponent
   */
  private fetchOptions(
    searchString: string,
    setFormControlValue: boolean = false
  ): void {
    if (searchString) {
      this.selectableOptionsService
        .getOptionsBySearchTerm(this.urlBegin(), searchString)
        .pipe(
          catchError((error) => {
            this.loadingError.set(error);

            return [];
          }),
          tap((data) => {
            this.filteredOptions.set([...(data as SelectableValue[])]);

            if (setFormControlValue) {
              this.control().setValue(this.filteredOptions()[0]);
            }
          }),
          finalize(() => this.loading.set(false)),
          takeUntilDestroyed(this.destroyRef)
        )
        .subscribe();
    }
  }
}
