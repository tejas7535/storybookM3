import { ViewToggle } from '@schaeffler/view-toggle';
import { QuotationStatus } from '../../shared/models';

export interface ExtendedViewToggle extends ViewToggle {
  status: QuotationStatus;
}
