import { Value } from './value.model';

export interface LabelValue {
  /**
   * Set the text of the label
   */
  label: string;

  /**
   * Add an optional hint as tooltip in the label area
   */
  labelHint?: string;

  /**
   * Set a single value
   */
  value?: string;

  /**
   * Set an array of value objects
   */
  values?: Value[];

  /**
   * Set an optional additional classes for the value area
   */
  valueAdditionalClass?: string;

  /**
   * Set an optional row where html can be shown
   */
  custom?: {
    selector: string;
    data?: any;
  };
}
