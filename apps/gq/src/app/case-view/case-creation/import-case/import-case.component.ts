import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogRef } from '@angular/material/dialog';

import { Observable } from 'rxjs';

import {
  autocomplete,
  importCase,
  resetAllAutocompleteOptions,
  selectAutocompleteOption,
  unselectAutocompleteOptions,
} from '@gq/core/store/actions';
import { CaseFilterItem } from '@gq/core/store/reducers/models';
import {
  getCaseAutocompleteLoading,
  getCaseQuotation,
  getCreateCaseLoading,
} from '@gq/core/store/selectors/create-case/create-case.selector';
import { FilterNames } from '@gq/shared/components/autocomplete-input/filter-names.enum';
import { SapIdAutoCompleteInputComponent } from '@gq/shared/components/autocomplete-input/sap-id/sap-id-autocomplete-input.component';
import { DialogHeaderModule } from '@gq/shared/components/header/dialog-header/dialog-header.module';
import {
  CASE_CREATION_TYPES,
  CaseCreationEventParams,
  EVENT_NAMES,
} from '@gq/shared/models';
import { AutocompleteSearch, IdValue } from '@gq/shared/models/search';
import { TranslocoService } from '@jsverse/transloco';
import { PushPipe } from '@ngrx/component';
import { Store } from '@ngrx/store';

import { ApplicationInsightsService } from '@schaeffler/application-insights';
import { LoadingSpinnerModule } from '@schaeffler/loading-spinner';
import { SharedTranslocoModule } from '@schaeffler/transloco';

@Component({
  selector: 'gq-import-case',
  templateUrl: './import-case.component.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    SharedTranslocoModule,
    SapIdAutoCompleteInputComponent,
    PushPipe,
    MatButtonModule,
    LoadingSpinnerModule,
    DialogHeaderModule,
  ],
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
    this.store.dispatch(resetAllAutocompleteOptions());

    this.insightsService.logEvent(EVENT_NAMES.CASE_CREATION_CANCELLED, {
      type: CASE_CREATION_TYPES.SAP_IMPORT,
    } as CaseCreationEventParams);
  }

  ngOnInit(): void {
    this.quotation$ = this.store.select(getCaseQuotation);
    this.createCaseLoading$ = this.store.select(getCreateCaseLoading);
    this.quotationAutocompleteLoading$ = this.store.select(
      getCaseAutocompleteLoading(FilterNames.SAP_QUOTATION)
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
