export interface GreaseResultDataItem {
  title: string;
  tooltip?: string;
  values: string;
}

export type GreaseResultDataSourceItem = GreaseResultDataItem | undefined;

export type GreaseResultData = GreaseResultDataSourceItem[];

export interface GreaseResult {
  mainTitle: string;
  subTitle: string;
  isSufficient: boolean;
  dataSource: GreaseResultData;
}
