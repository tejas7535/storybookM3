import { StatusPanelDef } from 'ag-grid-community';

import { UpdateCaseStatusButtonComponent } from '../../../shared/ag-grid/custom-status-bar/update-case-status-button/update-case-status-button.component';
import {
  ExtendedStatusPanelComponentParams,
  QuotationStatus,
} from '../../../shared/models';

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
        quotationStatus: QuotationStatus.INACTIVE,
        isOnlyVisibleOnSelection: true,
        showDialog: true,
        hasPanelCaption: false,
        panelIcon: 'delete',
        classes: 'fixed bottom-36 right-8',
        buttonType: 'mat-fab',
      } as ExtendedStatusPanelComponentParams,
      align: 'right',
    },
  ],
};

export const INACTIVE_STATUS_BAR_CONFIG: {
  statusPanels: StatusPanelDef[];
} = {
  statusPanels: [
    {
      statusPanel: UpdateCaseStatusButtonComponent,
      statusPanelParams: {
        quotationStatus: QuotationStatus.ACTIVE,
        panelIcon: 'restore_from_trash',
        classes: '!ml-4 !mb-4 !mt-4',
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
      } as ExtendedStatusPanelComponentParams,
      align: 'right',
    },
  ],
};
