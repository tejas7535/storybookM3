export interface GreaseResultDataItem {
  title: string;
  tooltip?: string;
  values?: string;
  custom?: {
    selector: string;
    data?: any;
  };
}

export type GreaseResultDataSourceItem = GreaseResultDataItem | undefined;

export type GreaseResultData = GreaseResultDataSourceItem[];

export interface PreferredGreaseResult {
  id: string;
  text: string;
}

export interface GreaseResult {
  mainTitle: string;
  subTitle?: string;
  isSufficient: boolean;
  isPreferred?: boolean;
  dataSource: GreaseResultData;
}
