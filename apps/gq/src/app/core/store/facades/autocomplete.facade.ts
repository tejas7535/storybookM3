import { inject, Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { AutocompleteRequestDialog } from '@gq/shared/components/autocomplete-input/autocomplete-request-dialog.enum';
import { FilterNames } from '@gq/shared/components/autocomplete-input/filter-names.enum';
import { CustomerId } from '@gq/shared/models';
import { AutocompleteSearch, IdValue } from '@gq/shared/models/search';
import { FeatureToggleConfigService } from '@gq/shared/services/feature-toggle/feature-toggle-config.service';
import { Store } from '@ngrx/store';

import {
  autocomplete,
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
} from '../selectors';

@Injectable({
  providedIn: 'root',
})
export class AutoCompleteFacade {
  private readonly store: Store = inject(Store);
  private readonly featureToggleConfigService: FeatureToggleConfigService =
    inject(FeatureToggleConfigService);

  public materialDescForAddEntry$: Observable<CaseFilterItem> =
    this.store.select(getCaseMaterialDesc(AutocompleteRequestDialog.ADD_ENTRY));
  public materialDescForEditMaterial$: Observable<CaseFilterItem> =
    this.store.select(
      getCaseMaterialDesc(AutocompleteRequestDialog.EDIT_MATERIAL)
    );

  public materialDescForCreateCase$: Observable<CaseFilterItem> =
    this.store.select(
      getCaseMaterialDesc(AutocompleteRequestDialog.CREATE_CASE)
    );

  public materialNumberForAddEntry$: Observable<CaseFilterItem> =
    this.store.select(
      getCaseMaterialNumber(AutocompleteRequestDialog.ADD_ENTRY)
    );
  public materialNumberForEditMaterial$: Observable<CaseFilterItem> =
    this.store.select(
      getCaseMaterialNumber(AutocompleteRequestDialog.EDIT_MATERIAL)
    );

  public materialNumberForCreateCase$: Observable<CaseFilterItem> =
    this.store.select(
      getCaseMaterialNumber(AutocompleteRequestDialog.CREATE_CASE)
    );

  public materialNumberOrDescForGlobalSearch$: Observable<CaseFilterItem> =
    this.store.select(
      getCaseMaterialNumberOrDesc(AutocompleteRequestDialog.GLOBAL_SEARCH)
    );

  public customerMaterialNumberForAddEntry$: Observable<CaseFilterItem> =
    this.store.select(
      getCustomerMaterialNumber(AutocompleteRequestDialog.ADD_ENTRY)
    );

  public customerMaterialNumberForCreateCase$: Observable<CaseFilterItem> =
    this.store.select(
      getCustomerMaterialNumber(AutocompleteRequestDialog.CREATE_CASE)
    );
  public shipToCustomerForEditCase$: Observable<CaseFilterItem> =
    this.store.select(
      getCaseCustomerAndShipToParty(AutocompleteRequestDialog.EDIT_CASE)
    );

  public shipToCustomerForCaseCreation$: Observable<CaseFilterItem> =
    this.store.select(
      getCaseCustomerAndShipToParty(AutocompleteRequestDialog.CREATE_CASE)
    );
  public createCaseCustomer$: Observable<CaseFilterItem> = this.store.select(
    getCaseCustomer(
      this.featureToggleConfigService.isEnabled('createManualCaseAsView')
        ? AutocompleteRequestDialog.CREATE_CASE
        : AutocompleteRequestDialog.ADD_ENTRY
    )
  );

  public createCaseCustomerAddEntry$: Observable<CaseFilterItem> =
    this.store.select(getCaseCustomer(AutocompleteRequestDialog.ADD_ENTRY));

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
  public customerAndShipToPartyLoading$: Observable<boolean> =
    this.store.select(
      getCaseAutocompleteLoading(FilterNames.CUSTOMER_AND_SHIP_TO_PARTY)
    );

  public customerMaterialNumberLoading$: Observable<boolean> =
    this.store.select(
      getCaseAutocompleteLoading(FilterNames.CUSTOMER_MATERIAL)
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

  public autocomplete(
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

  selectMaterialNumberOrDescription(option: IdValue, filter: string): void {
    this.store.dispatch(
      setSelectedAutocompleteOption({
        filter,
        option,
      })
    );
  }
  selectCustomerMaterialNumberOrDescription(
    option: IdValue,
    filter: string
  ): void {
    this.store.dispatch(
      setSelectedAutocompleteOption({
        filter,
        option,
      })
    );
  }

  public unselectOptions(filter: string): void {
    const resets: FilterNames[] = [
      FilterNames.MATERIAL_NUMBER,
      FilterNames.MATERIAL_DESCRIPTION,
      FilterNames.CUSTOMER_MATERIAL,
    ];
    const resetFor = resets.filter((reset) => reset !== filter);
    resetFor.forEach((reset) => {
      this.store.dispatch(unselectAutocompleteOptions({ filter: reset }));
    });
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
    this.store.dispatch(ProcessCaseActions.clearRowData());
  }
}
