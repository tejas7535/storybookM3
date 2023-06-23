export interface CalculationResultReportInput {
  hasNestedStructure: boolean;
  title?: string;
  designation?: string;
  abbreviation?: string;
  unit?: string;
  value?: string;
  subItems?: CalculationResultReportInput[];
}
