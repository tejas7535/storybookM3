export interface CalculationResultState {
  calculationResult?: CalculationResult;
  modelId?: string;
  calculationId?: string;
  isLoading: boolean;
  calculationError?: string;
  isCalculationImpossible?: boolean;
}

export interface CalculationResult {
  co2_upstream?: number;
  co2_downstream?: number;
  ratingLife?: number;
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
