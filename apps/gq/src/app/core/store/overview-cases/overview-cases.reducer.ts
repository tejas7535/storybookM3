import { ViewQuotation } from '@gq/shared/models/quotation';
import { QuotationStatus } from '@gq/shared/models/quotation/quotation-status.enum';
import { GetQuotationsResponse } from '@gq/shared/services/rest/quotation/models/get-quotations-response.interface';
import { createFeature, createReducer, on } from '@ngrx/store';

import { OverviewCasesStateQuotations } from './models/overview-cases-state-quotations.model';
import { OverviewCasesActions } from './overview-cases.actions';

export interface OverviewCasesState {
  quotationsLoading: boolean;
  errorMessage: string;
  quotations: OverviewCasesStateQuotations;
  deleteLoading: boolean;
  selectedCases: number[];
}

export const initialState: OverviewCasesState = {
  quotationsLoading: false,
  errorMessage: undefined,
  quotations: {
    displayStatus: QuotationStatus.ACTIVE,
    active: {
      quotations: [],
      count: undefined,
    },
    archived: {
      quotations: [],
      count: undefined,
    },
    toBeApproved: {
      quotations: [],
      count: undefined,
    },
    inApproval: {
      quotations: [],
      count: undefined,
    },
    approved: {
      quotations: [],
      count: undefined,
    },
  },
  deleteLoading: false,
  selectedCases: [],
};
export const overviewCasesFeature = createFeature({
  name: 'overviewCases',
  reducer: createReducer(
    initialState,
    on(
      OverviewCasesActions.loadCases,
      (state: OverviewCasesState, { status }): OverviewCasesState => ({
        ...state,
        quotations: {
          ...state.quotations,
          displayStatus: status,
        },
        quotationsLoading: true,
      })
    ),
    on(
      OverviewCasesActions.loadCasesFailure,
      (state: OverviewCasesState, { errorMessage }): OverviewCasesState => ({
        ...state,
        errorMessage,
        quotationsLoading: false,
      })
    ),
    on(
      OverviewCasesActions.loadCasesSuccess,
      (state: OverviewCasesState, { response }): OverviewCasesState => {
        const { activeCount, inApprovalCount, approvedCount, archivedCount } =
          response;
        const { active, inApproval, approved, archived } = state.quotations;

        const quotations: OverviewCasesStateQuotations = {
          ...state.quotations,
          active: {
            count: activeCount,
            quotations: getQuotationsFromResponse(
              response,
              active.quotations,
              QuotationStatus.ACTIVE
            ),
          },
          inApproval: {
            count: inApprovalCount,
            quotations: getQuotationsFromResponse(
              response,
              inApproval.quotations,
              QuotationStatus.IN_APPROVAL
            ),
          },
          approved: {
            count: approvedCount,
            quotations: getQuotationsFromResponse(
              response,
              approved.quotations,
              QuotationStatus.APPROVED
            ),
          },
          archived: {
            count: archivedCount,
            quotations: getQuotationsFromResponse(
              response,
              archived.quotations,
              QuotationStatus.ARCHIVED
            ),
          },
        };

        return {
          ...state,
          quotations,
          quotationsLoading: false,
        };
      }
    ),
    on(
      OverviewCasesActions.updateCasesStatus,
      (state: OverviewCasesState): OverviewCasesState => ({
        ...state,
        deleteLoading: true,
      })
    ),
    on(
      OverviewCasesActions.updateCasesStatusSuccess,
      (state: OverviewCasesState, { gqIds }): OverviewCasesState => ({
        ...state,
        deleteLoading: false,
        selectedCases: [
          ...state.selectedCases.filter((id) => !gqIds.includes(id)),
        ],
      })
    ),
    on(
      OverviewCasesActions.updateCasesStatusFailure,
      (state: OverviewCasesState, { errorMessage }): OverviewCasesState => ({
        ...state,
        errorMessage,
        deleteLoading: false,
      })
    ),
    on(
      OverviewCasesActions.selectCase,
      (state: OverviewCasesState, { gqId }): OverviewCasesState => ({
        ...state,
        selectedCases: [...new Set([...state.selectedCases, gqId])],
      })
    ),
    on(
      OverviewCasesActions.deselectCase,
      (state: OverviewCasesState, { gqId }): OverviewCasesState => ({
        ...state,
        selectedCases: [...state.selectedCases.filter((id) => id !== gqId)],
      })
    )
  ),
});

/**
 * If the status matches to the quotations status in the response, return the responseQuotations, otherwise return the current Quotations.
 * @param response            the http response
 * @param currentQuotations   the current quotations
 * @param currentStatus              the currentStatus
 * @returns
 */
function getQuotationsFromResponse(
  response: GetQuotationsResponse,
  currentQuotations: ViewQuotation[],
  currentStatus: QuotationStatus
) {
  return response.statusTypeOfListedQuotation === currentStatus
    ? response.quotations
    : currentQuotations;
}
