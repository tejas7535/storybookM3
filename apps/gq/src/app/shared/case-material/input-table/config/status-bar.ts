import { StatusPanelDef } from '@ag-grid-community/all-modules';

export const STATUS_BAR_CONFIG: {
  statusPanels: StatusPanelDef[];
} = {
  statusPanels: [
    { statusPanel: 'createCaseButtonComponent', align: 'left' },
    { statusPanel: 'materialValidationStatusComponent', align: 'center' },
    { statusPanel: 'resetAllButtonComponent', align: 'right' },
  ],
};
