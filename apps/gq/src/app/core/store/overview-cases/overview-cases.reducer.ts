import { ViewQuotation } from '@gq/shared/models/quotation';
import { GetQuotationsResponse } from '@gq/shared/services/rest/quotation/models/get-quotations-response.interface';
import { createFeature, createReducer, on } from '@ngrx/store';

import { OverviewCasesStateQuotations } from './models/overview-cases-state-quotations.model';
import { QuotationTab } from './models/quotation-tab.enum';
import { OverviewCasesActions } from './overview-cases.actions';

export interface OverviewCasesState {
  quotationsCountLoading: boolean;
  quotationsLoading: boolean;
  errorMessage: string;
  quotations: OverviewCasesStateQuotations;
  deleteLoading: boolean;
  selectedCases: number[];
}

export const initialState: OverviewCasesState = {
  quotationsCountLoading: false,
  quotationsLoading: false,
  errorMessage: undefined,
  quotations: {
    activeTab: QuotationTab.ACTIVE,
    active: {
      quotations: [],
      count: undefined,
    },
    archived: {
      quotations: [],
      count: undefined,
    },
    toApprove: {
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
    rejected: {
      quotations: [],
      count: undefined,
    },
    shared: {
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
      OverviewCasesActions.getCasesCount,
      (state: OverviewCasesState): OverviewCasesState => ({
        ...state,
        quotationsCountLoading: true,
      })
    ),
    on(
      OverviewCasesActions.getCasesCountFailure,
      (state: OverviewCasesState, { errorMessage }): OverviewCasesState => ({
        ...state,
        errorMessage,
        quotationsCountLoading: false,
      })
    ),
    on(
      OverviewCasesActions.getCasesCountSuccess,
      (state: OverviewCasesState, { response }): OverviewCasesState => {
        const {
          activeCount,
          inApprovalCount,
          toApproveCount,
          approvedCount,
          rejectedCount,
          archivedCount,
          sharedCount,
        } = response;
        const {
          active,
          approved,
          archived,
          toApprove,
          inApproval,
          rejected,
          shared,
        } = state.quotations;

        const quotations: OverviewCasesStateQuotations = {
          ...state.quotations,
          active: {
            ...active,
            count: activeCount,
          },
          inApproval: {
            ...inApproval,
            count: inApprovalCount,
          },
          toApprove: {
            ...toApprove,
            count: toApproveCount,
          },
          approved: {
            ...approved,
            count: approvedCount,
          },
          rejected: {
            ...rejected,
            count: rejectedCount,
          },
          archived: {
            ...archived,
            count: archivedCount,
          },
          shared: {
            ...shared,
            count: sharedCount,
          },
        };

        return {
          ...state,
          quotations,
          quotationsCountLoading: false,
        };
      }
    ),
    on(
      OverviewCasesActions.loadCases,
      (state: OverviewCasesState, { tab }): OverviewCasesState => ({
        ...state,
        quotations: {
          ...state.quotations,
          activeTab: tab,
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
    // loadCasesSuccess is called when the user switches between tabs
    // on each response it is walked through all possible tabs and check whether the response is for the selected tab,
    // => if so, the quotations of the tab are updated, otherwise the current quotations are returned
    // the count of the cases in the tab is NOT updated
    on(
      OverviewCasesActions.loadCasesSuccess,
      (state: OverviewCasesState, { response }): OverviewCasesState => {
        const {
          active,
          approved,
          archived,
          toApprove,
          inApproval,
          activeTab,
          rejected,
          shared,
        } = state.quotations;

        const quotations: OverviewCasesStateQuotations = {
          ...state.quotations,
          active: {
            ...active,
            quotations: getQuotationsForSelectedTab(
              response,
              active.quotations,
              activeTab,
              QuotationTab.ACTIVE
            ),
          },
          inApproval: {
            ...inApproval,
            quotations: getQuotationsForSelectedTab(
              response,
              inApproval.quotations,
              activeTab,
              QuotationTab.IN_APPROVAL
            ),
          },
          toApprove: {
            ...toApprove,
            quotations: getQuotationsForSelectedTab(
              response,
              inApproval.quotations,
              activeTab,
              QuotationTab.TO_APPROVE
            ),
          },
          approved: {
            ...approved,
            quotations: getQuotationsForSelectedTab(
              response,
              approved.quotations,
              activeTab,
              QuotationTab.APPROVED
            ),
          },
          rejected: {
            ...rejected,
            quotations: getQuotationsForSelectedTab(
              response,
              rejected.quotations,
              activeTab,
              QuotationTab.REJECTED
            ),
          },
          archived: {
            ...archived,
            quotations: getQuotationsForSelectedTab(
              response,
              archived.quotations,
              activeTab,
              QuotationTab.ARCHIVED
            ),
          },
          shared: {
            ...shared,
            quotations: getQuotationsForSelectedTab(
              response,
              shared.quotations,
              activeTab,
              QuotationTab.SHARED
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
 * If the active tab matches given one, return the quotations from response, otherwise return the current quotations.
 * @param response            the http response
 * @param currentQuotations   the current quotations
 * @param selectedTab         the selected tab the request has been made tab
 * @param tabToCheck          the tab to compare with selected one (the given tab)
 * @returns
 */
function getQuotationsForSelectedTab(
  response: GetQuotationsResponse,
  currentQuotations: ViewQuotation[],
  selectedTab: QuotationTab,
  tabToCheck: QuotationTab
) {
  return tabToCheck === selectedTab ? response.quotations : currentQuotations;
}
