import { QuotationTab } from '@gq/core/store/overview-cases/models/quotation-tab.enum';

import { ViewToggle } from '@schaeffler/view-toggle';

export interface ExtendedViewToggle extends ViewToggle {
  tab: QuotationTab;
}
