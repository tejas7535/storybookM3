import { RecalculateSqvStatus } from '@gq/calculator/rfq-4-detail-view/models/recalculate-sqv-status.enum';
import { RfqDetailViewCalculationData } from '@gq/calculator/rfq-4-detail-view/models/rfq-4-detail-view-data.interface';
import { CancellationReason } from '@gq/process-case-view/tabs/rfq-items-tab/rfq-items-table/modals/cancel-process/cancel-process.component';
import { Rfq4Status } from '@gq/shared/models/quotation-detail/cost';

export interface RfqProcessHistory {
  gqPositionId: string;
  recalculationStatus: RecalculateSqvStatus;
  rfq4Status: Rfq4Status;
  recalculationMessage: string;
  materialNumber15: string;
  productLineId: string;
  quantity: number;
  productionPlantNumber: string;
  plantNumber: string;
  customerRegionName: string;
  currency: string;
  sqv: number;
  assignedUserId: string;
  confirmedDate: Date;
  reasonForCancellation: CancellationReason;
  cancellationComment: string;
  cancelledDate: Date;
  recalculationData: RfqDetailViewCalculationData;
}
