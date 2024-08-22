export interface CalculationResultMessage {
  translationKey?: string;
  text?: string;
  messageType?: 'error' | 'info' | 'warning';
  links?: [{ text: string; url: string }];
}

export interface CalculationResultState {
  resultId: string;
  loading: boolean;
  messages: CalculationResultMessage[];
}
