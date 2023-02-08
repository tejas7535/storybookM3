import { IgnoreFlag } from '../../app/sales-summary/sales-row-details/enums/ignore-flag.enum';
import { SalesSummary } from '../../app/shared/models/sales-summary.model';

export const salesSummaryMock = new SalesSummary(
  'combined key',
  true,
  'category key',
  'standard f type key',
  'business unit key',
  'business unit name',
  'sector key',
  'sector name',
  1,
  'key account name',
  'customer number global key',
  'customer number global name',
  'article number global key',
  'article number global name',
  'product line medium name',
  'product line key',
  '0205',
  'FAS',
  IgnoreFlag.None,
  '2020-10-15T08:43:01.412Z',
  '2020-10-15T08:43:01.412Z',
  '2020-10-15T08:43:01.412Z',
  '2020-10-15T08:43:01.412Z',
  '2020-10-15T08:43:01.412Z',
  'abc',
  'a keyuser'
);
