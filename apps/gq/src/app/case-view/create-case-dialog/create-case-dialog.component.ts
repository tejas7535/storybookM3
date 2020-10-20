import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { select, Store } from '@ngrx/store';

import { Observable, Subscription } from 'rxjs';
import { AppRoutePath } from '../../app-route-path.enum';

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
  getSelectedQuotation,
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

  private selectedQuotation: string;

  private readonly subscription: Subscription = new Subscription();

  constructor(
    private readonly store: Store<CaseState>,
    private readonly router: Router
  ) {}

  public ngOnInit(): void {
    this.autocompleteLoading$ = this.store.pipe(
      select(getCaseAutocompleteLoading)
    );
    this.quotation$ = this.store.pipe(select(getCaseQuotationOptions));
    this.subscription.add(
      this.store.pipe(select(getSelectedQuotation)).subscribe((value) => {
        this.selectedQuotation = value;
      })
    );
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
    this.router.navigate([AppRoutePath.ProcessCaseViewPath], {
      queryParams: {
        quotation_number: this.selectedQuotation,
      },
    });
  }
}
