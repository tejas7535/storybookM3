export const arrayEquals = (array1: unknown[], array2: unknown[]): boolean =>
  array1.length === array2.length &&
  array1.every((value: unknown, index: number) => value === array2[index]);
