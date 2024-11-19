/* eslint-disable max-lines */
import {
  Customer,
  DetailViewQueryParams,
  Quotation,
  QuotationAttachment,
  QuotationDetail,
  SimulatedQuotation,
} from '@gq/shared/models';
import { calculateStatusBarValues } from '@gq/shared/utils/pricing.utils';
import { createFeature, createReducer, createSelector, on } from '@ngrx/store';

import { GREATER_CHINA_SALES_ORGS } from '../approval/model/greater-china-sales-orgs';
import { ActiveCaseActions } from './active-case.action';
import {
  buildSimulatedQuotation,
  getSimulatedDetails,
  sortQuotationDetails,
} from './active-case.utils';
import { QuotationIdentifier } from './models';
import { QuotationMetadataReducers } from './quotation-metadata/quotation-metadata.reducer';

/**
 * Currently selected/active quotation state.
 */
export interface ActiveCaseState {
  quotationIdentifier: QuotationIdentifier;

  customerLoading: boolean;
  customer: Customer;
  customerLoadingErrorMessage: string;

  quotationLoading: boolean;
  quotationMetadataLoading: boolean;
  quotationMetadataLoadingErrorMessage: string;

  quotation: Quotation;
  simulatedItem: SimulatedQuotation;
  selectedQuotationDetail: string;
  quotationLoadingErrorMessage: string;
  updateLoading: boolean;
  selectedQuotationDetails: string[];
  removeQuotationDetailsIds: string[];
  updateCostsLoading: boolean;
  updateRfqInformationLoading: boolean;
  attachmentsUploading: boolean;
  attachmentsLoading: boolean;
  attachments: QuotationAttachment[];
  attachmentErrorMessage: string;
  attachmentDeletionInProgress: boolean;
  sapSyncStatusErrorMessage: string;
}

export const initialState: ActiveCaseState = {
  quotationIdentifier: undefined,

  customerLoading: false,
  customer: undefined,
  customerLoadingErrorMessage: undefined,

  quotationMetadataLoading: false,
  quotationMetadataLoadingErrorMessage: undefined,

  quotationLoading: false,
  quotation: undefined,
  simulatedItem: undefined,
  selectedQuotationDetail: undefined,
  quotationLoadingErrorMessage: undefined,
  updateLoading: false,
  selectedQuotationDetails: [],
  removeQuotationDetailsIds: [],
  updateCostsLoading: false,
  updateRfqInformationLoading: false,
  attachmentsUploading: false,
  attachmentsLoading: false,
  attachmentErrorMessage: undefined,
  attachments: [],
  attachmentDeletionInProgress: false,
  sapSyncStatusErrorMessage: undefined,
};

