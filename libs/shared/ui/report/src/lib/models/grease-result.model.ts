export interface GreaseResultData {
  title: string;
  tooltip?: string;
  values: string;
}

export type GreaseResultDataSourceItem = GreaseResultData | undefined;

export interface GreaseResult {
  mainTitle: string;
  subTitle: string;
  dataSource: GreaseResultDataSourceItem[];
}
