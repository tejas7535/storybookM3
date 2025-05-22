import { RecalculateSqvStatus } from '../../../../../app/calculator/rfq-4-detail-view/models/recalculate-sqv-status.enum';
import {
  CalculatorCustomerData,
  CalculatorMaterialData,
  CalculatorQuotationData,
  CalculatorQuotationDetailData,
  CalculatorRfq4ProcessData,
  RfqDetailViewData,
} from '../../../../../app/calculator/rfq-4-detail-view/models/rfq-4-detail-view-data.interface';

export const CALCULATOR_CUSTOMER_DATA_MOCK: CalculatorCustomerData = {
  identifier: {
    customerId: '123456',
    salesOrg: '0215',
  },
  name: 'Test Customer',
  country: 'Test Country',
};

export const CALCULATOR_QUOTATION_DATA_MOCK: CalculatorQuotationData = {
  sapQuotationToDate: '2023-10-01',
  requestedDelDate: '2023-10-01',
  currency: 'USD',
  gqCreatedByUser: {
    id: 'id',
    name: 'name',
  },
};
export const CALCULATOR_MATERIAL_DATA_MOCK: CalculatorMaterialData = {
  materialNumber15: '123456789012345',
  materialDescription: 'Test Material',
  productHierarchy: 'Test Product Hierarchy',
  dimensions: 'Test Dimensions',
};

export const CALCULATOR_QUOTATION_DETAIL_DATA_MOCK: CalculatorQuotationDetailData =
  {
    gqPositionId: '12345',
    orderQuantity: 100,
    deliveryUnit: 100,
    materialData: CALCULATOR_MATERIAL_DATA_MOCK,
  };

export const CALCULATOR_RFQ_4_PROCESS_DATA_MOCK: CalculatorRfq4ProcessData = {
  rfqId: 12_345,
  rfqType: 'Test RFQ Type',
  startedByUserId: 'Test User',
  startedOn: '2023-10-01',
  recalculationMessage: 'Test Message',
  calculatorRequestRecalculationStatus: RecalculateSqvStatus.OPEN,
  assignedUserId: 'Test Assigned User',
  sqv: 10,
};

export const RFQ_DETAIL_VIEW_DATA_MOCK: RfqDetailViewData = {
  customerData: CALCULATOR_CUSTOMER_DATA_MOCK,
  quotationData: CALCULATOR_QUOTATION_DATA_MOCK,
  quotationDetailData: CALCULATOR_QUOTATION_DETAIL_DATA_MOCK,
  rfq4ProcessData: CALCULATOR_RFQ_4_PROCESS_DATA_MOCK,
};
