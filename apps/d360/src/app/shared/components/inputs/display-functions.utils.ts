import {
  SelectableValue,
  SelectableValueUtils,
} from './autocomplete/selectable-values.utils';

/**
 * This type can be used for callback function declarations.
 *
 * @type {DisplayFunction}
 */
export type DisplayFunction = (option: SelectableValue | string) => string;

/**
 * This class contains the default functions to render options and values in Form Fields.
 *
 * @export
 * @class DisplayFunctions
 */
// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class DisplayFunctions {
  /**
   * Show just the id.
   *
   * @static
   * @param {(SelectableValue | string)} option
   * @return {string}
   * @memberof DisplayFunctions
   */
  public static displayFnId(option: SelectableValue | string): string {
    if (typeof option === 'string') {
      return option;
    } else if (SelectableValueUtils.isSelectableValue(option)) {
      return option.id || '-';
    }

    return '-';
  }

  /**
   * Show just the text.
   *
   * @static
   * @param {(SelectableValue | string)} option
   * @return {string}
   * @memberof DisplayFunctions
   */
  public static displayFnText(option: SelectableValue | string): string {
    if (typeof option === 'string') {
      return option;
    } else if (SelectableValueUtils.isSelectableValue(option)) {
      return option?.text || '-';
    }

    return '-';
  }

  /**
   * Combine the id and the text.
   *
   * @static
   * @param {(SelectableValue | string)} option
   * @return {string}
   * @memberof DisplayFunctions
   */
  public static displayFnUnited(option: SelectableValue | string): string {
    if (typeof option === 'string') {
      return option;
    } else if (SelectableValueUtils.isSelectableValue(option)) {
      return `${option?.id} - ${option?.text}` || '-';
    }

    return '-';
  }

  /**
   * Combine the id and the text. When the option is null, return an empty string.
   *
   * @static
   * @param {(SelectableValue | string)} option
   * @return {string}
   * @memberof DisplayFunctions
   */
  public static displayFnUnitedNullable(
    option: SelectableValue | string
  ): string {
    if (typeof option === 'string') {
      return option;
    } else if (SelectableValueUtils.isSelectableValue(option)) {
      return `${option?.id} - ${option?.text}` || '-';
    }

    return '';
  }
}

/**
 * @deprecated use DisplayFunctions.displayFnText instead
 */
export function displayFnText(option: SelectableValue | string): string {
  return DisplayFunctions.displayFnText(option);
}
