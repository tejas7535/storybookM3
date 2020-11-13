import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs';

import { select, Store } from '@ngrx/store';

import {
  autocomplete,
  importCase,
  selectAutocompleteOption,
  unselectAutocompleteOptions,
} from '../../core/store/actions';
import {
  AutocompleteSearch,
  CaseFilterItem,
  CaseTableItem,
  IdValue,
  SapQuotation,
} from '../../core/store/models';
import { CaseState } from '../../core/store/reducers/create-case/create-case.reducer';
import {
  getCaseAutocompleteLoading,
  getCaseCustomer,
  getCaseQuotation,
  getCaseRowData,
} from '../../core/store/selectors/';

@Component({
  selector: 'gq-create-case-dialog',
  templateUrl: './create-case-dialog.component.html',
  styleUrls: ['./create-case-dialog.component.scss'],
})
export class CreateCaseDialogComponent implements OnInit {
  quotationAutocompleteLoading$: Observable<boolean>;
  customerAutocompleteLoading$: Observable<boolean>;
  quotation$: Observable<CaseFilterItem>;
  customer$: Observable<CaseFilterItem>;
  rowData$: Observable<CaseTableItem[]>;

  quotationDisabled = false;
  customerDisabled = false;
  addEntryInput: boolean;
  quotationIsValid = false;

  constructor(private readonly store: Store<CaseState>) {}

  public ngOnInit(): void {
    this.quotationAutocompleteLoading$ = this.store.pipe(
      select(getCaseAutocompleteLoading, 'quotation')
    );
    this.customerAutocompleteLoading$ = this.store.pipe(
      select(getCaseAutocompleteLoading, 'customer')
    );
    this.quotation$ = this.store.pipe(select(getCaseQuotation));

    this.customer$ = this.store.pipe(select(getCaseCustomer));
    this.rowData$ = this.store.pipe(select(getCaseRowData));
  }

  autocomplete(autocompleteSearch: AutocompleteSearch): void {
    this.store.dispatch(autocomplete({ autocompleteSearch }));
  }
  selectOption(option: IdValue | SapQuotation, filter: string): void {
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

  quotationValid(isValid: boolean): void {
    this.quotationIsValid = isValid;
  }

  quotationHasInput(hasInput: boolean): void {
    this.customerDisabled = hasInput;
  }
  customerHasInput(hasInput: boolean): void {
    this.quotationDisabled = hasInput;
  }

  openQuotation(): void {
    this.store.dispatch(importCase());
  }
}
