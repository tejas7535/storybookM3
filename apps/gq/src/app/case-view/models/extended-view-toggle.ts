import { QuotationStatus } from '@gq/shared/models';

import { ViewToggle } from '@schaeffler/view-toggle';

export interface ExtendedViewToggle extends ViewToggle {
  status: QuotationStatus;
}
