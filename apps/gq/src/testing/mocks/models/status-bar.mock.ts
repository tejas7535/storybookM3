import {
  StatusBar,
  StatusBarProperties,
} from '../../../app/shared/models/status-bar.model';

// values equal calculations with QUOTATION_DETAIL_MOCK
export const STATUS_BAR_PROPERTIES_MOCK: StatusBarProperties = {
  netValue: 2000,
  gpi: 90,
  gpm: 85,
  priceDiff: 17.65,
  rows: 1,
};

export const STATUS_BAR_MOCK: StatusBar = {
  total: STATUS_BAR_PROPERTIES_MOCK,
  selected: STATUS_BAR_PROPERTIES_MOCK,
};
