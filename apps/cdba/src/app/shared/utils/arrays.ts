export const arrayEquals = <T>(array1: T[], array2: T[]): boolean =>
  !!array1 &&
  !!array2 &&
  array1.length === array2.length &&
  array1.every((value: T, index: number) => value === array2[index]);

export const addArrayItem = <T>(array: T[], arrayItem: T): T[] => {
  if (!array || arrayItem === undefined) {
    return array;
  }

  if (array.includes(arrayItem)) {
    return array;
  }

  const arrayCopy = [...array];

  arrayCopy.push(arrayItem);

  return arrayCopy;
};

export const removeArrayItem = <T>(array: T[], arrayItem: T): T[] => {
  if (!array || arrayItem === undefined) {
    return array;
  }

  const arrayCopy = [...array];
  const index = array.indexOf(arrayItem);

  if (index > -1) {
    arrayCopy.splice(index, 1);
  }

  return arrayCopy;
};
