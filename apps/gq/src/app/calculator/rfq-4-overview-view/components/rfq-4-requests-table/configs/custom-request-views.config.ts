import { CalculatorTab } from '@gq/calculator/rfq-4-overview-view/models/calculator-tab.enum';
import { CustomView } from '@gq/shared/models/grid-state.model';

export const TABLE_KEY = 'RFQ-4-REQUESTS-OVERVIEW';

export const OPEN_ID = 0;
export const IN_PROGRESS_ID = 1;
export const DONE_ID = 2;

export const customViewIdByCalculatorTab = new Map<CalculatorTab, number>([
  [CalculatorTab.OPEN, OPEN_ID],
  [CalculatorTab.IN_PROGRESS, IN_PROGRESS_ID],
  [CalculatorTab.DONE, DONE_ID],
]);

export const RFQ_4_REQUESTS_TABLE_CUSTOM_VIEWS_CONFIG: CustomView[] = [
  {
    id: OPEN_ID,
    title: CalculatorTab.OPEN,
    state: { columnState: [], filterState: [] },
  },
  {
    id: IN_PROGRESS_ID,
    title: CalculatorTab.IN_PROGRESS,
    state: { columnState: [], filterState: [] },
  },
  {
    id: DONE_ID,
    title: CalculatorTab.DONE,
    state: { columnState: [], filterState: [] },
  },
];
