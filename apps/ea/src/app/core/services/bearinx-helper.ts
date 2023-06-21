import {
  BearinxOnlineResult,
  BearinxOnlineResultSubordinate,
} from './bearinx-result.interface';

export const extractSubordinatesFromPath = (
  input: BearinxOnlineResult,
  path: Partial<BearinxOnlineResultSubordinate>[],
  requireValue?: boolean
): BearinxOnlineResultSubordinate | undefined => {
  let result: BearinxOnlineResultSubordinate = input;

  for (const pathItem of path) {
    // find sub item by identifier and designation
    const item = result.subordinates.find((subordinate) =>
      matchItem(subordinate, pathItem)
    );

    if (!item) {
      if (requireValue) {
        console.error('Unable to find subordinate', { result, pathItem });
      }

      return undefined;
    }

    result = item;
  }

  return result;
};

export const extractTableFromSubordinate = (
  input: Partial<BearinxOnlineResultSubordinate>
): Record<string, { unit: string; value: string }> | undefined => {
  if (!input?.data) {
    return undefined;
  }

  const { items } = input.data;

  if (items.length > 1) {
    throw new Error('Only one line tables supported');
  }

  const result: Record<string, { unit: string; value: string }> = {};

  for (const item of items[0]) {
    result[item.field] = { unit: item.unit, value: item.value };
  }

  return result;
};

export const matchItem = (
  subordinate: BearinxOnlineResultSubordinate,
  objectToMatch: Partial<BearinxOnlineResultSubordinate>
): boolean =>
  Object.entries(objectToMatch).every(([key, value]) =>
    key in subordinate
      ? subordinate[key as keyof BearinxOnlineResultSubordinate] === value
      : value === undefined
  );
