import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

import { Observable } from 'rxjs';

import { TranslocoService } from '@ngneat/transloco';
import { Store } from '@ngrx/store';

import {
  autocomplete,
  getCaseAutocompleteLoading,
  getCaseQuotation,
  getCreateCaseLoading,
  importCase,
  selectAutocompleteOption,
  unselectAutocompleteOptions,
} from '../../../core/store';
import { CaseFilterItem } from '../../../core/store/reducers/create-case/models';
import { FilterNames } from '../../../shared/components/autocomplete-input/filter-names.enum';
import { AutocompleteSearch, IdValue } from '../../../shared/models/search';

@Component({
  selector: 'gq-import-case',
  templateUrl: './import-case.component.html',
})
export class ImportCaseComponent implements OnInit {
  quotation$: Observable<CaseFilterItem>;
  createCaseLoading$: Observable<boolean>;
  quotationAutocompleteLoading$: Observable<boolean>;
  title$: Observable<string>;
  quotationIsValid = false;

  constructor(
    private readonly store: Store,
    private readonly dialogRef: MatDialogRef<ImportCaseComponent>,
    private readonly translocoService: TranslocoService
  ) {
    this.title$ = this.translocoService.selectTranslate(
      'caseCreation.importCase.title',
      {},
      'case-view'
    );
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

  ngOnInit(): void {
    this.quotation$ = this.store.select(getCaseQuotation);
    this.createCaseLoading$ = this.store.select(getCreateCaseLoading);
    this.quotationAutocompleteLoading$ = this.store.select(
      getCaseAutocompleteLoading,
      FilterNames.SAP_QUOTATION
    );
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

  importQuotation(): void {
    this.store.dispatch(importCase());
  }
}
