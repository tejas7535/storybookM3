export const FILTER_PARAMS = {
  filterOptions: ['equals'],
  buttons: ['reset'],
  suppressAndOrCondition: true,
};

export const NUMBER_COLUMN_FILTER = 'agNumberColumnFilter';
export const DATE_COLUMN_FILTER = 'agDateColumnFilter';
export const TEXT_COLUMN_FILTER = 'agTextColumnFilter';
export const SET_COLUMN_FILTER = 'agSetColumnFilter';
export const MULTI_COLUMN_FILTER = 'agMultiColumnFilter';

export const MULTI_COLUMN_FILTER_PARAMS = {
  filters: [
    {
      filter: TEXT_COLUMN_FILTER,
      filterParams: {
        defaultOption: 'startsWith',
        suppressAndOrCondition: true,
        buttons: ['reset'],
      },
    },
    {
      filter: SET_COLUMN_FILTER,
    },
  ],
  defaultOption: 'startsWith',
};
