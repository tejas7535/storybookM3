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
