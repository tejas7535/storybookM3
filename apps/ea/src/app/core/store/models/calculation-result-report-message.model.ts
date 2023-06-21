export interface CalculationResultReportMessage {
  title?: string;
  item?: {
    messages?: string[];
    subItems?: CalculationResultReportMessage[];
  };
}
