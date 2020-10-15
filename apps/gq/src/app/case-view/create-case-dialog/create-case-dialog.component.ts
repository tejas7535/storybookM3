import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs';

import { select, Store } from '@ngrx/store';

import {
  autocomplete,
  selectQuotationOption,
  unselectQuotationOptions,
} from '../../core/store/actions';
import { AutocompleteSearch, IdValue } from '../../core/store/models';
import { CaseState } from '../../core/store/reducers/create-case/create-case.reducer';
import {
  getCaseAutocompleteLoading,
  getCaseQuotationOptions,
} from '../../core/store/selectors/';

@Component({
  selector: 'gq-create-case-dialog',
  templateUrl: './create-case-dialog.component.html',
  styleUrls: ['./create-case-dialog.component.scss'],
})
export class CreateCaseDialogComponent implements OnInit {
  autocompleteLoading$: Observable<string>;
  quotation$: Observable<IdValue[]>;
  quotationIsValid = false;
  constructor(private readonly store: Store<CaseState>) {}

  public ngOnInit(): void {
    this.autocompleteLoading$ = this.store.pipe(
      select(getCaseAutocompleteLoading)
    );
    this.quotation$ = this.store.pipe(select(getCaseQuotationOptions));
  }
  autocomplete(autocompleteSearch: AutocompleteSearch): void {
    this.store.dispatch(autocomplete({ autocompleteSearch }));
  }
  unselectQuotationOptions(): void {
    this.store.dispatch(unselectQuotationOptions());
  }
  selectQuotationOption(option: IdValue): void {
    this.store.dispatch(selectQuotationOption({ option }));
  }
  quotationValid(isValid: boolean): void {
    this.quotationIsValid = isValid;
  }
  openQuotation(): void {
    // ToDo: Adjust Navigate to detail page with Quotation id as param
  }
}
