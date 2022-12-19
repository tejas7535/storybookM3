import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { Store } from '@ngrx/store';

import { AutocompleteRequestDialog } from '../../../shared/components/autocomplete-input/autocomplete-request-dialog.enum';
import { FilterNames } from '../../../shared/components/autocomplete-input/filter-names.enum';
import { AutocompleteSearch, IdValue } from '../../../shared/models/search';
import {
  autocomplete,
  clearProcessCaseRowData,
  getCaseAutocompleteLoading,
  getCaseMaterialDesc,
  getCaseMaterialNumber,
  resetAllAutocompleteOptions,
  resetRequestingAutoCompleteDialog,
  setRequestingAutoCompleteDialog,
  setSelectedAutocompleteOption,
  unselectAutocompleteOptions,
} from '..';
import { CaseFilterItem } from '../reducers/create-case/models';

@Injectable({
  providedIn: 'root',
})
export class AutoCompleteFacade {
  public dialog: AutocompleteRequestDialog = AutocompleteRequestDialog.EMPTY;

  constructor(private readonly store: Store) {}

  public materialDesc$: Observable<CaseFilterItem> = this.store.select(
    getCaseMaterialDesc(this.dialog)
  );
  public materialNumber$: Observable<CaseFilterItem> = this.store.select(
    getCaseMaterialNumber(this.dialog)
  );
  public materialNumberAutocompleteLoading$: Observable<boolean> =
    this.store.select(getCaseAutocompleteLoading(FilterNames.MATERIAL_NUMBER));

  public materialDescAutocompleteLoading$: Observable<boolean> =
    this.store.select(
      getCaseAutocompleteLoading(FilterNames.MATERIAL_DESCRIPTION)
    );

  /**
   * This Facades needs to be initialized
   *
   * @param dialog dialog to display the auto-completes
   */
  public initFacade(dialog: AutocompleteRequestDialog): void {
    this.dialog = dialog;
    this.store.dispatch(setRequestingAutoCompleteDialog({ dialog }));
  }

  public resetAllAutoCompleteOptions(): void {
    this.store.dispatch(resetAllAutocompleteOptions());
  }

  public autocomplete(autocompleteSearch: AutocompleteSearch): void {
    this.store.dispatch(autocomplete({ autocompleteSearch }));
  }

  selectOption(option: IdValue, filter: string): void {
    this.store.dispatch(
      setSelectedAutocompleteOption({
        filter,
        option,
      })
    );
  }

  public unselectOptions(filter: string): void {
    const filterName =
      filter === FilterNames.MATERIAL_NUMBER
        ? FilterNames.MATERIAL_DESCRIPTION
        : FilterNames.MATERIAL_NUMBER;
    this.store.dispatch(unselectAutocompleteOptions({ filter: filterName }));
    this.store.dispatch(unselectAutocompleteOptions({ filter }));
  }

  public resetView(): void {
    this.store.dispatch(resetAllAutocompleteOptions());
    this.store.dispatch(resetRequestingAutoCompleteDialog());
  }

  public setRequestDialog(dialog: AutocompleteRequestDialog): void {
    this.store.dispatch(setRequestingAutoCompleteDialog({ dialog }));
  }

  public clearProcessCaseRowData(): void {
    this.store.dispatch(clearProcessCaseRowData());
  }
}
