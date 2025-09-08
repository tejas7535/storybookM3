import { RfqCalculatorAttachment } from '@gq/calculator/rfq-4-detail-view/models/rfq-calculator-attachments.interface';
import { CancellationReason } from '@gq/process-case-view/tabs/rfq-items-tab/rfq-items-table/modals/cancel-process/cancel-process.component';
import { ActiveDirectoryUser, QuotationDetail } from '@gq/shared/models';
import { RfqProcessResponse } from '@gq/shared/services/rest/rfq4/models/rfq-process-response.interface';
import { createActionGroup, emptyProps, props } from '@ngrx/store';

import { RfqProcessHistory } from './model/process-history.model';

export const Rfq4ProcessActions = createActionGroup({
  source: 'RFQ4 Processes',
  events: {
    'find calculators': props<{ gqPositionId: string }>(),
    'find calculators success': props<{
      gqPositionId: string;
      foundCalculators: string[];
    }>(),
    'find calculators error': props<{ gqPositionId: string; error: string }>(),
    'clear calculators': emptyProps(),

    'send recalculate sqv request': props<{
      gqPositionId: string;
      message: string;
    }>(),
    'send recalculate sqv request success': props<{
      gqPositionId: string;
      rfqProcessResponse: RfqProcessResponse;
    }>(),
    'send recalculate sqv request error': props<{
      error: string;
    }>(),

    'get sap maintainer user Ids': emptyProps(),
    'get sap maintainer user Ids success': props<{
      maintainerUserIds: string[];
    }>(),
    'get sap maintainer user Ids error': props<{
      error: string;
    }>(),
    'get active directory user of sap maintainer user ids success': props<{
      maintainers: ActiveDirectoryUser[];
    }>(),
    'get active directory user of sap maintainer user ids error': props<{
      error: string;
    }>(),
    'clear sap maintainers': emptyProps(),

    'send email request to maintain calculators': props<{
      quotationDetail: QuotationDetail;
    }>(),
    'send reopen recalculation request': props<{
      gqPositionId: string;
    }>(),
    'send reopen recalculation request success': props<{
      rfqProcessResponse: RfqProcessResponse;
      gqPositionId: string;
    }>(),
    'send reopen recalculation request error': props<{
      error: string;
    }>(),
    'send cancel process': props<{
      gqPositionId: string;
      reasonForCancellation: CancellationReason;
      comment: string;
    }>(),
    'send cancel process success': props<{
      gqPositionId: string;
      rfqProcessResponse: RfqProcessResponse;
    }>(),
    'send cancel process error': props<{ error: string }>(),
    'get process history': props<{
      gqPositionId: string;
    }>(),
    'get process history success': props<{
      processHistory: RfqProcessHistory;
    }>(),
    'get process history error': props<{
      error: string;
    }>(),
    'get process attachments': props<{ rfqId: number }>(),
    'get process attachments success': props<{
      attachments: RfqCalculatorAttachment[];
    }>(),
    'get process attachments error': props<{ error: string }>(),
    'download attachment': props<{ attachment: RfqCalculatorAttachment }>(),
    'download attachment failure': props<{ errorMessage: string }>(),
    'download attachment success': props<{ fileName: string }>(),
  },
});
