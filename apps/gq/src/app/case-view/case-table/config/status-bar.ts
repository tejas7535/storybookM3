import { CreateCustomerCaseButtonComponent } from '@gq/shared/ag-grid/custom-status-bar/case-view/create-customer-case-button/create-customer-case-button.component';
import { CreateManualCaseButtonComponent } from '@gq/shared/ag-grid/custom-status-bar/case-view/create-manual-case-button/create-manual-case-button.component';
import { ImportCaseButtonComponent } from '@gq/shared/ag-grid/custom-status-bar/case-view/import-case-button/import-case-button.component';
import { ExtendedStatusPanelComponentParams } from '@gq/shared/ag-grid/custom-status-bar/quotation-details-status/model/status-bar.model';
import { ButtonType } from '@gq/shared/ag-grid/custom-status-bar/update-case-status-button/button-type.enum';
import { UpdateCaseStatusButtonComponent } from '@gq/shared/ag-grid/custom-status-bar/update-case-status-button/update-case-status-button.component';
import { QuotationStatus } from '@gq/shared/models/quotation';
import { StatusPanelDef } from 'ag-grid-community';

export const ACTIVE_STATUS_BAR_CONFIG: {
  statusPanels: StatusPanelDef[];
} = {
  statusPanels: [
    { statusPanel: ImportCaseButtonComponent, align: 'right' },
    { statusPanel: CreateCustomerCaseButtonComponent, align: 'right' },
    { statusPanel: CreateManualCaseButtonComponent, align: 'right' },

    {
      statusPanel: UpdateCaseStatusButtonComponent,
      statusPanelParams: {
        quotationStatus: QuotationStatus.ARCHIVED,
        isOnlyVisibleOnSelection: true,
        showDialog: true,
        hasPanelCaption: false,
        confirmDialogIcon: 'delete',
        panelIcon: 'delete',
        classes: 'absolute bottom-20 right-4 delete-button-open-cases-tab',
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
