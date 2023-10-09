import { ButtonType } from '@gq/shared/ag-grid/custom-status-bar/update-case-status-button/button-type.enum';
import { UpdateCaseStatusButtonComponent } from '@gq/shared/ag-grid/custom-status-bar/update-case-status-button/update-case-status-button.component';
import {
  ExtendedStatusPanelComponentParams,
  QuotationStatus,
} from '@gq/shared/models';
import { StatusPanelDef } from 'ag-grid-community';

export const ACTIVE_STATUS_BAR_CONFIG: {
  statusPanels: StatusPanelDef[];
} = {
  statusPanels: [
    { statusPanel: 'importCaseButtonComponent', align: 'left' },
    { statusPanel: 'createManualCaseButtonComponent', align: 'left' },
    { statusPanel: 'createCustomerCaseButtonComponent', align: 'left' },
    {
      statusPanel: UpdateCaseStatusButtonComponent,
      statusPanelParams: {
        quotationStatus: QuotationStatus.ARCHIVED,
        isOnlyVisibleOnSelection: true,
        showDialog: true,
        hasPanelCaption: false,
        confirmDialogIcon: 'delete',
        panelIcon: 'delete',
        classes: 'fixed bottom-36 right-8',
        buttonType: ButtonType.matFab,
      } as ExtendedStatusPanelComponentParams,
      align: 'right',
    },
  ],
};

export const ARCHIVED_STATUS_BAR_CONFIG: {
  statusPanels: StatusPanelDef[];
} = {
  statusPanels: [
    {
      statusPanel: UpdateCaseStatusButtonComponent,
      statusPanelParams: {
        quotationStatus: QuotationStatus.ACTIVE,
        panelIcon: 'restore_from_trash',
        classes: '!ml-4 !mb-4 !mt-4',
        buttonType: ButtonType.matStrokeButton,
      } as ExtendedStatusPanelComponentParams,
      align: 'left',
    },
    {
      statusPanel: UpdateCaseStatusButtonComponent,
      statusPanelParams: {
        quotationStatus: QuotationStatus.DELETED,
        panelIcon: 'delete_forever',
        classes: '!mr-4 !mb-4 !mt-4',
        showDialog: true,
        confirmDialogIcon: 'delete',
        buttonType: ButtonType.matStrokeButton,
      } as ExtendedStatusPanelComponentParams,
      align: 'right',
    },
  ],
};
