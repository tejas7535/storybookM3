import { BasicCalculationResultState } from './calculation-result-state.model';

export interface CalculationResultPreviewItem {
  /**
   * Transloco key
   */
  title: string;

  /**
   * Transloco key
   */
  titleTooltip?: string;

  /**
   * Material SVG icon name
   */
  svgIcon?: string;

  /**
   * Material icon name
   */
  icon?: string;

  /**
   * Value(s) to display
   */
  values: (BasicCalculationResultState & {
    /**
     * Transloco key
     */
    title: string;

    /**
     * Transloco key
     */
    titleTooltip?: string;

    value?: number | string;
    unit?: string;
  })[];
}

export type CalculationResultPreviewData = CalculationResultPreviewItem[];
