import { Value } from './value.model';

export interface LabelValue {
  /**
   * Set the text of the label
   */
  label: string;

  /**
   * Set a single value
   */
  value?: string;

  /**
   * Set an array of value objects
   */
  values?: Value[];

  /**
   * Set an optional text class for the value area
   */
  valueTextClass?: string;
}
