import { IStatusPanelParams } from 'ag-grid-community';

import { QuotationStatus } from './quotation';

export class StatusBar {
  constructor(
    public total = new StatusBarProperties(),
    public selected = new StatusBarProperties()
  ) {}
}

export class StatusBarProperties {
  constructor(
    public netValue = 0,
    public gpi = 0,
    public gpm = 0,
    public priceDiff = 0,
    public rows = 0
  ) {}
}

export type ExtendedStatusPanelComponentParams = IStatusPanelParams & {
  quotationStatus: QuotationStatus;
  hasPanelCaption?: boolean;
  isOnlyVisibleOnSelection?: boolean;
  buttonColor?: string;
  buttonType?: string;
  showDialog?: boolean;
  panelIcon?: string;
  classes?: string;
  confirmDialogIcon?: string;
};
