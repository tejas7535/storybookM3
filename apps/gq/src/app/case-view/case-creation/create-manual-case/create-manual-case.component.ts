import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

import { Observable } from 'rxjs';

import { TranslocoService } from '@ngneat/transloco';
import { Store } from '@ngrx/store';

import { ApplicationInsightsService } from '@schaeffler/application-insights';

import {
  autocomplete,
  getCaseAutocompleteLoading,
  getCaseCustomer,
  getCaseRowData,
  getCreateCaseLoading,
  resetCustomerFilter,
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
import { MaterialTableItem } from '../../../shared/models/table';

@Component({
  selector: 'gq-create-manual-case',
  templateUrl: './create-manual-case.component.html',
})
export class CreateManualCaseComponent implements OnInit {
  createCaseLoading$: Observable<boolean>;
  customer$: Observable<CaseFilterItem>;
  customerAutocompleteLoading$: Observable<boolean>;
  rowData$: Observable<MaterialTableItem[]>;
  title$: Observable<string>;

  constructor(
    private readonly store: Store,
    private readonly dialogRef: MatDialogRef<CreateManualCaseComponent>,
    private readonly translocoService: TranslocoService,
    private readonly insightsService: ApplicationInsightsService
  ) {
    this.title$ = this.translocoService.selectTranslate(
      'caseCreation.createManualCase.title',
      {},
      'case-view'
    );
  }

  ngOnInit(): void {
    this.createCaseLoading$ = this.store.select(getCreateCaseLoading);
    this.customer$ = this.store.select(getCaseCustomer);
    this.customerAutocompleteLoading$ = this.store.select(
      getCaseAutocompleteLoading,
      FilterNames.CUSTOMER
    );
    this.rowData$ = this.store.select(getCaseRowData);

    this.insightsService.logEvent(EVENT_NAMES.CASE_CREATION_STARTED, {
      type: CASE_CREATION_TYPES.MANUAL,
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

  closeDialog(): void {
    this.dialogRef.close();
    this.store.dispatch(resetCustomerFilter());

    this.insightsService.logEvent(EVENT_NAMES.CASE_CREATION_CANCELLED, {
      type: CASE_CREATION_TYPES.MANUAL,
    } as CaseCreationEventParams);
  }
}
