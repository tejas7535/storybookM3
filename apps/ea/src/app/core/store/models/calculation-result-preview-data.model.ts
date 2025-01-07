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

  loadcaseName?: string;

  /**
   * Value(s) to display
   */
  values: ResultStateWithValue[];
}

export interface ResultStateWithValue extends BasicCalculationResultState {
  /**
   * Transloco key
   */
  title?: string;

  /**
   * Transloco key
   */
  titleTooltip?: string;

  value?: number | string;
  unit?: string;

  /**
   * loadcase name for single value
   */
  valueLoadcaseName?: string;

  additionalData?: {
    [key: string]: string | number;
  };

  /**
   * flag for displaying the new badge
   */
  displayNewBadge?: boolean;
}

export type CalculationResultPreviewData = CalculationResultPreviewItem[];
