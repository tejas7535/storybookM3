export interface CalculationResultReportInput {
  identifier: string;
  title?: string;
  designation?: string;
  abbreviation?: string;
  unit?: string;
  value?: string;
  subordinates?: CalculationResultReportInput[];
}
