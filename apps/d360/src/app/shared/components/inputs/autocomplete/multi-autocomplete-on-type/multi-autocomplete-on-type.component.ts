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
import { MatChipsModule } from '@angular/material/chips';
import { MatIcon } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

import { catchError, finalize, tap } from 'rxjs';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { SelectableOptionsService } from '../../../../services/selectable-options.service';
import { AbstractMultiAutocompleteComponent } from '../abstracts/abstract-multi-autocomplete/abstract-multi-autocomplete.component';
import {
  SelectableValue,
  SelectableValueUtils,
} from '../selectable-values.utils';

/**
 * The MultiAutocompleteOnType Component.
 *
 * @export
 * @class MultiAutocompleteOnTypeComponent
 * @extends {AbstractMultiAutocompleteComponent}
 * @implements {OnInit}
 */
@Component({
  selector: 'd360-multi-autocomplete-on-type',
  standalone: true,
  imports: [
    MatAutocompleteModule,
    MatInputModule,
    ReactiveFormsModule,
    SharedTranslocoModule,
    MatIcon,
    MatChipsModule,
  ],
  templateUrl:
    './../abstracts/abstract-multi-autocomplete/abstract-multi-autocomplete.component.html',
  styleUrls: [
    './../abstracts/abstract-multi-autocomplete/abstract-multi-autocomplete.component.scss',
  ],
})
export class MultiAutocompleteOnTypeComponent
  extends AbstractMultiAutocompleteComponent
  implements OnInit
{
  /**
   * @override
   * @inheritdoc
   */
  protected isPreloaded = false;

  /**
   * This is the url to be used for loading all possible options.
   *
   * @type {InputSignal<string>}
   * @memberof MultiAutocompleteOnTypeComponent
   */
  public urlBegin: InputSignal<string> = input.required<string>();

  /**
   * @override
   * @inheritdoc
   */
  public filteredOptions: WritableSignal<SelectableValue[]> = signal<
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
   * @inheritdoc
   * @override
   */
  public override addClearButton: InputSignal<boolean> = input(true);

  /**
   * @inheritdoc
   * @override
   */
  public override addDropdownIcon: InputSignal<boolean> = input(false);

  /**
   * The instance of SelectableOptionsService.
   *
   * @private
   * @type {SelectableOptionsService}
   * @memberof MultiAutocompleteOnTypeComponent
   */
  private readonly selectableOptionsService: SelectableOptionsService = inject(
    SelectableOptionsService
  );

  /**
   * Should the request include the language?
   *
   * @type {InputSignal<boolean>}
   * @memberof MultiAutocompleteOnTypeComponent
   */
  public requestWithLang: InputSignal<boolean> = input<boolean>(false);

  /**
   * Creates an instance of SingleAutocompleteOnTypeComponent.
   *
   * @memberof MultiAutocompleteOnTypeComponent
   */
  public constructor() {
    super();
    effect(() => this.fetchOptions(this.inputValue()), {
      allowSignalWrites: true,
    });
  }

  /**
   * @override
   * @inheritdoc
   */
  public ngOnInit(): void {
    this.options.set(this.optionsLoadingResult()?.options ?? []);
    this.loading.set(this.optionsLoadingResult()?.loading ?? false);
    this.loadingError.set(this.optionsLoadingResult()?.loadingError ?? null);

    super.ngOnInit();
  }

  /**
   * Reset the options
   *
   * @protected
   * @memberof MultiAutocompleteOnTypeComponent
   */
  protected resetOptions(): void {
    this.options.set([]);
  }

  /**
   * Fetch the options by a passed search string and set the first found value.
   *
   * @private
   * @param {string} searchString
   * @param {boolean} [setFormControlValue=false]
   * @memberof MultiAutocompleteOnTypeComponent
   */
  private fetchOptions(searchString: string): void {
    if (searchString && searchString.length >= 2) {
      this.selectableOptionsService
        .getOptionsBySearchTerm(
          this.urlBegin(),
          searchString,
          this.requestWithLang()
        )
        .pipe(
          catchError((error) => {
            this.loadingError.set(error);

            return [];
          }),
          tap((data) => {
            const allOptions: SelectableValue[] = [
              ...(data as SelectableValue[]),
            ];

            const selectedIds: Set<string> = new Set<string>(
              this.control().value.map((option: SelectableValue) => option.id)
            );

            this.options.set(
              allOptions.filter((option) => !selectedIds.has(option.id))
            );
          }),
          finalize(() => this.loading.set(false)),
          takeUntilDestroyed(this.destroyRef)
        )
        .subscribe();
    } else {
      this.resetOptions();
    }
  }
}
