import { QuotationDetailsSummaryKpi } from '@gq/shared/models/quotation/quotation-details-summary-kpi.model';
import { IStatusPanelParams } from 'ag-grid-enterprise';

import { QuotationStatus } from '../../../../models/quotation';
import { ButtonType } from '../../update-case-status-button/button-type.enum';

export class StatusBar {
  constructor(
    public total = new QuotationDetailsSummaryKpi(),
    public selected = new QuotationDetailsSummaryKpi(),
    public filtered = 0
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
