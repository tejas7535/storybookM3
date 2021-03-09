export interface DateFormat {
  local: string;
  options: Intl.DateTimeFormatOptions;
}

export const DATE_FORMAT: DateFormat = {
  local: 'en-US',
  options: {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    weekday: 'short',
  },
};
