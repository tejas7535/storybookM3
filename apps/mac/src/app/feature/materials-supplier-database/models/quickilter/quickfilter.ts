export interface QuickFilter {
  title: string;
  filter: {
    [key: string]: any;
  };
  columns: string[];
  custom: boolean;
}
