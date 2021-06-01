import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

import { Observable } from 'rxjs';

import { TranslocoService } from '@ngneat/transloco';
import { Store } from '@ngrx/store';

import {
  autocomplete,
  getCaseAutocompleteLoading,
  getCaseCustomer,
  getProductLinesAndSeries,
  getProductLinesAndSeriesLoading,
  getSelectedCustomerId,
  getSelectedSalesOrg,
  resetProductLineAndSeries,
  selectAutocompleteOption,
  unselectAutocompleteOptions,
} from '../../../core/store';
import {
  CaseFilterItem,
  SalesOrg,
} from '../../../core/store/reducers/create-case/models';
import { PLsAndSeries } from '../../../core/store/reducers/create-case/models/pls-and-series.model';
import { AutocompleteInputComponent } from '../../../shared/autocomplete-input/autocomplete-input.component';
import { FilterNames } from '../../../shared/autocomplete-input/filter-names.enum';
import { AutocompleteSearch, IdValue } from '../../../shared/models/search';
import { MaterialSelectionComponent } from './material-selection/material-selection.component';

@Component({
  selector: 'gq-create-customer-case',
  templateUrl: './create-customer-case.component.html',
})
export class CreateCustomerCaseComponent implements OnInit {
  title$: Observable<string>;
  customer$: Observable<CaseFilterItem>;
  selectedSalesOrg$: Observable<SalesOrg>;
  selectedCustomerId$: Observable<string>;
  customerAutocompleteLoading$: Observable<boolean>;
  plsAndSeries$: Observable<PLsAndSeries>;
  plsAndSeriesLoading$: Observable<boolean>;
  createCaseDisabled: boolean;

  @ViewChild('materialSelection') materialSelection: MaterialSelectionComponent;
  @ViewChild('autocompleteComponent')
  autocompleteComponent: AutocompleteInputComponent;

  constructor(
    private readonly store: Store,
    private readonly dialogRef: MatDialogRef<CreateCustomerCaseComponent>,
    private readonly translocoService: TranslocoService
  ) {
    this.title$ = this.translocoService.selectTranslate(
      'caseCreation.createCustomerCase.title',
      {},
      'case-view'
    );
  }

  ngOnInit(): void {
    this.customer$ = this.store.select(getCaseCustomer);
    this.customerAutocompleteLoading$ = this.store.select(
      getCaseAutocompleteLoading,
      FilterNames.CUSTOMER
    );
    this.selectedSalesOrg$ = this.store.select(getSelectedSalesOrg);
    this.selectedCustomerId$ = this.store.select(getSelectedCustomerId);
    this.plsAndSeries$ = this.store.select(getProductLinesAndSeries);
    this.plsAndSeriesLoading$ = this.store.select(
      getProductLinesAndSeriesLoading
    );
  }
  closeDialog(): void {
    this.dialogRef.close();
  }

  autocomplete(autocompleteSearch: AutocompleteSearch): void {
    this.store.dispatch(autocomplete({ autocompleteSearch }));
  }
  selectOption(option: IdValue, filter: string): void {
    this.store.dispatch(
      selectAutocompleteOption({
        option,
        filter,
      })
    );
  }

  unselectOptions(filter: string): void {
    this.store.dispatch(unselectAutocompleteOptions({ filter }));
  }

  createCase(): void {}
  resetAll(): void {
    this.materialSelection.resetAll();
    this.unselectOptions(FilterNames.CUSTOMER);
    this.autocompleteComponent.resetInputField();
    this.store.dispatch(resetProductLineAndSeries());
  }
}
