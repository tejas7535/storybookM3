import { CancellationReason } from '@gq/process-case-view/tabs/open-items-tab/open-items-table/modals/cancel-process/cancel-process.component';
import { ActiveDirectoryUser, QuotationDetail } from '@gq/shared/models';
import { Rfq4Status } from '@gq/shared/models/quotation-detail/cost';
import { createActionGroup, emptyProps, props } from '@ngrx/store';

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
      rfq4Status: Rfq4Status;
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
    'send cancel process': props<{
      gqPositionId: string;
      reasonForCancellation: CancellationReason;
      comment: string;
    }>(),
    'send cancel process success': props<{
      gqPositionId: string;
      rfq4Status: Rfq4Status;
    }>(),
    'send cancel process error': props<{ error: string }>(),
  },
});
