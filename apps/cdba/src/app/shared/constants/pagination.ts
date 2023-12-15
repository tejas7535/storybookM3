export const MIN_PAGE_SIZE = 50;
export const MAX_PAGE_SIZE = 500;
export const PAGE_SIZE_OPTIONS = [MIN_PAGE_SIZE, 100, 250, MAX_PAGE_SIZE];

export const USER_PAGE_SIZE_KEY = 'pageSize';
export const PAGINATION_LOADING_TIMEOUT = 800;

export enum PaginationType {
  FIRST,
  NEXT,
  PREVIOUS,
  LAST,
}
