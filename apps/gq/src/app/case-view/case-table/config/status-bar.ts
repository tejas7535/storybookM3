import { StatusPanelDef } from 'ag-grid-community';

export const STATUS_BAR_CONFIG: {
  statusPanels: StatusPanelDef[];
} = {
  statusPanels: [
    { statusPanel: 'importCaseButtonComponent', align: 'left' },
    { statusPanel: 'createManualCaseButtonComponent', align: 'left' },
    { statusPanel: 'createCustomerCaseButtonComponent', align: 'left' },
    { statusPanel: 'deleteCaseButtonComponent', align: 'right' },
  ],
};
