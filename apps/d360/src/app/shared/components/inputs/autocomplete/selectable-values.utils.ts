/**
 * The SelectableValue Interface
 *
 * @export
 * @interface SelectableValue
 */
export interface SelectableValue {
  id: string;
  text: string;
}

/**
 * The ResolveSelectableValueResult Interface.
 *
 * @export
 * @interface ResolveSelectableValueResult
 */
export interface ResolveSelectableValueResult {
  id: string;
  selectableValue?: SelectableValue;
  error?: string[];
}

/**
 * This class contains util functions to handle Selectable Values
 *
 * @export
 * @class SelectableValueUtils
 */
// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class SelectableValueUtils {
  /**
   * Returns true | false, if the value is a selectable value.
   *
   * @export
   * @param {(string | Partial<SelectableValue> | null | undefined)} value
   * @return {value is SelectableValue}
   */
  public static isSelectableValue(
    value: string | Partial<SelectableValue> | null | undefined
  ): value is SelectableValue {
    if (!value) {
      return false;
    }

    return (
      (value as SelectableValue).id !== undefined &&
      (value as SelectableValue).text !== undefined
    );
  }

  /**
   * Maps the (SelectableValue) options, if possible
   *
   * @export
   * @param {(string[] | SelectableValue[] | undefined)} initialValues
   * @param {(SelectableValue[] | undefined)} options
   * @return {SelectableValue[]}
   */
  public static mapToOptionsIfPossible(
    initialValues: string[] | SelectableValue[] | undefined,
    options: SelectableValue[] | undefined
  ): SelectableValue[] {
    return !!initialValues && !!options
      ? initialValues
          .map((value) =>
            SelectableValueUtils.matchOptionIfPossible(value, options)
          )
          .filter((option): option is SelectableValue => !!option)
      : [];
  }

  /**
   * Maps a (SelectableValue) option, if possible
   *
   * @export
   * @param {(string | Partial<SelectableValue> | null | undefined)} initialValue
   * @param {(SelectableValue[] | undefined)} options
   * @return {(SelectableValue | null)}
   */
  public static matchOptionIfPossible(
    initialValue: string | Partial<SelectableValue> | null | undefined,
    options: SelectableValue[] | undefined
  ): SelectableValue | null {
    if (initialValue === undefined) {
      return null;
    }

    // If it is already a SelectableValue, we don't need to have options
    if (SelectableValueUtils.isSelectableValue(initialValue)) {
      return initialValue;
    }

    // If there are no options, return a SelectableValue with the string we have as both id and text
    // because its better to show what we have than show nothing at all
    if (typeof initialValue === 'string' && options === undefined) {
      return { id: initialValue, text: initialValue };
    }

    // The string representation of an SelectableValue option should always be its id to be unique.
    // This means the option can be found checking the id.
    return (
      options.find(
        (option) =>
          option?.id === initialValue ||
          option?.id === (initialValue as SelectableValue)?.id
      ) || null
    );
  }
}
