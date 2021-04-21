import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

import { Observable } from 'rxjs';

import { select, Store } from '@ngrx/store';

import {
  autocomplete,
  importCase,
  selectAutocompleteOption,
  unselectAutocompleteOptions,
} from '../../core/store/actions';
import { CaseState } from '../../core/store/reducers/create-case/create-case.reducer';
import { CaseFilterItem } from '../../core/store/reducers/create-case/models';
import {
  getCaseAutocompleteLoading,
  getCaseCustomer,
  getCaseQuotation,
  getCaseRowData,
  getCreateCaseLoading,
} from '../../core/store/selectors/';
import { FilterNames } from '../../shared/autocomplete-input/filter-names.enum';
import { AutocompleteSearch, IdValue } from '../../shared/models/search';
import { MaterialTableItem } from '../../shared/models/table';

@Component({
  selector: 'gq-create-case-dialog',
  templateUrl: './create-case-dialog.component.html',
  styleUrls: ['./create-case-dialog.component.scss'],
})
export class CreateCaseDialogComponent implements OnInit {
  quotationAutocompleteLoading$: Observable<boolean>;
  customerAutocompleteLoading$: Observable<boolean>;
  createCaseLoading$: Observable<boolean>;
  quotation$: Observable<CaseFilterItem>;
  customer$: Observable<CaseFilterItem>;
  rowData$: Observable<MaterialTableItem[]>;

  quotationDisabled = false;
  customerDisabled = false;
  addEntryInput: boolean;
  quotationIsValid = false;
  isExpanded = false;

  constructor(
    private readonly store: Store<CaseState>,
    private readonly dialogRef: MatDialogRef<CreateCaseDialogComponent>
  ) {}

  public ngOnInit(): void {
    this.quotationAutocompleteLoading$ = this.store.pipe(
      select(getCaseAutocompleteLoading, FilterNames.SAP_QUOTATION)
    );
    this.customerAutocompleteLoading$ = this.store.pipe(
      select(getCaseAutocompleteLoading, FilterNames.CUSTOMER)
    );
    this.createCaseLoading$ = this.store.pipe(select(getCreateCaseLoading));
    this.quotation$ = this.store.pipe(select(getCaseQuotation));

    this.customer$ = this.store.pipe(select(getCaseCustomer));
    this.rowData$ = this.store.pipe(select(getCaseRowData));
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
  closeDialog(): void {
    this.dialogRef.close();
  }
  toggleExpanded(): void {
    this.isExpanded = !this.isExpanded;
  }
}
