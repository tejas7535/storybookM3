import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

import { BehaviorSubject, combineLatest, map, Observable } from 'rxjs';

import { ActiveCaseFacade } from '@gq/core/store/active-case/active-case.facade';
import { RolesFacade } from '@gq/core/store/facades';
import { ConfirmationModalComponent } from '@gq/shared/components/modal/confirmation-modal/confirmation-modal.component';
import { SharedDirectivesModule } from '@gq/shared/directives/shared-directives.module';
import { QuotationDetail } from '@gq/shared/models';
import { HashMap, translate, TranslocoModule } from '@jsverse/transloco';
import { PushPipe } from '@ngrx/component';
import { IStatusPanelParams } from 'ag-grid-community';

import { ConfirmationModalData } from '../../../components/modal/confirmation-modal/models/confirmation-modal-data.model';
import { Quotation } from '../../../models';

@Component({
  selector: 'gq-delete-items-button',
  standalone: true,
  imports: [
    MatTooltipModule,
    MatIconModule,
    PushPipe,
    CommonModule,
    MatButtonModule,
    TranslocoModule,
    SharedDirectivesModule,
  ],
  templateUrl: './delete-items-button.component.html',
})
export class DeleteItemsButtonComponent {
  private readonly dialog: MatDialog = inject(MatDialog);
  private readonly rolesFacade: RolesFacade = inject(RolesFacade);
  private readonly activeCaseFacade = inject(ActiveCaseFacade);
  private readonly translationPath = `processCaseView.confirmDeletePositions.`;
  private readonly toolPanelOpened$$: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);
  private params: IStatusPanelParams;

  icon = 'delete';
  selections: QuotationDetail[] = [];
  quotation: Quotation;
  toolTipText: string;
  isDeleteButtonDisabled: boolean;

  buttonVisible$: Observable<boolean> = combineLatest([
    this.rolesFacade.userHasGeneralDeletePositionsRole$,
    this.rolesFacade.loggedInUserId$,
  ]).pipe(
    map(
      ([isAllowed, loggedInUser]) =>
        // user can delete positions of any case when either having rolesFacade.userHasDeletePositions$ or when the case is created by the loggedInUser
        isAllowed || loggedInUser === this.quotation?.gqCreatedByUser?.id
    )
  );
  deleteButtonClass$: Observable<string> = this.toolPanelOpened$$.pipe(
    map((isOpen) =>
      isOpen ? 'panel-opened right-60' : 'panel-closed right-12'
    )
  );

  agInit(params: IStatusPanelParams): void {
    this.params = params;
    this.quotation = this.params.context.quotation;
    this.params.api.addEventListener('gridReady', this.onGridReady.bind(this));
    this.params.api.addEventListener(
      'selectionChanged',
      this.onSelectionChange.bind(this)
    );
    this.params.api.addEventListener(
      'toolPanelVisibleChanged',
      this.onToolPanelVisibleChanged.bind(this)
    );
  }

  onGridReady(): void {
    this.selections = this.params.api.getSelectedRows();
  }

  onSelectionChange(): void {
    this.selections = this.params.api.getSelectedRows();

    // if only RFQ details are selected button is disabled, otherwise rfq details are filtered out before opening the confirmation dialog
    const rfqAmount = this.selections.filter((d) => d.rfqData).length;
    this.isDeleteButtonDisabled = rfqAmount === this.selections.length;
    this.toolTipText = this.isDeleteButtonDisabled
      ? this.getTranslation('onlyRfqDetailsSelectedToolTip', {
          multipleSelected: rfqAmount > 1,
        })
      : undefined;
  }

  onToolPanelVisibleChanged(): void {
    this.toolPanelOpened$$.next(!!this.params.api.getOpenedToolPanel());
  }

  deletePositions(): void {
    const rfqDetails: QuotationDetail[] = [];
    const nonRfqDetails: QuotationDetail[] = [];
    this.selections.forEach((value) =>
      value.rfqData ? rfqDetails.push(value) : nonRfqDetails.push(value)
    );
    const dialogRef = this.dialog.open(ConfirmationModalComponent, {
      data: this.getConfirmModalData(rfqDetails),
      // maxWidth is defined in figma design
      maxWidth: 711,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.activeCaseFacade.removePositionsFromQuotation(
          nonRfqDetails.map((detail) => detail.gqPositionId)
        );

        this.params.api.deselectAll();
      }
    });
  }

  private getConfirmModalData(
    rfqDetails: QuotationDetail[]
  ): ConfirmationModalData {
    const titleTranslationKey = this.quotation?.sapId
      ? `sapTitle`
      : `defaultTitle`;
    const amountNonRfqDetailsSelected =
      this.selections.length - rfqDetails.length;

    const title = this.getTranslation(titleTranslationKey, {
      multipleSelected: amountNonRfqDetailsSelected > 1,
      count: amountNonRfqDetailsSelected,
    });
    const subtitle =
      rfqDetails.length > 0
        ? this.getTranslation('subTitle', {
            multipleSelected: rfqDetails.length > 1,
          })
        : null;
    const infoBannerText = this.getTranslation('infoBannerText');
    const confirmButtonText = this.getTranslation('deleteButtonText');
    const cancelButtonText = this.getTranslation('cancelButtonText');

    const contentList = rfqDetails.map((item) => ({
      id: `Item ${item.quotationItemId}`,
      value: `${item.material.materialNumber15} | ${item.material.materialDescription}`,
    }));

    const data: ConfirmationModalData = {
      title,
      subtitle,
      infoBannerText,
      confirmButtonText,
      cancelButtonText,
      contentList,
      confirmButtonIcon: this.icon,
    };

    return data;
  }

  private getTranslation(key: string, params?: HashMap): string {
    return translate(`${this.translationPath}${key}`, params);
  }
}
