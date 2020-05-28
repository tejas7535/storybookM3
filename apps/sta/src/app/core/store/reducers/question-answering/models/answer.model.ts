export interface Answer {
  answer: string;
  exactMatch: string;
  logit: number;
  paragraphStart: number;
  paragraphEnd: number;
  confidenceAnswerIndex?: number;
  reengagementMessageIndex?: number;
  textInput?: string;
}
