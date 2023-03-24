export interface CalculationResultState {
  co2: {
    upstream: number;
    downstream: number;
  };
  ratingLife: number;
  isResultAvailable: boolean;
  isCalculationImpossible: boolean;
}

export interface CalculationResultPreviewItem {
  /**
   * Transloco key
   */
  title: string;

  /**
   * Material icon name
   */
  icon: string;

  /**
   * Value(s) to display
   */
  values: {
    /**
     * Transloco key
     */
    title: string;
    value: number;

    /**
     * Transloco key
     */
    unit: string;
  }[];
}

export type CalculationResultPreviewData = CalculationResultPreviewItem[];
