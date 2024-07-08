import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { BehaviorSubject, combineLatest, map, Observable } from 'rxjs';

import { ActiveCaseActions } from '@gq/core/store/active-case/active-case.action';
import { RolesFacade } from '@gq/core/store/facades';
import { ConfirmationModalComponent } from '@gq/shared/components/modal/confirmation-modal/confirmation-modal.component';
import { QuotationDetail } from '@gq/shared/models';
import { translate } from '@jsverse/transloco';
import { Store } from '@ngrx/store';
import { IStatusPanelParams } from 'ag-grid-community';

import { ConfirmationModalData } from '../../../components/modal/confirmation-modal/models/confirmation-modal-data.model';
import { Quotation, QuotationStatus } from '../../../models';

@Component({
  selector: 'gq-delete-items-button',
  templateUrl: './delete-items-button.component.html',
})
export class DeleteItemsButtonComponent {
  selections: any[] = [];
  icon = 'delete';
  isSapQuotation: boolean;
  quotationStatus = QuotationStatus;
  quotationCreatedBy: string;

  buttonVisible$: Observable<boolean> = combineLatest([
    this.rolesFacade.userHasGeneralDeletePositionsRole$,
    this.rolesFacade.loggedInUserId$,
  ]).pipe(
    map(
      ([isAllowed, loggedInUser]) =>
        // user can delete positions of any case when either having rolesFacade.userHasDeletePositions$ or when the case is created by the loggedInUser
        isAllowed || loggedInUser === this.quotationCreatedBy
    )
  );
  private readonly toolPanelOpened$$: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);
  deleteButtonClass$: Observable<string> = this.toolPanelOpened$$.pipe(
    map((isOpen) =>
      isOpen ? 'panel-opened right-60' : 'panel-closed right-12'
    )
  );
  private params: IStatusPanelParams;

  public constructor(
    private readonly store: Store,
    private readonly dialog: MatDialog,
    private readonly rolesFacade: RolesFacade
  ) {}

  agInit(params: IStatusPanelParams): void {
    this.params = params;
    this.isSapQuotation =
      (params.context.quotation as Quotation).sapId !== undefined;
    this.params.api.addEventListener('gridReady', this.onGridReady.bind(this));
    this.params.api.addEventListener(
      'selectionChanged',
      this.onSelectionChange.bind(this)
    );
    this.params.api.addEventListener(
      'toolPanelVisibleChanged',
      this.onToolPanelVisibleChanged.bind(this)
    );

    this.quotationCreatedBy = (
      params.context.quotation as Quotation
    )?.gqCreatedByUser?.id;
  }

  onGridReady(): void {
    this.selections = this.params.api.getSelectedRows();
  }

  onSelectionChange(): void {
    this.selections = this.params.api.getSelectedRows();
  }

  onToolPanelVisibleChanged(): void {
    this.toolPanelOpened$$.next(!!this.params.api.getOpenedToolPanel());
  }

  deletePositions(): void {
    const gqPositionIds: string[] = this.selections.map(
      (value: QuotationDetail) => value.gqPositionId
    );
    const displayText = translate(
      `processCaseView.confirmDeletePositions.${
        this.isSapQuotation ? `sapText` : `text`
      }`,
      { variable: gqPositionIds.length }
    );
    const infoText = translate(
      'processCaseView.confirmDeletePositions.infoText'
    );

    const confirmButton = translate(
      'processCaseView.confirmDeletePositions.deleteButton'
    );

    const cancelButton = translate(
      'processCaseView.confirmDeletePositions.cancelButton'
    );

    const data: ConfirmationModalData = {
      displayText,
      confirmButton,
      cancelButton,
      infoText,
      icon: this.icon,
    };
    const dialogRef = this.dialog.open(ConfirmationModalComponent, {
      data,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.store.dispatch(
          ActiveCaseActions.removePositionsFromQuotation({ gqPositionIds })
        );
        this.selections = [];
      }
    });
  }
}
