export interface MarketValueDriverDisplayItem {
  questionId: number;
  options: MarketValueDriverOptionItem[];
}

export interface MarketValueDriverOptionItem {
  optionId: number;
  selected: boolean;
}
