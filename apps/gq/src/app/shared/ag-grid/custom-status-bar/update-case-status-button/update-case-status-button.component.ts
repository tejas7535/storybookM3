import { Component, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { OverviewCasesFacade } from '@gq/core/store/overview-cases/overview-cases.facade';
import { HashMap, translate } from '@jsverse/transloco';

import { ConfirmationModalComponent } from '../../../components/modal/confirmation-modal/confirmation-modal.component';
import { ConfirmationModalData } from '../../../components/modal/confirmation-modal/models/confirmation-modal-data.model';
import { IdValue } from '../../../components/modal/confirmation-modal/models/id-value.model';
import { QuotationStatus, ViewQuotation } from '../../../models/quotation';
import { ExtendedStatusPanelComponentParams } from '../quotation-details-status/model/status-bar.model';
import { ButtonType } from './button-type.enum';
@Component({
  selector: 'gq-update-case-status-button',
  templateUrl: './update-case-status-button.component.html',
})
export class UpdateCaseStatusButtonComponent {
  private readonly dialog = inject(MatDialog);
  private readonly overviewCasesFacade = inject(OverviewCasesFacade);
  private params: ExtendedStatusPanelComponentParams;
  private readonly translationPath = `caseView.confirmDialog`;

  readonly buttonDisplayType = ButtonType;
  isOnlyVisibleOnSelection = false;
  hasPanelCaption = true;
  panelCaption = '';
  panelIcon = '';
  classes = '';
  buttonColor = '';
  buttonType: ButtonType = ButtonType.unset;
  showDialog = false;
  selections: ViewQuotation[] = [];

  agInit(params: ExtendedStatusPanelComponentParams): void {
    this.params = params;
    this.isOnlyVisibleOnSelection =
      this.params.isOnlyVisibleOnSelection ?? false;
    this.hasPanelCaption = this.params.hasPanelCaption ?? true;
    this.panelCaption = translate(
      `shared.customStatusBar.buttons.panelButtons.${QuotationStatus[
        this.params.quotationStatus
      ].toLowerCase()}`
    );
    this.panelIcon = this.params.panelIcon ?? '';
    this.classes = this.params.classes ?? '';
    this.buttonColor = this.params.buttonColor ?? 'primary';
    this.buttonType = this.params.buttonType ?? ButtonType.matStrokeButton;
    this.showDialog = this.params.showDialog ?? false;

    this.params.api.addEventListener(
      'selectionChanged',
      this.onSelectionChange.bind(this)
    );
  }
  onSelectionChange(): void {
    this.selections = this.params.api.getSelectedRows();
  }

  updateStatus(): void {
    const list: IdValue[] = this.selections.map((item: ViewQuotation) => ({
      id: `${item.gqId}`,
      value: item.customerName,
    }));

    if (this.showDialog) {
      this.updateAndShowConfirmDialog(list);
    } else {
      this.update(this.selections.map((item) => item.gqId));
    }
  }

  /**
   * update the status of the case with confirmation dialog
   *
   * @param list list of gqIds
   */
  private updateAndShowConfirmDialog(list: IdValue[]) {
    const title = this.getTranslation('displayText', { variable: list.length });
    const confirmButtonText = this.getTranslation('confirmButton');
    const cancelButtonText = this.getTranslation('cancelButton');

    const data: ConfirmationModalData = {
      title,
      confirmButtonText,
      cancelButtonText,
      contentList: list,
      confirmButtonIcon: this.params.confirmDialogIcon,
    };
    const dialogRef = this.dialog.open(ConfirmationModalComponent, {
      maxHeight: '80%',
      width: '40%',
      data,
      autoFocus: false,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const gqIds = list.map((el) => Number(el.id));
        this.update(gqIds);
      }
    });
  }

  private getTranslation(key: string, params?: HashMap): string {
    return translate(
      `${this.translationPath}.${key}.${this.params.quotationStatus.toLowerCase()}`,
      params
    );
  }

  /**
   * update the status of cases without confirmation dialog
   *
   * @param gqIds list of gqIds
   */
  private update(gqIds: number[]) {
    this.overviewCasesFacade.updateCasesStatus(
      gqIds,
      this.params.quotationStatus
    );
  }
}
