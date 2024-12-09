import {
  Component,
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

import { Observable, of } from 'rxjs';
import {
  catchError,
  filter,
  finalize,
  switchMap,
  take,
  tap,
} from 'rxjs/operators';

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
   * @memberof SingleAutocompleteOnTypeComponent
   */
  private readonly selectableOptionsService: SelectableOptionsService = inject(
    SelectableOptionsService
  );

  /**
   * The current available options for the last search.
   * Hint: Important - this options are only set, after the user clicks on an option!
   *
   * @private
   * @type {SelectableValue[]}
   * @memberof SingleAutocompleteOnTypeComponent
   */
  private options: SelectableValue[] = [];

  /**
   * @override
   * @inheritdoc
   */
  public ngOnInit(): void {
    if (!SelectableValueUtils.isSelectableValue(this.control().value)) {
      this.onSearchControlChange$(this.control().value as string, true)
        .pipe(take(1), takeUntilDestroyed(this.destroyRef))
        .subscribe();
    }

    super.ngOnInit();
  }

  /** @inheritdoc */
  protected onOptionSelected(): void {
    if (SelectableValueUtils.isSelectableValue(this.control().value)) {
      this.onSelectionChange.emit({ option: this.getTypedValue() });
      this.value = this.getTypedValue();

      this.options = this.filteredOptions();
    }
  }

  /** @inheritdoc */
  protected onSearchControlChange$(
    searchString: string,
    setFormControlValue: boolean = false
  ): Observable<unknown> {
    return of(searchString).pipe(
      filter((value) => {
        if (value && value.length > 1) {
          return true;
        }

        this.filteredOptions.set([]);

        return false;
      }),
      tap(() => this.loading.set(true)),
      switchMap(() =>
        this.selectableOptionsService.getOptionsBySearchTerm(
          this.urlBegin(),
          searchString
        )
      ),
      catchError((error) => {
        this.loadingError.set(error);

        return of([]);
      }),
      tap((data) => {
        // if it is not the initial search, we disable the override
        if (this.first && !setFormControlValue) {
          this.first = false;
        }

        this.filteredOptions.set([...(data as SelectableValue[])]);

        if (setFormControlValue) {
          this.control().setValue(this.filteredOptions()[0]);
          this.value = this.getTypedValue();
        }
      }),
      finalize(() => this.loading.set(false)),
      takeUntilDestroyed(this.destroyRef)
    );
  }

  /** @inheritdoc */
  protected resetOptions(): void {
    this.filteredOptions.set(this.options);
  }
}
