import { CalculatorTab } from '@gq/calculator/rfq-4-overview-view/models/calculator-tab.enum';
import { CalculatorViewToggle } from '@gq/calculator/rfq-4-overview-view/models/calculator-view-toggle.interface';
import { RfqRequest } from '@gq/calculator/service/models/get-rfq-requests-response.interface';
import { Rfq4Status } from '@gq/shared/models/quotation-detail/cost';

export const RFQ_4_OVERVIEW_CALCULATOR_VIEW_TOGGLE: CalculatorViewToggle[] = [
  {
    id: 0,
    tab: CalculatorTab.OPEN,
    active: true,
    title: 'translate it',
  },
  {
    id: 1,
    tab: CalculatorTab.IN_PROGRESS,
    active: false,
    title: 'translate it',
  },
  {
    id: 2,
    tab: CalculatorTab.DONE,
    active: false,
    title: 'translate it',
  },
];

export const RFQ_4_VIEW_OPEN_TOGGLE_ITEMS_MOCK: RfqRequest[] = [
  {
    calculatorRequestRecalculationStatus: Rfq4Status.OPEN,
    customerName: 'Customer A',
    customerNumber: 123,
    createdBy: 'User A',
    gqPositionId: 'GQ-001',
    materialDesc: 'Material A',
    materialNumber: 'MAT-001',
    rfqId: 1,
    rfqLastUpdated: '2023-10-01T12:00:00Z',
  },
];
