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
      return initialValue.id === initialValue.text && !!options
        ? // let's check, if we find a better version with different id/name pair otherwise return the initialValue
          options.find((option) => option?.id === initialValue.id) ||
            initialValue
        : // otherwise return the initialValue
          initialValue;
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

  /**
   * Transforms an input to a SelectableValue, SelectableValue[] or null
   *
   * @static
   * @param {(SelectableValue
   *       | SelectableValue[]
   *       | Partial<SelectableValue>
   *       | Partial<SelectableValue>[]
   *       | string
   *       | string[]
   *       | null)} value
   * @param {boolean} shouldBeArray
   * @return {(SelectableValue | SelectableValue[] | null)}
   * @memberof SelectableValueUtils
   */
  public static toSelectableValueOrNull(
    value:
      | SelectableValue
      | SelectableValue[]
      | Partial<SelectableValue>
      | Partial<SelectableValue>[]
      | string
      | string[]
      | null,
    shouldBeArray: boolean
  ): SelectableValue | SelectableValue[] | null {
    const createSelectableValue = (
      val: Partial<SelectableValue> | string | boolean
    ): SelectableValue => {
      if (typeof val === 'string') {
        return { id: val, text: val };
      }

      return { id: '', text: '' };
    };

    if (value === null || value === '' || value === undefined) {
      return shouldBeArray ? [] : null;
    }

    if (Array.isArray(value)) {
      const result: SelectableValue[] = value.map((val) => {
        if (typeof val === 'object' && val !== null) {
          return { ...createSelectableValue(val), ...val };
        }

        return createSelectableValue(val);
      });

      return shouldBeArray ? result : result[0];
    }

    if (value === null || value === undefined) {
      return shouldBeArray ? [] : createSelectableValue('');
    }

    const singleValue =
      typeof value === 'object'
        ? { ...createSelectableValue(value), ...value }
        : createSelectableValue(value);

    return shouldBeArray ? [singleValue] : singleValue;
  }
}
