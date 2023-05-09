import { createActionGroup, emptyProps, props } from '@ngrx/store';

import { Quotation, QuotationDetail } from '../../../shared/models';
import { Customer } from '../../../shared/models/customer';
import { ShipToParty } from '../../../shared/services/rest/quotation/models/ship-to-party';
import { QuotationIdentifier, UpdateQuotationDetail } from './models';

export const ActiveCaseActions = createActionGroup({
  source: 'Active Case',
  events: {
    'Get Customer Details': emptyProps(),
    'Get Customer Details Success': props<{ item: Customer }>(),
    'Get Customer Details Failure': props<{ errorMessage: string }>(),

    'Get Quotation in Interval': emptyProps(),
    'Get Quotation': emptyProps(),
    'Get Quotation Success': props<{ item: Quotation }>(),
    'Get Quotation Failure': props<{ errorMessage: string }>(),
    'Get Quotation Success Fully Completed': emptyProps(),

    'Update Quotation Details': props<{
      updateQuotationDetailList: UpdateQuotationDetail[];
    }>(),
    'Update Quotation Details Success': props<{
      updatedQuotation: Quotation;
    }>(),
    'Update Quotation Details Failure': props<{ errorMessage: string }>(),

    'Update Quotation': props<
      Partial<{
        caseName: string;
        currency: string;
        quotationToDate: string;
        requestedDelDate: string;
        customerPurchaseOrderDate: string;
        validTo: string;
        shipToParty: ShipToParty;
      }>
    >(),
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
  },
});
