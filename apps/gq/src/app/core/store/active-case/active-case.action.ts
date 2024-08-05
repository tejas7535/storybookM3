import {
  Quotation,
  QuotationAttachment,
  QuotationDetail,
  QuotationStatus,
} from '@gq/shared/models';
import { Customer } from '@gq/shared/models/customer';
import { UpdateQuotationRequest } from '@gq/shared/services/rest/quotation/models/update-quotation-request.model';
import { createActionGroup, emptyProps, props } from '@ngrx/store';

import { QuotationIdentifier } from './models/quotation-identifier.model';
import { UpdateQuotationDetail } from './models/update-quotation-detail.model';
import { QuotationSapSyncStatusResult } from '@gq/shared/models/quotation/quotation-sap-sync-status-result.model';

export const ActiveCaseActions = createActionGroup({
  source: 'Active Case',
  events: {
    'Get Customer Details': emptyProps(),
    'Get Customer Details Success': props<{ item: Customer }>(),
    'Get Customer Details Failure': props<{
      errorMessage: string;
      errorId?: string;
    }>(),

    'Get Quotation in Interval': emptyProps(),
    'Get Quotation': emptyProps(),
    'Get Quotation Success': props<{ item: Quotation }>(),
    'Get Quotation Failure': props<{
      errorMessage: string;
      errorId?: string;
    }>(),
    'Get Quotation Success Fully Completed': emptyProps(),

    'Update Quotation Details': props<{
      updateQuotationDetailList: UpdateQuotationDetail[];
    }>(),
    'Update Quotation Details Success': props<{
      updatedQuotation: Quotation;
    }>(),
    'Update Quotation Details Failure': props<{ errorMessage: string }>(),

    'Update Quotation': props<UpdateQuotationRequest>(),
    'Update Quotation Success': props<{ quotation: Quotation }>(),
    'Update Quotation Failure': props<{ errorMessage: string }>(),

    'Select Quotation': props<{ quotationIdentifier: QuotationIdentifier }>(),

    'Set Selected Quotation Detail': props<{ gqPositionId: string }>(),

    'Load Selected Quotation Detail From Url': props<{
      gqPositionId: string;
    }>(),

    'Load Selected Quotation From Url': props<{
      queryParams: any;
    }>(),

    'Remove Positions From Quotation': props<{ gqPositionIds: string[] }>(),
    'Remove Positions From Quotation Success': props<{
      updatedQuotation: Quotation;
    }>(),
    'Remove Positions From Quotation Failure': props<{
      errorMessage: string;
      updatedQuotation: Quotation;
    }>(),

    'Upload Selection to Sap': props<{ gqPositionIds: string[] }>(),
    'Upload Selection to Sap Success': props<{
      updatedQuotation: Quotation;
    }>(),
    'Upload Selection to Sap Failure': props<{
      errorMessage: string;
    }>(),

    'Refresh Sap Pricing': emptyProps(),
    'Refresh Sap Pricing Success': props<{
      quotation: Quotation;
    }>(),
    'Refresh Sap Pricing Failure': props<{
      errorMessage: string;
    }>(),

    'Create Sap Quote': props<{ gqPositionIds: string[] }>(),
    'Create Sap Quote Success': props<{
      quotation: Quotation;
    }>(),
    'Create Sap Quote Failure': props<{
      errorMessage: string;
    }>(),

    'Confirm Simulated Quotation': emptyProps(),
    'Reset Simulated Quotation': emptyProps(),
    'Add Simulated Quotation': props<{
      gqId: number;
      quotationDetails: QuotationDetail[];
    }>(),
    'Remove Simulated Quotation Detail': props<{ gqPositionId: string }>(),

    'Add Materials to Quotation': emptyProps(),
    'Add Materials to Quotation Success': props<{
      updatedQuotation: Quotation;
    }>(),
    'Add Materials to Quotation Failure': props<{
      errorMessage: string;
    }>(),

    'Select Quotation Detail': props<{ gqPositionId: string }>(),
    'Deselect Quotation Detail': props<{ gqPositionId: string }>(),

    'Clear Active Quotation': emptyProps(),

    'Update Quotation Status by ApprovalEvent': props<{
      quotationStatus: QuotationStatus;
    }>(),
    'Update Costs': props<{ gqPosId: string }>(),
    'Update Costs Success': props<{ updatedQuotation: Quotation }>(),
    'Update Costs Failure': props<{ errorMessage: string }>(),

    'Update RFQ Information': props<{ gqPosId: string }>(),
    'Update RFQ Information Success': props<{ updatedQuotation: Quotation }>(),
    'Update RFQ Information Failure': props<{ errorMessage: string }>(),

    'Upload Attachments': props<{ files: File[] }>(),
    'Upload Attachments Success': props<{
      attachments: QuotationAttachment[];
    }>(),
    'Upload Attachments failure': props<{ errorMessage: string }>(),

    'Get All Attachments': emptyProps(),
    'Get All Attachments Success': props<{
      attachments: QuotationAttachment[];
    }>(),
    'Get All Attachments Failure': props<{ errorMessage: string }>(),
    'Download Attachment': props<{ attachment: QuotationAttachment }>(),
    'Download Attachment Success': props<{ fileName: string }>(),
    'Download Attachment Failure': props<{ errorMessage: string }>(),
    'Delete Attachment': props<{ attachment: QuotationAttachment }>(),
    'Delete Attachment Success': props<{
      attachments: QuotationAttachment[];
    }>(),
    'Delete Attachment Failed': props<{ errorMessage: string }>(),

    'Get Sap Sync Status in Interval': emptyProps(),
    'Get Sap Sync Status': emptyProps(),
    'Get Sap Sync Status Success': props<{
      result: QuotationSapSyncStatusResult;
    }>(),
    'Get Sap Sync Status Failure': props<{ errorMessage: string }>(),
    'Get Sap Sync Status Success Fully Completed': emptyProps(),
  },
});
