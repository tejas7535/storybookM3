import { CustomerId } from '@gq/shared/models';
import { GQUser } from '@gq/shared/models/user.model';

import { RecalculateSqvStatus } from './recalculate-sqv-status.enum';

export interface RfqDetailViewData {
  customerData: CalculatorCustomerData;
  quotationData: CalculatorQuotationData;
  quotationDetailData: CalculatorQuotationDetailData;
  rfq4ProcessData: CalculatorRfq4ProcessData;
}

export interface CalculatorCustomerData {
  identifier: CustomerId;
  name: string;
  country: string;
}

export interface CalculatorQuotationData {
  sapQuotationToDate: string;
  requestedDelDate: string;
  currency: string;
  gqCreatedByUser: GQUser;
}

export interface CalculatorQuotationDetailData {
  gqPositionId: string;
  orderQuantity: number;
  deliveryUnit: number | null;
  materialData: CalculatorMaterialData;
}
export interface CalculatorMaterialData {
  materialNumber15: string;
  materialDescription: string;
  productHierarchy: string;
  dimensions: string;
}

export interface CalculatorRfq4ProcessData {
  rfqId: number;
  rfqType: string;
  startedByUserId: string;
  startedOn: string;
  recalculationMessage: string;
  calculatorRequestRecalculationStatus: RecalculateSqvStatus;
  assignedUserId: string;
  sqv: number;
  processProductionPlant: string;
}

export interface ProductionPlantData {
  loading: boolean;
  productionPlants: ProductionPlantForRfq[];
}

export interface ProductionPlantResponse {
  results: ProductionPlantForRfq[];
}

export interface ProductionPlantForRfq {
  plantNumber: string;
  city: string;
  country: string;
}
