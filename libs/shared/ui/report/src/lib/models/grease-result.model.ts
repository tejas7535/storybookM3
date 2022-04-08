export interface GreaseResultData {
  title: string;
  tooltip?: string;
  values: string;
  display?: boolean;
}

export interface GreaseResult {
  title: string;
  subtitlePart1: string;
  subtitlePart2: string;
  subtitlePart3: string;
  dataSource: GreaseResultData[] | any;
  showValues: boolean;
  displayedColumns: string[];
}
