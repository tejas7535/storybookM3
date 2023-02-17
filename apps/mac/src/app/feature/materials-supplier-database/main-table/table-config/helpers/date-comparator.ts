/** comparator for comparing a UTC timestamp (seconds) to a Typescript Date object (milliseconds) */
export const DATE_COMPARATOR = (filterValue: Date, cellValue: number) => {
  // filter date will always be midnight, so cellDate should also be set to midnight
  const cellDate = new Date(cellValue * 1000);
  cellDate.setHours(0);
  cellDate.setMinutes(0);
  cellDate.setSeconds(0);
  cellDate.setMilliseconds(0);

  return cellDate.getTime() - filterValue.getTime();
};
