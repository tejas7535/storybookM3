import { SelectableValue } from '../../shared/components/inputs/autocomplete/selectable-values.utils';

export const DEMAND_VALIDATION_FILTER_NAMES = [
  'customerMaterialNumber',
  'productLine',
  'productionLine',
  'stochasticType',
  'forecastMaintained',
] as const;

export type DemandValidationFilterName =
  (typeof DEMAND_VALIDATION_FILTER_NAMES)[number];

// Filter object for handling in Frontend
export type DemandValidationFilter = Record<
  DemandValidationFilterName,
  SelectableValue[] | SelectableValue
>;

// Filter object for sending to backend
export type DemandValidationStringFilter = Partial<
  Record<DemandValidationFilterName, string[]>
>;

export function demandValidationFilterToStringFilter(
  filter: DemandValidationFilter | undefined
): DemandValidationStringFilter | undefined {
  if (!filter) {
    return undefined;
  }

  let filterValuesObject: DemandValidationStringFilter = {};
  Object.entries(filter).forEach(
    ([key, filterValues]: [string, SelectableValue[] | SelectableValue]) => {
      const valuesArray = normalizeToArray(filterValues);

      if (valuesArray?.length > 0) {
        filterValuesObject = {
          ...filterValuesObject,
          [key]: valuesArray?.map((v) => v.id),
        };
      }
    }
  );

  return filterValuesObject;
}

function normalizeToArray(
  value: SelectableValue[] | SelectableValue | null | undefined
): SelectableValue[] {
  if (Array.isArray(value)) {
    return value;
  }

  return value == null ? [] : [value];
}
