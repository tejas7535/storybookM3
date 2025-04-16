import { REMOTE_SET_FILTER_PARAMS } from './remote-set-filter-params';

const getYears = () => {
  const currentYear = new Date().getFullYear();
  let year = 2020;
  const years: number[] = [undefined];
  while (year <= currentYear) {
    years.push(year);
    year = year + 1;
  }

  return years;
};

export const YEAR_FILTER_PARAMS = {
  ...REMOTE_SET_FILTER_PARAMS,
  values: getYears(),
  valueFormatter: ({ value }: { value: number }) =>
    value ? value.toString() : 'Blank',
  keyCreator: ({ value }: { value: number }) => value,
};
