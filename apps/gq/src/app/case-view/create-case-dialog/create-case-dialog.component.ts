import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Observable, Subscription } from 'rxjs';

import { select, Store } from '@ngrx/store';

import { AppRoutePath } from '../../app-route-path.enum';
import {
  autocomplete,
  selectAutocompleteOption,
  unselectAutocompleteOptions,
} from '../../core/store/actions';
import {
  AutocompleteSearch,
  CaseFilterItem,
  CaseTableItem,
  CreateCaseResponse,
  IdValue,
  SapQuotation,
} from '../../core/store/models';
import { CaseState } from '../../core/store/reducers/create-case/create-case.reducer';
import {
  getCaseAutocompleteLoading,
  getCaseCustomer,
  getCaseQuotation,
  getCaseRowData,
  getSelectedQuotation,
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
  private selectedQuotation: CreateCaseResponse;

  private readonly subscription: Subscription = new Subscription();

  constructor(
    private readonly store: Store<CaseState>,
    private readonly router: Router
  ) {}

  public ngOnInit(): void {
    this.quotationAutocompleteLoading$ = this.store.pipe(
      select(getCaseAutocompleteLoading, 'quotation')
    );
    this.customerAutocompleteLoading$ = this.store.pipe(
      select(getCaseAutocompleteLoading, 'customer')
    );
    this.quotation$ = this.store.pipe(select(getCaseQuotation));
    this.subscription.add(
      this.store.pipe(select(getSelectedQuotation)).subscribe((value) => {
        this.selectedQuotation = value;
      })
    );
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
    this.router.navigate([AppRoutePath.ProcessCaseViewPath], {
      queryParams: {
        quotation_number: this.selectedQuotation.gqId,
        customer_number: this.selectedQuotation.customerId,
      },
    });
  }
}
