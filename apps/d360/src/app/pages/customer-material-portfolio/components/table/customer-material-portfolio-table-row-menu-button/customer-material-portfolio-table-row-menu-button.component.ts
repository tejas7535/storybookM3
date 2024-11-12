import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatMenuItem } from '@angular/material/menu';

import { ICellRendererParams } from 'ag-grid-community';
import { parseISO } from 'date-fns';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import {
  CMPData,
  parsePortfolioStatusOrNull,
  PortfolioStatus,
} from '../../../../../feature/customer-material-portfolio/cmp-modal-types';
import { CMPEntry } from '../../../../../feature/customer-material-portfolio/model';
import { RowMenuComponent } from '../../../../../shared/components/ag-grid/row-menu/row-menu.component';
import {
  CustomerMaterialChangeModalComponent,
  CustomerMaterialChangeModalData,
} from '../../modals/customer-material-change-modal/customer-material-change-modal.component';
import { CustomerMaterialSubstitutionProposalModalComponent } from '../../modals/customer-material-substitution-proposal-modal/customer-material-substitution-proposal-modal.component';
import {
  CMPChangeModalFlavor,
  CMPModal,
  CMPSpecificModal,
  statusActions,
} from '../status-actions';

@Component({
  selector: 'd360-customer-material-portfolio-table-row-menu-button',
  standalone: true,
  imports: [CommonModule, RowMenuComponent, SharedTranslocoModule, MatMenuItem],
  templateUrl:
    './customer-material-portfolio-table-row-menu-button.component.html',
  styleUrl:
    './customer-material-portfolio-table-row-menu-button.component.scss',
})
export class CustomerMaterialPortfolioTableRowMenuButtonComponent extends RowMenuComponent<CMPEntry> {
  protected currentStatus: PortfolioStatus;
  protected hasSchaefflerSuccessor: boolean;

  constructor(private readonly dialog: MatDialog) {
    super();
  }

  agInit(params: ICellRendererParams<CMPEntry>) {
    super.agInit(params);
    this.currentStatus = parsePortfolioStatusOrNull(this.data.portfolioStatus);
    this.hasSchaefflerSuccessor =
      !!this.data.successorSchaefflerMaterial &&
      this.data.successorSchaefflerMaterial !== '';
  }

  protected readonly statusActions = statusActions;

  handleActionClick(modal: CMPModal, changeToStatus: PortfolioStatus) {
    const autoSwitchDate = this.data.pfStatusAutoSwitch
      ? parseISO(this.data.pfStatusAutoSwitch)
      : null;
    const repDate = this.data.repDate ? parseISO(this.data.repDate) : null;

    const newPortfolioStatus =
      changeToStatus ?? parsePortfolioStatusOrNull(this.data.portfolioStatus);

    const data: CMPData = {
      customerNumber: this.data.customerNumber,
      materialNumber: this.data.materialNumber,
      materialDescription: this.data.materialDescription,
      demandCharacteristic: this.data.demandCharacteristic,
      portfolioStatus: newPortfolioStatus,
      autoSwitchDate,
      repDate,
      successorMaterial: this.data.successorMaterial,
      demandPlanAdoption: null,
    };

    switch (modal) {
      case CMPSpecificModal.SUBSTITUTION_PROPOSAL: {
        this.handleSubstitutionProposalModal(data, changeToStatus);
        break;
      }
      case CMPChangeModalFlavor.STATUS_TO_SUBSTITUTION:
      case CMPChangeModalFlavor.EDIT_MODAL:
      case CMPChangeModalFlavor.REVERT_SUBSTITUTION:
      case CMPChangeModalFlavor.STATUS_TO_INACTIVE:
      case CMPChangeModalFlavor.STATUS_TO_ACTIVE:
      case CMPChangeModalFlavor.STATUS_TO_PHASE_IN:
      case CMPChangeModalFlavor.STATUS_TO_PHASE_OUT: {
        this.handleChangeModal(modal, data, changeToStatus);
        break;
      }
      default: {
        // TODO implement
        break;
      }
    }

    // TODO implement
  }

  private handleSubstitutionProposalModal(
    data: CMPData,
    _?: PortfolioStatus
  ): void {
    const dialogRef = this.dialog.open(
      CustomerMaterialSubstitutionProposalModalComponent,
      {
        data,
        disableClose: true,
      }
    );

    dialogRef.afterClosed().subscribe((_result) => {
      // TODO handle result
    });
  }

  private handleChangeModal(
    modal: CMPChangeModalFlavor,
    data: CMPData,
    _?: PortfolioStatus
  ) {
    const dialogRef = this.dialog.open(CustomerMaterialChangeModalComponent, {
      data: {
        modal,
        cmpData: data,
      } as CustomerMaterialChangeModalData,
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((_result) => {
      // TODO handle result
    });
  }
}