export const activeCaseFeature = createFeature({
  name: 'activeCase',
  reducer: createReducer(
    initialState,
    on(
      ActiveCaseActions.selectQuotation,
      (state: ActiveCaseState, { quotationIdentifier }): ActiveCaseState => ({
        ...state,
        quotationIdentifier,
      })
    ),
    on(
      ActiveCaseActions.getCustomerDetails,
      (state: ActiveCaseState): ActiveCaseState => ({
        ...state,
        customerLoading: true,
        customer: initialState.customer,
        customerLoadingErrorMessage: initialState.customerLoadingErrorMessage,
      })
    ),
    on(
      ActiveCaseActions.getCustomerDetailsSuccess,
      (state: ActiveCaseState, { item }): ActiveCaseState => ({
        ...state,
        customer: item,
        customerLoading: false,
      })
    ),
    on(
      ActiveCaseActions.getCustomerDetailsFailure,
      (state: ActiveCaseState, { errorMessage }): ActiveCaseState => ({
        ...state,
        customerLoadingErrorMessage: errorMessage,
        customerLoading: false,
      })
    ),
    on(
      ActiveCaseActions.getQuotationInInterval,
      (state: ActiveCaseState): ActiveCaseState => ({
        ...state,
        quotation: initialState.quotation,
        quotationLoading: true,
        quotationLoadingErrorMessage: initialState.quotationLoadingErrorMessage,
        updateLoading: false,
      })
    ),
    on(
      ActiveCaseActions.getQuotationSuccess,
      (state: ActiveCaseState, { item }): ActiveCaseState => ({
        ...state,
        quotation: {
          ...item,
          quotationDetails: sortQuotationDetails(item.quotationDetails),
        },
        quotationLoading: false,
        quotationLoadingErrorMessage: undefined,
      })
    ),
    on(
      ActiveCaseActions.getQuotationFailure,
      (state: ActiveCaseState, { errorMessage }): ActiveCaseState => ({
        ...state,
        quotationLoadingErrorMessage: errorMessage,
        quotationLoading: false,
      })
    ),
    on(
      ActiveCaseActions.updateQuotationDetails,
      (state: ActiveCaseState): ActiveCaseState => ({
        ...state,
        updateLoading: true,
      })
    ),
    on(
      ActiveCaseActions.updateQuotationDetailsSuccess,
      (state: ActiveCaseState, { updatedQuotation }): ActiveCaseState => ({
        ...state,
        quotation: {
          ...updatedQuotation,
          quotationDetails: [
            ...sortQuotationDetails(state.quotation.quotationDetails),
          ].map((el) => {
            const update = updatedQuotation.quotationDetails.find(
              (detail) => detail.gqPositionId === el.gqPositionId
            );

            return update ?? el;
          }),
        },
        updateLoading: false,
        quotationLoadingErrorMessage: undefined,
      })
    ),
    on(
      ActiveCaseActions.updateQuotationDetailsFailure,
      (state: ActiveCaseState, { errorMessage }): ActiveCaseState => ({
        ...state,
        quotationLoadingErrorMessage: errorMessage,
        updateLoading: false,
      })
    ),
    on(
      ActiveCaseActions.updateQuotation,
      (state: ActiveCaseState): ActiveCaseState => ({
        ...state,
        quotationLoading: true,
      })
    ),
    on(
      ActiveCaseActions.updateQuotationSuccess,
      (state: ActiveCaseState, { quotation }): ActiveCaseState => ({
        ...state,
        quotation: {
          ...quotation,
          quotationDetails: sortQuotationDetails(quotation.quotationDetails),
        },
        quotationLoading: false,
      })
    ),
    on(
      ActiveCaseActions.updateQuotationFailure,
      (state: ActiveCaseState, { errorMessage }): ActiveCaseState => ({
        ...state,
        quotationLoading: false,
        quotationLoadingErrorMessage: errorMessage,
      })
    ),
    on(
      ActiveCaseActions.setSelectedQuotationDetail,
      (state: ActiveCaseState, { gqPositionId }): ActiveCaseState => ({
        ...state,
        selectedQuotationDetail: gqPositionId,
      })
    ),
    on(
      ActiveCaseActions.removePositionsFromQuotation,
      (state: ActiveCaseState, { gqPositionIds }): ActiveCaseState => ({
        ...state,
        removeQuotationDetailsIds: gqPositionIds,
        updateLoading: true,
      })
    ),
    on(
      ActiveCaseActions.removePositionsFromQuotationSuccess,
      (state: ActiveCaseState, { updatedQuotation }): ActiveCaseState => ({
        ...state,
        quotation: {
          ...updatedQuotation,
          quotationDetails: sortQuotationDetails(
            updatedQuotation.quotationDetails
          ),
        },
        updateLoading: false,
        quotationLoadingErrorMessage: undefined,
        removeQuotationDetailsIds: [],
      })
    ),
    on(
      ActiveCaseActions.removePositionsFromQuotationFailure,
      (
        state: ActiveCaseState,
        { errorMessage, updatedQuotation }
      ): ActiveCaseState => ({
        ...state,
        quotationLoadingErrorMessage: errorMessage,
        quotation: {
          ...updatedQuotation,
          quotationDetails: sortQuotationDetails(
            updatedQuotation.quotationDetails
          ),
        },
        updateLoading: false,
        removeQuotationDetailsIds: [],
      })
    ),
    on(
      ActiveCaseActions.uploadSelectionToSap,
      (state: ActiveCaseState): ActiveCaseState => ({
        ...state,
        updateLoading: true,
      })
    ),
    on(
      ActiveCaseActions.uploadSelectionToSapFailure,
      (state: ActiveCaseState, { errorMessage }): ActiveCaseState => ({
        ...state,
        updateLoading: false,
        quotationLoadingErrorMessage: errorMessage,
      })
    ),
    on(
      ActiveCaseActions.uploadSelectionToSapSuccess,
      (state: ActiveCaseState, { updatedQuotation }): ActiveCaseState => ({
        ...state,
        updateLoading: false,
        quotation: {
          ...updatedQuotation,
          quotationDetails: sortQuotationDetails(
            state.quotation.quotationDetails.map(
              (oldQuotationDetail: QuotationDetail) => {
                const idx = updatedQuotation.quotationDetails.findIndex(
                  (updatedQuotationDetail: QuotationDetail) =>
                    updatedQuotationDetail.gqPositionId ===
                    oldQuotationDetail.gqPositionId
                );

                if (idx === -1) {
                  return oldQuotationDetail;
                }

                return updatedQuotation.quotationDetails[idx];
              }
            )
          ),
        },
      })
    ),
    on(
      ActiveCaseActions.refreshSapPricing,
      (state: ActiveCaseState): ActiveCaseState => ({
        ...state,
        updateLoading: true,
      })
    ),
    on(
      ActiveCaseActions.refreshSapPricingSuccess,
      (state: ActiveCaseState, { quotation }): ActiveCaseState => ({
        ...state,
        updateLoading: false,
        quotation: {
          ...quotation,
          quotationDetails: sortQuotationDetails(quotation.quotationDetails),
        },
      })
    ),
    on(
      ActiveCaseActions.refreshSapPricingFailure,
      (state: ActiveCaseState, { errorMessage }): ActiveCaseState => ({
        ...state,
        updateLoading: false,
        quotationLoadingErrorMessage: errorMessage,
      })
    ),
    on(
      ActiveCaseActions.resetSimulatedQuotation,
      (state: ActiveCaseState): ActiveCaseState => ({
        ...state,
        simulatedItem: undefined,
      })
    ),
    on(
      ActiveCaseActions.createSapQuote,
      (state: ActiveCaseState): ActiveCaseState => ({
        ...state,
        quotationLoading: true,
      })
    ),
    on(
      ActiveCaseActions.createSapQuoteSuccess,
      (state: ActiveCaseState, { quotation }): ActiveCaseState => ({
        ...state,
        quotationLoading: false,
        quotation: {
          ...quotation,
          quotationDetails: sortQuotationDetails(quotation.quotationDetails),
        },
      })
    ),
    on(
      ActiveCaseActions.createSapQuoteFailure,
      (state: ActiveCaseState, { errorMessage }): ActiveCaseState => ({
        ...state,
        quotationLoading: false,
        quotationLoadingErrorMessage: errorMessage,
      })
    ),
    on(
      ActiveCaseActions.addSimulatedQuotation,
      (
        state: ActiveCaseState,
        { gqId, quotationDetails, simulatedField }
      ): ActiveCaseState => ({
        ...state,
        simulatedItem: buildSimulatedQuotation(
          gqId,
          simulatedField,
          quotationDetails,
          state.quotation.quotationDetails
        ),
      })
    ),
    on(
      ActiveCaseActions.addMaterialsToQuotation,
      (state: ActiveCaseState): ActiveCaseState => ({
        ...state,
        updateLoading: true,
        quotationLoadingErrorMessage: initialState.quotationLoadingErrorMessage,
      })
    ),
    on(
      ActiveCaseActions.addMaterialsToQuotationSuccess,
      (state: ActiveCaseState, { updatedQuotation }): ActiveCaseState => ({
        ...state,
        quotation: {
          ...updatedQuotation,
          quotationDetails: [
            ...sortQuotationDetails(updatedQuotation.quotationDetails),
          ],
        },
        updateLoading: false,
        quotationLoadingErrorMessage: undefined,
      })
    ),
    on(
      ActiveCaseActions.addMaterialsToQuotationFailure,
      (state: ActiveCaseState, { errorMessage }): ActiveCaseState => ({
        ...state,
        quotationLoadingErrorMessage: errorMessage,
        updateLoading: false,
      })
    ),
    on(
      ActiveCaseActions.removeSimulatedQuotationDetail,
      (state: ActiveCaseState, { gqPositionId }): ActiveCaseState => ({
        ...state,
        simulatedItem: {
          ...state.simulatedItem,
          quotationDetails: state.simulatedItem.quotationDetails.filter(
            (detail: QuotationDetail) => detail.gqPositionId !== gqPositionId
          ),
          simulatedStatusBar: {
            ...calculateStatusBarValues(
              getSimulatedDetails(
                state.quotation.quotationDetails,
                state.simulatedItem.quotationDetails.filter(
                  (detail: QuotationDetail) =>
                    detail.gqPositionId !== gqPositionId
                )
              )
            ),
          },
        },
      })
    ),
    on(
      ActiveCaseActions.selectQuotationDetail,
      (state: ActiveCaseState, { gqPositionId }): ActiveCaseState => ({
        ...state,
        selectedQuotationDetails: [
          ...new Set([...state.selectedQuotationDetails, gqPositionId]),
        ],
      })
    ),
    on(
      ActiveCaseActions.deselectQuotationDetail,
      (state: ActiveCaseState, { gqPositionId }): ActiveCaseState => ({
        ...state,
        selectedQuotationDetails: state.selectedQuotationDetails.filter(
          (id) => id !== gqPositionId
        ),
      })
    ),
    on(
      ActiveCaseActions.clearActiveQuotation,
      (state: ActiveCaseState): ActiveCaseState => ({
        ...state,
        quotation: initialState.quotation,
        quotationIdentifier: initialState.quotationIdentifier,
      })
    ),
    on(
      ActiveCaseActions.updateQuotationStatusByApprovalEvent,
      (state: ActiveCaseState, { quotationStatus }): ActiveCaseState => ({
        ...state,
        quotation: {
          ...state.quotation,
          status: quotationStatus,
        },
      })
    ),
    on(
      ActiveCaseActions.updateCosts,
      (state: ActiveCaseState): ActiveCaseState => ({
        ...state,
        updateCostsLoading: true,
      })
    ),
    on(
      ActiveCaseActions.updateCostsSuccess,
      (state: ActiveCaseState, { updatedQuotation }): ActiveCaseState => ({
        ...state,
        quotation: { ...updatedQuotation },
        updateCostsLoading: false,
      })
    ),
    on(
      ActiveCaseActions.updateCostsFailure,
      (state: ActiveCaseState, { errorMessage }): ActiveCaseState => ({
        ...state,
        quotationLoadingErrorMessage: errorMessage,
        updateCostsLoading: false,
      })
    ),
    on(
      ActiveCaseActions.updateRFQInformation,
      (state: ActiveCaseState): ActiveCaseState => ({
        ...state,
        updateRfqInformationLoading: true,
      })
    ),
    on(
      ActiveCaseActions.updateRFQInformationSuccess,
      (state: ActiveCaseState, { updatedQuotation }): ActiveCaseState => ({
        ...state,
        quotation: { ...updatedQuotation },
        updateRfqInformationLoading: false,
      })
    ),
    on(
      ActiveCaseActions.updateRFQInformationFailure,
      (state: ActiveCaseState, { errorMessage }): ActiveCaseState => ({
        ...state,
        quotationLoadingErrorMessage: errorMessage,
        updateRfqInformationLoading: false,
      })
    ),
    on(
      ActiveCaseActions.uploadAttachments,
      (state: ActiveCaseState): ActiveCaseState => ({
        ...state,
        attachmentsUploading: true,
      })
    ),
    on(
      ActiveCaseActions.uploadAttachmentsSuccess,
      (state: ActiveCaseState, { attachments }): ActiveCaseState => ({
        ...state,
        attachments: [...attachments],
        attachmentsUploading: false,
      })
    ),
    on(
      ActiveCaseActions.uploadAttachmentsFailure,
      (state: ActiveCaseState): ActiveCaseState => ({
        ...state,
        attachmentsUploading: false,
      })
    ),
    on(
      ActiveCaseActions.getAllAttachments,
      (state: ActiveCaseState): ActiveCaseState => ({
        ...state,
        attachmentsLoading: true,
      })
    ),
    on(
      ActiveCaseActions.getAllAttachmentsSuccess,
      (state: ActiveCaseState, { attachments }): ActiveCaseState => ({
        ...state,
        attachments: [...attachments],
        attachmentsLoading: false,
      })
    ),
    on(
      ActiveCaseActions.getAllAttachmentsFailure,
      (state: ActiveCaseState): ActiveCaseState => ({
        ...state,
        attachmentsLoading: false,
      })
    ),
    on(
      ActiveCaseActions.downloadAttachmentFailure,
      (state: ActiveCaseState, { errorMessage }): ActiveCaseState => ({
        ...state,
        attachmentErrorMessage: errorMessage,
        attachmentDeletionInProgress: false,
      })
    ),
    on(
      ActiveCaseActions.deleteAttachment,
      (state: ActiveCaseState): ActiveCaseState => ({
        ...state,
        attachmentDeletionInProgress: true,
      })
    ),
    on(
      ActiveCaseActions.deleteAttachmentSuccess,
      (state: ActiveCaseState, { attachments }): ActiveCaseState => ({
        ...state,
        attachments: [...attachments],
        attachmentDeletionInProgress: false,
      })
    ),
    on(
      ActiveCaseActions.getSapSyncStatusSuccess,
      (state: ActiveCaseState, { result }): ActiveCaseState => ({
        ...state,
        quotation: {
          ...state.quotation,
          sapId: result.sapId,
          sapSyncStatus: result.sapSyncStatus,
          quotationDetails: state.quotation.quotationDetails.map((q) => {
            const detail = result.quotationDetailSapSyncStatusList.find(
              (d) => d.gqPositionId === q.gqPositionId
            );

            return detail ? { ...q, sapSyncStatus: detail.sapSyncStatus } : q;
          }),
        },
      })
    ),
    on(
      ActiveCaseActions.getSapSyncStatusFailure,
      (state: ActiveCaseState, { errorMessage }): ActiveCaseState => ({
        ...state,
        sapSyncStatusErrorMessage: errorMessage,
      })
    ),
    ...QuotationMetadataReducers
  ),
  extraSelectors: ({
    selectActiveCaseState,
    selectQuotation,
    selectSelectedQuotationDetail,
  }) => {
    const getSelectedQuotationDetail = createSelector(
      selectQuotation,
      selectSelectedQuotationDetail,
      (
        quotation: Quotation,
        selectedQuotationDetail: string
      ): QuotationDetail =>
        quotation?.quotationDetails.find(
          (detail: QuotationDetail) =>
            detail.gqPositionId === selectedQuotationDetail
        )
    );
    const getPriceUnitOfSelectedQuotationDetail = createSelector(
      getSelectedQuotationDetail,
      (detail: QuotationDetail): number => detail?.leadingPriceUnit
    );

    const getDetailViewQueryParams = createSelector(
      selectActiveCaseState,
      (
        state: ActiveCaseState
      ): { queryParams: DetailViewQueryParams; id: number } => ({
        queryParams: {
          customer_number: state.customer?.identifier.customerId,
          sales_org: state.customer?.identifier.salesOrg,
          quotation_number: state.quotation?.gqId,
          gqPositionId: state.selectedQuotationDetail,
        },
        id: state.quotation?.quotationDetails.find(
          (detail) => detail.gqPositionId === state.selectedQuotationDetail
        )?.quotationItemId,
      })
    );

    const getQuotationSalesOrgIsGreaterChina = createSelector(
      selectQuotation,
      (quotation: Quotation): boolean => {
        const salesOrg = quotation?.customer?.identifier?.salesOrg;

        if (!salesOrg) {
          return false;
        }

        return GREATER_CHINA_SALES_ORGS.includes(salesOrg);
      }
    );

    return {
      getSelectedQuotationDetail,
      getPriceUnitOfSelectedQuotationDetail,
      getDetailViewQueryParams,
      getQuotationSalesOrgIsGreaterChina,
    };
  },
});
