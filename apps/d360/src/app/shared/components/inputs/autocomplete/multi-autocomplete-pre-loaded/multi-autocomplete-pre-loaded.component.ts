import { Component, input, InputSignal, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatChipsModule } from '@angular/material/chips';
import { MatIcon } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

import { Observable, of } from 'rxjs';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { OptionsLoadingResult } from '../../../../services/selectable-options.service';
import { DisplayFunctions } from '../../display-functions.utils';
import { AbstractMultiAutocompleteComponent } from '../abstracts/abstract-multi-autocomplete/abstract-multi-autocomplete.component';
import { SelectableValue } from '../selectable-values.utils';

/**
 * The MultiAutocompletePreLoaded Component.
 *
 * @export
 * @class MultiAutocompletePreLoadedComponent
 * @extends {AbstractMultiAutocompleteComponent}
 * @implements {OnInit}
 */
@Component({
  selector: 'd360-multi-autocomplete-pre-loaded',
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
export class MultiAutocompletePreLoadedComponent
  extends AbstractMultiAutocompleteComponent
  implements OnInit
{
  /**
   * @override
   * @inheritdoc
   */
  protected isPreloaded = true;

  /**
   * @inheritdoc
   * @override
   */
  public override addClearButton: InputSignal<boolean> = input(true);

  /**
   * @override
   * @inheritdoc
   */
  public ngOnInit(): void {
    this.extractOptions();

    super.ngOnInit();
  }

  /** @inheritdoc */
  protected onSearchControlChange$(searchString: string): Observable<void> {
    this.filterOptions(searchString);

    return of();
  }

  /**
   * Filter the options
   *
   * @param {*} value
   * @return {void}
   * @memberof MultiAutocompletePreLoadedComponent
   */
  private filterOptions(value: any): void {
    if (typeof value !== 'string') {
      return;
    }

    const allOptions: SelectableValue[] = [
      ...this.optionsLoadingResult().options,
    ];

    const selectedIds: Set<string> = new Set<string>(
      (this.control().value || []).map((option: SelectableValue) => option.id)
    );

    this.options.set(
      allOptions.filter(
        (option) =>
          // if it is already selected, we can skip it
          !selectedIds.has(option.id) &&
          // otherwise we search for the string in all options
          DisplayFunctions.displayFnUnited(option)
            .toLowerCase()
            .includes(value.toLowerCase() || '')
      )
    );
  }

  /**
   * Reset the option.
   *
   * @protected
   * @memberof MultiAutocompletePreLoadedComponent
   */
  protected resetOptions(): void {
    const allOptions: SelectableValue[] = [
      ...this.optionsLoadingResult().options,
    ];

    const selectedIds: Set<string> = new Set<string>(
      (this.control().value || []).map((option: SelectableValue) => option.id)
    );

    this.options.set(
      allOptions.filter((option) => !selectedIds.has(option.id))
    );
  }

  /**
   * Extract the passed options and update all signals.
   *
   * @private
   * @memberof MultiAutocompletePreLoadedComponent
   */
  private extractOptions(): void {
    const { options, loading, loadingError }: OptionsLoadingResult =
      this.optionsLoadingResult();

    this.options.set(options);
    this.loading.set(loading ?? false);
    this.loadingError.set(loadingError ?? null);
  }
}
