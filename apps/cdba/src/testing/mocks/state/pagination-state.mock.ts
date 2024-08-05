import { PaginationState } from '@cdba/core/store/reducers/search/search.reducer';

export const PAGINATION_STATE_MOCK: PaginationState = {
  isDisabled: false,
  isVisible: false,
  pageSize: 0,
  currentPage: 0,
  currentRangeStartIndex: 0,
  currentRangeEndIndex: 0,
  totalPages: 0,
  totalRange: 0,
};
