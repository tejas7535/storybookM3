import { BasicCalculationResultState } from './calculation-result-state.model';

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
  values: (BasicCalculationResultState & {
    /**
     * Transloco key
     */
    title: string;

    value?: number;
    unit?: string;
  })[];
}

export type CalculationResultPreviewData = CalculationResultPreviewItem[];
