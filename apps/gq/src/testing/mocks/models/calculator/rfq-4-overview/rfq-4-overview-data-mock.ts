import { DeliveryTimeUnit } from '@gq/calculator/rfq-4-detail-view/component/recalculation/control/delivery-time/delivery-time-input.component';
import { RecalculateSqvStatus } from '@gq/calculator/rfq-4-detail-view/models/recalculate-sqv-status.enum';
import { CalculatorTab } from '@gq/calculator/rfq-4-overview-view/models/calculator-tab.enum';
import { CalculatorViewToggle } from '@gq/calculator/rfq-4-overview-view/models/calculator-view-toggle.interface';
import { RfqRequest } from '@gq/calculator/service/models/get-rfq-requests-response.interface';
import { RfqProcessHistory } from '@gq/core/store/rfq-4-process/model/process-history.model';
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

export const RFQ_4_PROCESS_HISTORY_MOCK: RfqProcessHistory = {
  rfqId: 1234,
  gqPositionId: '123456',
  recalculationStatus: RecalculateSqvStatus.CANCELLED,
  rfq4Status: Rfq4Status.CANCELLED,
  recalculationMessage: 'Recalculation message',
  materialNumber15: '123456789012345',
  productLineId: 'PL123',
  quantity: 100,
  productionPlantNumber: 'PLANT123',
  plantNumber: 'PLANT456',
  customerRegionName: 'Region1',
  currency: 'EUR',
  sqv: 1000,
  assignedUserId: 'user123',
  confirmedDate: null,
  reasonForCancellation: 'CUSTOMER',
  cancellationComment: 'Test cancellation comment',
  cancelledDate: new Date('2023-10-01T12:00:00Z'),
  recalculationData: {
    currency: 'EUR',
    sqv: 1000,
    lotSize: 10,
    priceUnit: 100,
    toolCosts: 50,
    productionPlantNumber: 'PLANT123',
    comment: 'Test comment',
    calculationDetails: 'Test calculation details',
    deliveryTime: 5,
    deliveryTimeUnit: DeliveryTimeUnit.MONTHS,
  },
};
