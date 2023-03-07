import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

import { Observable } from 'rxjs';

import {
  createCustomerCase,
  resetCustomerFilter,
  resetPLsAndSeries,
  resetProductLineAndSeries,
} from '@gq/core/store/actions';
import { AutoCompleteFacade } from '@gq/core/store/facades';
import { PLsAndSeries, SalesOrg } from '@gq/core/store/reducers/models';
import {
  getCreateCaseLoading,
  getCreateCustomerCaseDisabled,
  getProductLinesAndSeries,
  getProductLinesAndSeriesLoading,
  getSelectedCustomerId,
  getSelectedSalesOrg,
} from '@gq/core/store/selectors';
import { AutocompleteRequestDialog } from '@gq/shared/components/autocomplete-input/autocomplete-request-dialog.enum';
import { TranslocoService } from '@ngneat/transloco';
import { Store } from '@ngrx/store';

import { ApplicationInsightsService } from '@schaeffler/application-insights';

import { AutocompleteInputComponent } from '../../../shared/components/autocomplete-input/autocomplete-input.component';
import {
  CASE_CREATION_TYPES,
  CaseCreationEventParams,
  EVENT_NAMES,
} from '../../../shared/models';
import { MaterialSelectionComponent } from './material-selection/material-selection.component';

@Component({
  selector: 'gq-create-customer-case',
  templateUrl: './create-customer-case.component.html',
})
export class CreateCustomerCaseComponent implements OnInit {
  title$: Observable<string>;
  selectedSalesOrg$: Observable<SalesOrg>;
  selectedCustomerId$: Observable<string>;
  plsAndSeries$: Observable<PLsAndSeries>;
  plsAndSeriesLoading$: Observable<boolean>;
  createCaseDisabled$: Observable<boolean>;
  createCaseLoading$: Observable<boolean>;

  @ViewChild('materialSelection') materialSelection: MaterialSelectionComponent;
  @ViewChild('autocompleteComponent')
  autocompleteComponent: AutocompleteInputComponent;

  constructor(
    private readonly store: Store,
    private readonly dialogRef: MatDialogRef<CreateCustomerCaseComponent>,
    private readonly translocoService: TranslocoService,
    private readonly insightsService: ApplicationInsightsService,
    public readonly autocompleteFacade: AutoCompleteFacade
  ) {
    this.title$ = this.translocoService.selectTranslate(
      'caseCreation.createCustomerCase.title',
      {},
      'case-view'
    );

    this.insightsService.logEvent(EVENT_NAMES.CASE_CREATION_STARTED, {
      type: CASE_CREATION_TYPES.FROM_CUSTOMER,
    } as CaseCreationEventParams);
  }

  ngOnInit(): void {
    this.autocompleteFacade.resetView();
    this.autocompleteFacade.initFacade(AutocompleteRequestDialog.ADD_ENTRY);

    this.selectedSalesOrg$ = this.store.select(getSelectedSalesOrg);
    this.selectedCustomerId$ = this.store.select(getSelectedCustomerId);
    this.plsAndSeries$ = this.store.select(getProductLinesAndSeries);
    this.plsAndSeriesLoading$ = this.store.select(
      getProductLinesAndSeriesLoading
    );
    this.createCaseDisabled$ = this.store.select(getCreateCustomerCaseDisabled);
    this.createCaseLoading$ = this.store.select(getCreateCaseLoading);
  }

  closeDialog(): void {
    this.dialogRef.close();
    this.store.dispatch(resetCustomerFilter());
    this.store.dispatch(resetPLsAndSeries());

    this.insightsService.logEvent(EVENT_NAMES.CASE_CREATION_CANCELLED, {
      type: CASE_CREATION_TYPES.FROM_CUSTOMER,
    } as CaseCreationEventParams);
  }

  createCase(): void {
    this.store.dispatch(createCustomerCase());

    this.insightsService.logEvent(EVENT_NAMES.CASE_CREATION_FINISHED, {
      type: CASE_CREATION_TYPES.FROM_CUSTOMER,
    } as CaseCreationEventParams);
  }

  resetAll(): void {
    this.materialSelection.resetAll();
    this.autocompleteComponent.resetInputField();
    this.store.dispatch(resetProductLineAndSeries());
  }
}
