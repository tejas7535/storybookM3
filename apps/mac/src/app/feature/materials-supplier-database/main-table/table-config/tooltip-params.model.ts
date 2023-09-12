import { ITooltipParams } from 'ag-grid-community';

export interface TooltipParams<TData = any, TValue = any>
  extends ITooltipParams<TData, TValue> {
  /**
   * If true, the tooltip value will be used for translation in addition to the translations key root, defined in HeaderTooltipComponent.
   * Otherwise, the tooltip value will be displayed.
   */
  translate: boolean;
}
