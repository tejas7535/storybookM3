export interface CalculationResultReportInput {
  hasNestedStructure: boolean;
  meaningfulRound?: boolean;
  title?: string;
  designation?: string;
  abbreviation?: string;
  unit?: string;
  value?: string;
  subItems?: CalculationResultReportInput[];
  titleID?: string;
}
