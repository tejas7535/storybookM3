import { StatusPanelDef } from '@ag-grid-community/all-modules';

export const STATUS_BAR_CONFIG: {
  statusPanels: StatusPanelDef[];
} = {
  statusPanels: [
    { statusPanel: 'openCaseButtonComponent', align: 'left' },
    { statusPanel: 'deleteCaseButtonComponent', align: 'left' },
    { statusPanel: 'importCaseButtonComponent', align: 'left' },
    { statusPanel: 'createManualCaseButtonComponent', align: 'left' },
    { statusPanel: 'createCustomerCaseButtonComponent', align: 'left' },
  ],
};
