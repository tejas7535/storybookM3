import { SelectableValue } from '../../shared/components/inputs/autocomplete/selectable-values.utils';

export const DEMAND_VALIDATION_FILTER_NAMES = [
  'customerMaterialNumber',
  'productLine',
  'productionLine',
  'stochasticType',
] as const;

export type DemandValidationFilterName =
  (typeof DEMAND_VALIDATION_FILTER_NAMES)[number];

// Filter object for handling in Frontend
export type DemandValidationFilter = Record<
  DemandValidationFilterName,
  SelectableValue[]
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
    ([key, filterValues]: [string, SelectableValue[]]) => {
      if (filterValues?.length > 0) {
        filterValuesObject = {
          ...filterValuesObject,
          [key]: filterValues.map((v) => v.id),
        };
      }
    }
  );

  return filterValuesObject;
}
