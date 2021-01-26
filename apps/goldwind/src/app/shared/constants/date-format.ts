export interface DateFormat {
  local: string;
  options: {
    year: string;
    month: string;
    day: string;
    weekday: string;
  };
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
