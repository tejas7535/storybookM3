import { QuotationTab } from '@gq/core/store/overview-cases/models/quotation-tab.enum';
import { CustomView } from '@gq/shared/models/grid-state.model';

export const TABLE_KEY = 'CASE_OVERVIEW';

export const TO_APPROVE_TABS_VIEW_ID = 1;
export const IN_APPROVAL_TABS_VIEW_ID = 2;
export const APPROVED_TABS_VIEW_ID = 3;
export const REJECTED_TABS_VIEW_ID = 4;
export const ARCHIVED_TABS_VIEW_ID = 5;
export const SHARED_TABS_VIEW_ID = 6;

export const customViewIdByQuotationTab = new Map<QuotationTab, number>([
  [QuotationTab.TO_APPROVE, TO_APPROVE_TABS_VIEW_ID],
  [QuotationTab.IN_APPROVAL, IN_APPROVAL_TABS_VIEW_ID],
  [QuotationTab.APPROVED, APPROVED_TABS_VIEW_ID],
  [QuotationTab.REJECTED, REJECTED_TABS_VIEW_ID],
  [QuotationTab.ARCHIVED, ARCHIVED_TABS_VIEW_ID],
  [QuotationTab.SHARED, SHARED_TABS_VIEW_ID],
]);

export const CASE_TABLE_CUSTOM_VIEWS_CONFIG: CustomView[] = [
  {
    id: TO_APPROVE_TABS_VIEW_ID,
    title: QuotationTab.TO_APPROVE,
    state: { columnState: [], filterState: [] },
  },
  {
    id: IN_APPROVAL_TABS_VIEW_ID,
    title: QuotationTab.IN_APPROVAL,
    state: { columnState: [], filterState: [] },
  },
  {
    id: APPROVED_TABS_VIEW_ID,
    title: QuotationTab.APPROVED,
    state: { columnState: [], filterState: [] },
  },
  {
    id: REJECTED_TABS_VIEW_ID,
    title: QuotationTab.REJECTED,
    state: { columnState: [], filterState: [] },
  },
  {
    id: ARCHIVED_TABS_VIEW_ID,
    title: QuotationTab.ARCHIVED,
    state: { columnState: [], filterState: [] },
  },
  {
    id: SHARED_TABS_VIEW_ID,
    title: QuotationTab.SHARED,
    state: { columnState: [], filterState: [] },
  },
];
