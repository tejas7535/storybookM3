import { IStatusPanelParams } from 'ag-grid-community';

export type isCaseViewParams = IStatusPanelParams & {
  isCaseView: boolean;
  isNewCaseCreationView?: boolean;
};
