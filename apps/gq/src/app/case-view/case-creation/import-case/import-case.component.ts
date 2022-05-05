import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

import { Observable } from 'rxjs';

import { TranslocoService } from '@ngneat/transloco';
import { Store } from '@ngrx/store';

import { ApplicationInsightsService } from '@schaeffler/application-insights';

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
import {
  CASE_CREATION_TYPES,
  CaseCreationEventParams,
  EVENT_NAMES,
} from '../../../shared/models';
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
    private readonly translocoService: TranslocoService,
    private readonly insightsService: ApplicationInsightsService
  ) {
    this.title$ = this.translocoService.selectTranslate(
      'caseCreation.importCase.title',
      {},
      'case-view'
    );
  }

  closeDialog(): void {
    this.dialogRef.close();

    this.insightsService.logEvent(EVENT_NAMES.CASE_CREATION_CANCELLED, {
      type: CASE_CREATION_TYPES.SAP_IMPORT,
    } as CaseCreationEventParams);
  }

  ngOnInit(): void {
    this.quotation$ = this.store.select(getCaseQuotation);
    this.createCaseLoading$ = this.store.select(getCreateCaseLoading);
    this.quotationAutocompleteLoading$ = this.store.select(
      getCaseAutocompleteLoading,
      FilterNames.SAP_QUOTATION
    );

    this.insightsService.logEvent(EVENT_NAMES.CASE_CREATION_STARTED, {
      type: CASE_CREATION_TYPES.SAP_IMPORT,
    } as CaseCreationEventParams);
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

    this.insightsService.logEvent(EVENT_NAMES.CASE_CREATION_FINISHED, {
      type: CASE_CREATION_TYPES.SAP_IMPORT,
    } as CaseCreationEventParams);
  }
}
