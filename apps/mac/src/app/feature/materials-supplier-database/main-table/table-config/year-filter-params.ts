const currentYear = new Date().getFullYear();
let year = 2020;
const years: number[] = [undefined];
while (year <= currentYear) {
  years.push(year);
  year = year + 1;
}

export const YEAR_FILTER_PARAMS = {
  values: years,
  valueFormatter: ({ value }: { value: number }) =>
    value ? value.toString() : 'Blank',
  keyCreator: ({ value }: { value: number }) => value,
};
