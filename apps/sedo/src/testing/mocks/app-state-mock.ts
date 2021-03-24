import { salesSummaryMock } from './sales-summary.mock';

export const APP_STATE_MOCK = {
  router: {
    state: { url: '/sales', params: {}, queryParams: {} },
    navigationId: 2,
  },
  salesSummary: {
    content: [salesSummaryMock],
    totalPageCount: 1,
    totalItemsCount: 1,
    pageNumber: 0,
    pageSize: 25,
  },
  'azure-auth': {
    accountInfo: {
      username: 'user@mail.com',
    },
  },
};
