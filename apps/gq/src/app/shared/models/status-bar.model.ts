import { IStatusPanelParams } from 'ag-grid-community';

import { ButtonType } from '../ag-grid/custom-status-bar/update-case-status-button/button-type.enum';
import { QuotationStatus } from './quotation';

export class StatusBar {
  constructor(
    public total = new StatusBarProperties(),
    public selected = new StatusBarProperties(),
    public filtered = 0
  ) {}
}

export class StatusBarProperties {
  constructor(
    public netValue = 0,
    public gpi = 0,
    public gpm = 0,
    public priceDiff = null as number,
    public rows = 0
  ) {}
}

export type ExtendedStatusPanelComponentParams = IStatusPanelParams & {
  quotationStatus: QuotationStatus;
  hasPanelCaption?: boolean;
  isOnlyVisibleOnSelection?: boolean;
  buttonColor?: string;
  buttonType?: ButtonType;
  showDialog?: boolean;
  panelIcon?: string;
  classes?: string;
  confirmDialogIcon?: string;
};
