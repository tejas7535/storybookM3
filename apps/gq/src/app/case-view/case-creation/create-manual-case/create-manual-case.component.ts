import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

import { Observable, Subject, takeUntil } from 'rxjs';

import {
  clearCreateCaseRowData,
  clearCustomer,
  resetAllAutocompleteOptions,
} from '@gq/core/store/actions';
import { AutoCompleteFacade } from '@gq/core/store/facades';
import { PurchaseOrderTypeFacade } from '@gq/core/store/purchase-order-type/purchase-order-type.facade';
import {
  getCaseRowData,
  getCreateCaseLoading,
} from '@gq/core/store/selectors/create-case/create-case.selector';
import { AutocompleteRequestDialog } from '@gq/shared/components/autocomplete-input/autocomplete-request-dialog.enum';
import {
  CASE_CREATION_TYPES,
  CaseCreationEventParams,
  EVENT_NAMES,
  PurchaseOrderType,
} from '@gq/shared/models';
import { MaterialTableItem } from '@gq/shared/models/table';
import { TranslocoService } from '@ngneat/transloco';
import { Store } from '@ngrx/store';

import { ApplicationInsightsService } from '@schaeffler/application-insights';

@Component({
  selector: 'gq-create-manual-case',
  templateUrl: './create-manual-case.component.html',
})
export class CreateManualCaseComponent implements OnDestroy, OnInit {
  createCaseLoading$: Observable<boolean>;
  rowData$: Observable<MaterialTableItem[]>;
  title$: Observable<string>;

  private readonly shutdown$$: Subject<void> = new Subject<void>();

  constructor(
    private readonly store: Store,
    private readonly dialogRef: MatDialogRef<CreateManualCaseComponent>,
    private readonly translocoService: TranslocoService,
    private readonly insightsService: ApplicationInsightsService,
    private readonly purchaseOrderTypeFacade: PurchaseOrderTypeFacade,
    public readonly autocompleteFacade: AutoCompleteFacade
  ) {
    this.title$ = this.translocoService.selectTranslate(
      'caseCreation.createManualCase.title',
      {},
      'case-view'
    );
  }

  ngOnInit(): void {
    this.autocompleteFacade.resetView();
    this.autocompleteFacade.initFacade(AutocompleteRequestDialog.ADD_ENTRY);

    this.createCaseLoading$ = this.store.select(getCreateCaseLoading);
    this.rowData$ = this.store.select(getCaseRowData);

    this.insightsService.logEvent(EVENT_NAMES.CASE_CREATION_STARTED, {
      type: CASE_CREATION_TYPES.MANUAL,
    } as CaseCreationEventParams);

    this.dialogRef
      .beforeClosed()
      .pipe(takeUntil(this.shutdown$$))
      .subscribe(() => {
        this.dispatchResetActions();
      });
  }

  purchaseOrderTypeChanged(purchaseOrderType: PurchaseOrderType): void {
    this.purchaseOrderTypeFacade.selectPurchaseOrderTypeForCaseCreation(
      purchaseOrderType
    );
  }

  ngOnDestroy(): void {
    this.shutdown$$.next();
    this.shutdown$$.unsubscribe();
  }

  closeDialog(): void {
    this.dialogRef.close();
    this.insightsService.logEvent(EVENT_NAMES.CASE_CREATION_CANCELLED, {
      type: CASE_CREATION_TYPES.MANUAL,
    } as CaseCreationEventParams);
  }

  private dispatchResetActions(): void {
    this.store.dispatch(resetAllAutocompleteOptions());
    this.store.dispatch(clearCustomer());
    this.store.dispatch(clearCreateCaseRowData());
  }
}
