import { IStatusPanelParams } from 'ag-grid-enterprise';

export type isCaseViewParams = IStatusPanelParams & {
  isCaseView: boolean;
  isNewCaseCreationView?: boolean;
};
