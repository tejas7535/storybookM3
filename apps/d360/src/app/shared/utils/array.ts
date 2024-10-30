/**
 * Returns undefined if the array passed is of length 0 or only contains empty strings.
 * Otherwise the original array is returned.
 */
export function emptyArrayToUndefined(values: string[]): string[] | undefined {
  const filteredValues = values.filter((value) => value !== '');

  return filteredValues.length === 0 ? undefined : values;
}

/**
 * Deduplicates the values in the array.
 * Will result in the order as if only the first occurence of the value exists.
 */
export function deduplicateArray(values: string[]): string[] {
  const deduped: string[] = [];

  values.forEach((val) => {
    if (!deduped.includes(val)) {
      deduped.push(val);
    }
  });

  return deduped;
}
