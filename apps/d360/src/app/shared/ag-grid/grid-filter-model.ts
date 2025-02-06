import { format, parseISO } from 'date-fns';

export type ColumnFilters = Record<string, any>;

/**
 * Process filter model for simpler use in backend.
 */
export function formatFilterModelForBackend(filterModel: any): ColumnFilters {
  const processedFilterModel: Record<string, any> = {};

  if (filterModel) {
    Object.entries(filterModel).forEach(([key, value]: [string, any]) => {
      const refinedValue = { ...value };

      // convert bad formatted date value (e.g. '2022-09-16 14:56:00') to ISO 8601 date
      if (refinedValue.filterType.toLowerCase() === 'date') {
        refinedValue.dateFrom = refinedValue.dateFrom.replace(' ', 'T');
        const timeStringArray = refinedValue.dateFrom.split(/[+,-]/);

        if (timeStringArray.length === 4) {
          timeStringArray.pop();
        }

        refinedValue.dateFrom = timeStringArray.join('-');
      }
      // agGrid generates null for empty strings - fix this to not confuse our backend
      if (refinedValue.filterType.toLowerCase() === 'set') {
        refinedValue.values = refinedValue.values.map((x: string) =>
          x == null ? '' : x
        );
      }

      processedFilterModel[key] = refinedValue.operator
        ? {
            condition1: refinedValue.condition1,
            condition2: refinedValue.condition2,
            filterType: refinedValue.operator.toLowerCase(),
          }
        : refinedValue;
    });
  }

  return processedFilterModel;
}

export function formatFilterModelForAgGrid(
  filterModel: Record<string, any>
): Record<string, any> {
  const processedFilterModel: Record<string, any> = {};

  if (filterModel) {
    Object.entries(filterModel).forEach(([key, filter]: [string, any]) => {
      const refinedFilter = { ...filter };

      // convert nice ISO Date back to bad formatted date value ('2022-09-16 14:56:00') for Ag grid
      if (refinedFilter.filterType.toLowerCase() === 'date') {
        refinedFilter.dateFrom = format(
          parseISO(refinedFilter.dateFrom),
          'yyyy-MM-dd HH:mm:ss'
        );
      }

      // add operator field for ag grid and set filterType back to the first filters type
      processedFilterModel[key] =
        refinedFilter.filterType === 'and' || refinedFilter.filterType === 'or'
          ? {
              condition1: refinedFilter.condition1,
              condition2: refinedFilter.condition2,
              filterType: refinedFilter.condition1.filterType,
              operator: refinedFilter.filterType.toUpperCase(),
            }
          : refinedFilter;
    });
  }

  return processedFilterModel;
}
