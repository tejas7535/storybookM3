import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { Store } from '@ngrx/store';

import { AutocompleteRequestDialog } from '../../../shared/components/autocomplete-input/autocomplete-request-dialog.enum';
import { FilterNames } from '../../../shared/components/autocomplete-input/filter-names.enum';
import { AutocompleteSearch, IdValue } from '../../../shared/models/search';
import {
  autocomplete,
  clearProcessCaseRowData,
  resetAutocompleteMaterials,
  resetRequestingAutoCompleteDialog,
  selectAutocompleteOption,
  setRequestingAutoCompleteDialog,
  setSelectedAutocompleteOption,
  unselectAutocompleteOptions,
} from '../actions';
import { CaseFilterItem } from '../reducers/create-case/models';
import {
  getCaseAutocompleteLoading,
  getCaseCustomer,
  getCaseMaterialDesc,
  getCaseMaterialNumber,
  getCaseMaterialNumberOrDesc,
} from '../selectors';

@Injectable({
  providedIn: 'root',
})
export class AutoCompleteFacade {
  constructor(private readonly store: Store) {}

  public materialDescForAddEntry$: Observable<CaseFilterItem> =
    this.store.select(getCaseMaterialDesc(AutocompleteRequestDialog.ADD_ENTRY));
  public materialDescForEditMaterial$: Observable<CaseFilterItem> =
    this.store.select(
      getCaseMaterialDesc(AutocompleteRequestDialog.EDIT_MATERIAL)
    );
  public materialNumberForAddEntry$: Observable<CaseFilterItem> =
    this.store.select(
      getCaseMaterialNumber(AutocompleteRequestDialog.ADD_ENTRY)
    );
  public materialNumberForEditMaterial$: Observable<CaseFilterItem> =
    this.store.select(
      getCaseMaterialNumber(AutocompleteRequestDialog.EDIT_MATERIAL)
    );
  public materialNumberOrDescForGlobalSearch$: Observable<CaseFilterItem> =
    this.store.select(
      getCaseMaterialNumberOrDesc(AutocompleteRequestDialog.GLOBAL_SEARCH)
    );
  public shipToCustomer$: Observable<CaseFilterItem> = this.store.select(
    getCaseCustomer(AutocompleteRequestDialog.EDIT_CASE)
  );
  public createCaseCustomer$: Observable<CaseFilterItem> = this.store.select(
    getCaseCustomer(AutocompleteRequestDialog.ADD_ENTRY)
  );

  public materialNumberAutocompleteLoading$: Observable<boolean> =
    this.store.select(getCaseAutocompleteLoading(FilterNames.MATERIAL_NUMBER));

  public materialDescAutocompleteLoading$: Observable<boolean> =
    this.store.select(
      getCaseAutocompleteLoading(FilterNames.MATERIAL_DESCRIPTION)
    );

  public materialNumberOrDescAutocompleteLoading$: Observable<boolean> =
    this.store.select(
      getCaseAutocompleteLoading(FilterNames.MATERIAL_NUMBER_OR_DESCRIPTION)
    );

  public customerLoading$: Observable<boolean> = this.store.select(
    getCaseAutocompleteLoading(FilterNames.CUSTOMER)
  );

  /**
   * This Facades needs to be initialized
   *
   * @param dialog dialog to display the auto-completes
   */
  public initFacade(dialog: AutocompleteRequestDialog): void {
    this.store.dispatch(setRequestingAutoCompleteDialog({ dialog }));
  }

  public resetAutocompleteMaterials(): void {
    this.store.dispatch(resetAutocompleteMaterials());
  }

  public autocomplete(autocompleteSearch: AutocompleteSearch): void {
    this.store.dispatch(autocomplete({ autocompleteSearch }));
  }

  selectCustomer(option: IdValue, filter: string): void {
    this.store.dispatch(selectAutocompleteOption({ filter, option }));
  }

  selectMaterialNumberOrDescription(option: IdValue, filter: string): void {
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
    this.store.dispatch(resetAutocompleteMaterials());
    this.store.dispatch(resetRequestingAutoCompleteDialog());
  }

  public setRequestDialog(dialog: AutocompleteRequestDialog): void {
    this.store.dispatch(setRequestingAutoCompleteDialog({ dialog }));
  }

  public clearProcessCaseRowData(): void {
    this.store.dispatch(clearProcessCaseRowData());
  }
}
