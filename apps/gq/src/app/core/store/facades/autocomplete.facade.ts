import { inject, Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { AutocompleteRequestDialog } from '@gq/shared/components/autocomplete-input/autocomplete-request-dialog.enum';
import { FilterNames } from '@gq/shared/components/autocomplete-input/filter-names.enum';
import { MATERIAL_FILTERS } from '@gq/shared/constants';
import { CustomerId } from '@gq/shared/models';
import { AutocompleteSearch, IdValue } from '@gq/shared/models/search';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';

import {
  autocomplete,
  autocompleteSuccess,
  findDefaultCustomerMaterialNumberFor,
  resetAutocompleteMaterials,
  resetRequestingAutoCompleteDialog,
  selectAutocompleteOption,
  setRequestingAutoCompleteDialog,
  setSelectedAutocompleteOption,
  unselectAutocompleteOptions,
} from '../actions';
import { ProcessCaseActions } from '../process-case';
import { CaseFilterItem } from '../reducers/create-case/models';
import {
  getCaseAutocompleteLoading,
  getCaseCustomer,
  getCaseCustomerAndShipToParty,
  getCaseMaterialDesc,
  getCaseMaterialNumber,
  getCaseMaterialNumberOrDesc,
  getCustomerMaterialNumber,
  getDefaultCustomerMaterialNumber,
  getSelectedAutocompleteMaterialNumber,
  getSelectedAutocompleteRequestDialog,
} from '../selectors';

@Injectable({
  providedIn: 'root',
})
export class AutoCompleteFacade {
  private readonly store: Store = inject(Store);
  private readonly actions$: Actions = inject(Actions);

  getSelectedAutocompleteRequestDialog$: Observable<AutocompleteRequestDialog> =
    this.store.select(getSelectedAutocompleteRequestDialog);

  getSelectedAutocompleteMaterialNumber$: Observable<IdValue> =
    this.store.select(
      getSelectedAutocompleteMaterialNumber([
        AutocompleteRequestDialog.ADD_ENTRY,
        AutocompleteRequestDialog.CREATE_CASE,
      ])
    );

  getSelectedAutocompleteMaterialNumberForEditMaterial$: Observable<IdValue> =
    this.store.select(
      getSelectedAutocompleteMaterialNumber([
        AutocompleteRequestDialog.EDIT_MATERIAL,
      ])
    );

  materialDescForAddEntry$: Observable<CaseFilterItem> = this.store.select(
    getCaseMaterialDesc(AutocompleteRequestDialog.ADD_ENTRY)
  );
  materialDescForEditMaterial$: Observable<CaseFilterItem> = this.store.select(
    getCaseMaterialDesc(AutocompleteRequestDialog.EDIT_MATERIAL)
  );

  materialDescForCreateCase$: Observable<CaseFilterItem> = this.store.select(
    getCaseMaterialDesc(AutocompleteRequestDialog.CREATE_CASE)
  );

  materialNumberForAddEntry$: Observable<CaseFilterItem> = this.store.select(
    getCaseMaterialNumber(AutocompleteRequestDialog.ADD_ENTRY)
  );
  materialNumberForEditMaterial$: Observable<CaseFilterItem> =
    this.store.select(
      getCaseMaterialNumber(AutocompleteRequestDialog.EDIT_MATERIAL)
    );

  materialNumberForCreateCase$: Observable<CaseFilterItem> = this.store.select(
    getCaseMaterialNumber(AutocompleteRequestDialog.CREATE_CASE)
  );

  materialNumberOrDescForGlobalSearch$: Observable<CaseFilterItem> =
    this.store.select(
      getCaseMaterialNumberOrDesc(AutocompleteRequestDialog.GLOBAL_SEARCH)
    );

  customerMaterialNumberForAddEntry$: Observable<CaseFilterItem> =
    this.store.select(
      getCustomerMaterialNumber(AutocompleteRequestDialog.ADD_ENTRY)
    );

  customerMaterialNumberForCreateCase$: Observable<CaseFilterItem> =
    this.store.select(
      getCustomerMaterialNumber(AutocompleteRequestDialog.CREATE_CASE)
    );

  customerMaterialNumberForEditMaterial$: Observable<CaseFilterItem> =
    this.store.select(
      getCustomerMaterialNumber(AutocompleteRequestDialog.EDIT_MATERIAL)
    );

  shipToCustomerForEditCase$: Observable<CaseFilterItem> = this.store.select(
    getCaseCustomerAndShipToParty(AutocompleteRequestDialog.EDIT_CASE)
  );

  shipToCustomerForCaseCreation$: Observable<CaseFilterItem> =
    this.store.select(
      getCaseCustomerAndShipToParty(AutocompleteRequestDialog.CREATE_CASE)
    );

  createCaseCustomer$: Observable<CaseFilterItem> = this.store.select(
    getCaseCustomer(AutocompleteRequestDialog.CREATE_CASE)
  );

  createCaseCustomerAddEntry$: Observable<CaseFilterItem> = this.store.select(
    getCaseCustomer(AutocompleteRequestDialog.ADD_ENTRY)
  );

  materialNumberAutocompleteLoading$: Observable<boolean> = this.store.select(
    getCaseAutocompleteLoading(FilterNames.MATERIAL_NUMBER)
  );

  materialDescAutocompleteLoading$: Observable<boolean> = this.store.select(
    getCaseAutocompleteLoading(FilterNames.MATERIAL_DESCRIPTION)
  );

  materialNumberOrDescAutocompleteLoading$: Observable<boolean> =
    this.store.select(
      getCaseAutocompleteLoading(FilterNames.MATERIAL_NUMBER_OR_DESCRIPTION)
    );

  customerLoading$: Observable<boolean> = this.store.select(
    getCaseAutocompleteLoading(FilterNames.CUSTOMER)
  );
  customerAndShipToPartyLoading$: Observable<boolean> = this.store.select(
    getCaseAutocompleteLoading(FilterNames.CUSTOMER_AND_SHIP_TO_PARTY)
  );

  customerMaterialNumberLoading$: Observable<boolean> = this.store.select(
    getCaseAutocompleteLoading(FilterNames.CUSTOMER_MATERIAL)
  );

  defaultCustomerMaterialNumber$: Observable<string> = this.store.select(
    getDefaultCustomerMaterialNumber
  );

  optionSelectedForAutoCompleteFilter$ = this.actions$.pipe(
    ofType(setSelectedAutocompleteOption)
  );

  getAutocompleteOptionsSuccess$: Observable<{
    options: IdValue[];
    filter: FilterNames;
  }> = this.actions$.pipe(ofType(autocompleteSuccess));
  /**
   * This Facades needs to be initialized
   *
   * @param dialog dialog to display the auto-completes
   */
  initFacade(dialog: AutocompleteRequestDialog): void {
    this.store.dispatch(setRequestingAutoCompleteDialog({ dialog }));
  }

  resetAutocompleteMaterials(): void {
    this.store.dispatch(resetAutocompleteMaterials());
  }

  findDefaultCustomerMaterialNumberFor(
    materialNumber: string,
    currentCustomerMaterialNumber: string
  ): void {
    this.store.dispatch(
      findDefaultCustomerMaterialNumberFor({
        materialNumber,
        currentCustomerMaterialNumber,
      })
    );
  }

  autocomplete(
    autocompleteSearch: AutocompleteSearch,
    customerId?: CustomerId
  ): void {
    if (
      autocompleteSearch.filter === FilterNames.CUSTOMER_MATERIAL &&
      !customerId?.customerId
    ) {
      return;
    }

    autocompleteSearch.customerIdentifier = customerId;

    this.store.dispatch(autocomplete({ autocompleteSearch }));
  }

  selectCustomer(option: IdValue, filter: string): void {
    this.store.dispatch(selectAutocompleteOption({ filter, option }));
  }

  // see https://confluence.schaeffler.com/display/PARS/GQ+Autocomplete+Component
  selectMaterialNumberDescriptionOrCustomerMaterial(
    option: IdValue,
    filter: string,
    resetAll: boolean = false
  ): void {
    // resetAll selected Autocomplete Options
    // e.g. when an autocomplete returns only 1 option this option is directly selected (autoSelected)
    // this can lead to misbehavior when the customerMaterial is other than the autoSelected-option so the autoSelected-option needs to be unselected first
    const filtersToResetWhenCustomerMaterial =
      filter === FilterNames.CUSTOMER_MATERIAL
        ? MATERIAL_FILTERS.filter((reset) => reset !== filter)
        : [];

    const filtersToReset = resetAll
      ? MATERIAL_FILTERS
      : filtersToResetWhenCustomerMaterial;

    filtersToReset.forEach((reset) => {
      this.store.dispatch(unselectAutocompleteOptions({ filter: reset }));
    });

    this.store.dispatch(
      setSelectedAutocompleteOption({
        filter,
        option,
      })
    );
  }

  // see https://confluence.schaeffler.com/display/PARS/GQ+Autocomplete+Component
  unselectOptions(filter: string): void {
    if (filter !== FilterNames.CUSTOMER_MATERIAL) {
      const resetFor = MATERIAL_FILTERS.filter((reset) => reset !== filter);

      resetFor.forEach((reset) => {
        this.store.dispatch(unselectAutocompleteOptions({ filter: reset }));
      });
    }
    this.store.dispatch(unselectAutocompleteOptions({ filter }));
  }

  resetView(): void {
    this.store.dispatch(resetAutocompleteMaterials());
    this.store.dispatch(resetRequestingAutoCompleteDialog());
  }

  setRequestDialog(dialog: AutocompleteRequestDialog): void {
    this.store.dispatch(setRequestingAutoCompleteDialog({ dialog }));
  }

  clearProcessCaseRowData(): void {
    this.store.dispatch(ProcessCaseActions.clearRowData());
  }
}
