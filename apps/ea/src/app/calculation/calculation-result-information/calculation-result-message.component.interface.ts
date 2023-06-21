export interface ICalculationResultMessageComponent {
  title?: string;
  item?: {
    messages?: string[];
    subItems?: ICalculationResultMessageComponent[];
  };
}
